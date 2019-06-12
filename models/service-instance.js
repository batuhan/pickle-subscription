// big todo: switch functions to return promises instead of callbacks
const async = require("async");
const File = require("./file");
const ServiceTemplates = require("./service-template");
const ServiceTemplateProperties = require("../models/service-template-property");
const ServiceInstanceProperties = require("./service-instance-property");
const ServiceInstanceMessages = require("./service-instance-message");
const ServiceInstanceCharges = require("./charge");
const ServiceInstanceCancellations = require("./service-instance-cancellation");
const Charges = require("./charge");
const store = require("../config/redux/store");
const { promisify } = require("bluebird");
const promisifyProxy = require("../lib/promiseProxy");
const User = require("./user");
const _ = require("lodash");

const references = [
  {
    model: ServiceInstanceProperties,
    referenceField: "parent_id",
    direction: "from",
    readOnly: true,
  },
  {
    model: ServiceInstanceMessages,
    referenceField: "service_instance_id",
    direction: "from",
    readOnly: true,
  },
  {
    model: ServiceInstanceCharges,
    referenceField: "service_instance_id",
    direction: "from",
    readOnly: true,
  },
  {
    model: ServiceInstanceCancellations,
    referenceField: "service_instance_id",
    direction: "from",
    readOnly: true,
  },
  { model: User, referenceField: "user_id", direction: "to", readOnly: true },
];
const ServiceInstance = require("./base/entity")(
  "service_instances",
  references,
);
const Stripe = require("../config/stripe");

ServiceInstance.serviceFilePath = "uploads/services/files";

const buildPayStructure = function(payment_object, callback) {
  const self = this;
  const plan_arr = [
    "name",
    "amount",
    "currency",
    "interval",
    "interval_count",
    "statement_descriptor",
    "trial_period_days",
  ];
  const random_code =
    Math.random()
      .toString(36)
      .substring(10, 12) +
    Math.random()
      .toString(36)
      .substring(10, 12);
  const default_plan = {
    id: `${payment_object.name.replace(/ +/g, "-")}-ID${self.get(
      "id",
    )}-${random_code}`,
    currency: "usd",
    interval: "month",
    interval_count: 1,
    statement_descriptor: "Subscription",
    trial_period_days: 0,
  };
  const new_plan = _.pick(payment_object, plan_arr);
  const plan = _.assign(default_plan, new_plan);
  if (plan.amount === null) {
    plan.amount = 0;
  }
  plan.statement_descriptor = plan.statement_descriptor.substring(0, 22);
  console.log(plan);

  callback(plan);
};

ServiceInstance.prototype.createPayPlan = async function(plan = null) {
  if (plan === null) {
    const template = (await ServiceTemplates.find({
      id: this.data.service_id,
    }))[0];
    plan = await this.buildPayStructure(template.data);
  }
  if (plan.trial_period_days === null) {
    plan.trial_period_days = 0;
  }
  plan.statement_descriptor = plan.statement_descriptor.substring(0, 22);
  try {
    // TODO: Maybe just always create the new plan. This may be troublesome in the future - try catch bad too...
    this.data.payment_plan = await Stripe().connection.plans.retrieve(plan.id);
  } catch (error) {
    try {
      this.data.payment_plan = await Stripe().connection.plans.create(plan);
    } catch (error) {
      this.data.status = "missing_payment";
      await this.update();
      throw error;
    }
  }
  return this.update();
};

ServiceInstance.prototype.deletePayPlan = async function() {
  const self = this;
  if (self.data.payment_plan.id) {
    // Remove the plan from Stripe
    await Stripe().connection.plans.del(self.data.payment_plan.id);
    self.data.payment_plan = null;
    return await self.update();
  }
  throw "Service is has no current payment plan!";
};

ServiceInstance.prototype.subscribe = async function(paymentPlan = null) {
  let self = this;
  if (self.data.subscription_id) {
    throw "Instance is already subscribed";
  }
  if (paymentPlan) {
    self = await this.changePaymentPlan(paymentPlan);
  }
  const user = (await User.find({ id: self.data.user_id }))[0];
  if (user && user.data.status === "suspended") {
    throw "User is suspended, unable to subscribe";
  }
  const sub_obj = {
    customer: user.data.customer_id,
    plan: self.data.payment_plan.id,
  };

  const subscription = await Stripe().connection.subscriptions.create(sub_obj);
  self.data.subscription_id = subscription.id;
  self.data.status = "running";
  self.data.subscribed_at = subscription.created;
  self.data.trial_end = subscription.trial_end;
  const instanceUpdate = await self.update();
  store.dispatchEvent("service_instance_subscribed", instanceUpdate);
  const charges = await Charges.find({ service_instance_id: self.data.id });
  for (const charge of charges) {
    await charge.approve();
  }
  return instanceUpdate;
};

const requestCancellation = function(callback) {
  const self = this;
  const approve_cancellation = store.getState().options
    .auto_approve_cancellations;
  // Making sure there is only one cancellation request
  const allowed_cancellation_status = [
    "running",
    "requested",
    "waiting",
    "in_progress",
  ];
  if (allowed_cancellation_status.includes(self.data.status)) {
    const cancellationData = {
      service_instance_id: self.data.id,
      user_id: self.data.user_id,
    };
    if (approve_cancellation) {
      cancellationData.status = "approved";
    }
    const newServiceCancellation = new ServiceInstanceCancellations(
      cancellationData,
    );
    newServiceCancellation.create(async function(err, result) {
      // Update the service instance status
      if (approve_cancellation) {
        const unsub = await self.unsubscribe();
        callback(result);
      } else {
        self.data.status = "waiting_cancellation";
        self.update(function(err, updated_instance) {
          callback(result);
        });
      }
    });
  } else {
    callback("Cancellation is not allowed!");
  }
};

const generateProps = function(submittedProperties = null, callback) {
  const self = this;
  ServiceTemplates.findOne("id", self.data.service_id, function(
    serviceTemplate,
  ) {
    // Get all service template properties
    serviceTemplate.getRelated(ServiceTemplateProperties, function(
      resultProperties,
    ) {
      const instanceProperties = [];
      const templateProperties = resultProperties.map(entity => entity.data);
      const submittedMap = _.keyBy(submittedProperties, "id");
      // For every property in the service template
      for (const templateProperty of templateProperties) {
        // Update property value to request value if passed. Otherwise, keep template prop
        if (submittedProperties) {
          if (templateProperty.prompt_user === true) {
            if (submittedMap.hasOwnProperty(templateProperty.id)) {
              templateProperty.data = submittedMap[templateProperty.id].data;
              // templateProperty.config = submittedMap[templateProperty.id].config
            }
          }
        }
        delete templateProperty.created;
        delete templateProperty.id;
        templateProperty.parent_id = self.get("id");
        instanceProperties.push(templateProperty);
      }
      // Create all properties for the service instance
      ServiceInstanceProperties.batchCreate(instanceProperties, function(
        newProps,
      ) {
        callback(newProps);
      });
    });
  });
};

const getAllAwaitingCharges = function(callback) {
  const self = this;
  ServiceInstanceCharges.findAll("service_instance_id", self.data.id, function(
    props,
  ) {
    // Filter the result to only unapproved items.
    callback(
      props.filter(function(charges) {
        return !charges.data.approved;
      }),
    );
  });
};

// TODO: The post response is null. maybe make it more meaningful.
const approveAllCharges = function(callback) {
  const self = this;
  self.getAllAwaitingCharges(function(all_charges) {
    callback(
      all_charges.map(function(charge) {
        charge.approve(function(err, result) {});
      }),
    );
  });
};

const deleteFiles = function(callback) {
  File.findFile(ServiceInstance.serviceFilePath, this.get("id"), function(
    files,
  ) {
    Promise.all(
      files.map(file => {
        return new Promise(function(resolve, reject) {
          file.delete(function(result) {
            resolve(result);
          });
        });
      }),
    )
      .then(function(deleted) {
        callback();
      })
      .catch(function(err) {
        console.error(err);
      });
  });
};

ServiceInstance.prototype.changeProperties = async function(properties) {
  let updatedInstance = await this.attachReferences();
  const oldInstance = { data: { ...updatedInstance.data } };
  // todo: support creating new properties, shouldn't be bad... just need to validate the config
  if (
    properties.some(
      prop => prop.id === null || prop.parent_id !== updatedInstance.get("id"),
    )
  ) {
    throw "prop id bad or parent id does not match";
  }
  const oldProperties =
    updatedInstance.data.references.service_instance_properties;
  let { lifecycleManager } = store.getState(true).pluginbot.services;
  if (lifecycleManager) {
    lifecycleManager = lifecycleManager[0];
    await lifecycleManager.prePropertyChange({
      instance: updatedInstance,
      property_updates: properties,
    });
  }

  const mergedProps = oldProperties.map(prop => {
    const propToMerge = properties.find(reqProp => reqProp.id === prop.id);
    return propToMerge ? { ...prop, data: propToMerge.data } : prop;
  });

  if (this.get("type") === "subscription") {
    const paymentPlan = this.get("payment_plan");
    if (paymentPlan === null || paymentPlan.amount === null) {
      throw "Payment plan not configured properly";
    } else {
      const handlers = (
        store.getState(true).pluginbot.services.inputHandler || []
      ).reduce((acc, handler) => {
        acc[handler.name] = handler.handler;
        return acc;
      }, {});
      const basePrice = require("../lib/handleInputs").getBasePrice(
        oldProperties,
        handlers,
        paymentPlan.amount,
      );
      const newPrice = require("../lib/handleInputs").getPrice(
        mergedProps,
        handlers,
        basePrice,
      );
      paymentPlan.amount = newPrice;
      updatedInstance = await this.changePaymentPlan(paymentPlan, true);
    }
  }
  const updatedProps = await ServiceInstanceProperties.batchUpdate(mergedProps);
  if (lifecycleManager) {
    await updatedInstance.attachReferences();
    await lifecycleManager.postPropertyChange({
      old_instance: oldInstance,
      instance: updatedInstance,
    });
  }

  return updatedInstance;
};

ServiceInstance.prototype.changePaymentPlan = async function(
  newPlan,
  ignorePlanTrial,
) {
  await this.deletePayPlan();
  const planStructure = await this.buildPayStructure(newPlan);
  const updatedInstance = await this.createPayPlan(planStructure);
  if (this.data.subscription_id !== null) {
    const payload = { plan: updatedInstance.data.payment_plan.id };
    if (ignorePlanTrial) {
      payload.trial_from_plan = false;
    }
    const stripeSubscription = await Stripe().connection.subscriptions.update(
      this.data.subscription_id,
      payload,
    );
    const oldTrial = updatedInstance.data.trial_end;
    updatedInstance.data.trial_end = stripeSubscription.trial_end;
    if (oldTrial !== stripeSubscription.trial_end) {
      // todo: handle this better,  don't like dispatching here.
      store.dispatchEvent("service_instance_trial_change", updatedInstance);
    }
  }
  updatedInstance.data.type =
    updatedInstance.data.payment_plan.amount > 0 ? "subscription" : "custom";
  return await updatedInstance.update();
};

ServiceInstance.prototype.unsubscribe = async function() {
  try {
    let { lifecycleManager } = store.getState(true).pluginbot.services;
    if (lifecycleManager) {
      lifecycleManager = lifecycleManager[0];
      await lifecycleManager.preDecommission({
        instance: this,
      });
    }
    if (this.data.subscription_id) {
      // Remove the subscription from Stripe
      await Stripe().connection.subscriptions.del(this.data.subscription_id);
    }
    this.data.subscription_id = null;
    this.data.status = "cancelled";
    let results = await this.update();
    results = await results.attachReferences();
    if (lifecycleManager) {
      lifecycleManager
        .postDecommission({
          instance: results,
        })
        .catch(e => {
          console.error(e);
        });
    }
    return results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// todo: clean this up so they really support promises.
ServiceInstance.prototype.buildPayStructure = promisifyProxy(buildPayStructure);
ServiceInstance.prototype.requestCancellation = promisifyProxy(
  requestCancellation,
);
ServiceInstance.prototype.generateProps = promisifyProxy(generateProps);
ServiceInstance.prototype.getAllAwaitingCharges = promisifyProxy(
  getAllAwaitingCharges,
);
ServiceInstance.prototype.approveAllCharges = promisifyProxy(approveAllCharges);
ServiceInstance.prototype.deleteFiles = promisifyProxy(deleteFiles);

module.exports = ServiceInstance;
