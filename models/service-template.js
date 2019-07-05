const ServiceTemplateProperty = require("./service-template-property");
const ServiceCategory = require('./service-category');
const ServiceInstance = require('./service-instance');
const User = require('./user');
const File = require("./file");
const Tier = require("./tier");
const PaymentStructureTemplate = require("./payment-structure-template");
const Charges = require("./charge");



const references = [
    {"model":ServiceTemplateProperty, "referenceField": "parent_id", "direction":"from", "readOnly":false},
    {"model":ServiceCategory, "referenceField": "category_id", "direction":"to", "readOnly":true},
    {"model":User, "referenceField": "created_by", "direction":"to", "readOnly": true},
    {"model" :Tier, "referenceField": "service_template_id", "direction" : "from", "readOnly" : false}
];
const ServiceTemplate = require("./base/entity")("service_templates", references);

ServiceTemplate.iconFilePath = "uploads/templates/icons";
ServiceTemplate.imageFilePath = "uploads/templates/images";

ServiceTemplate.prototype.requestPromise = async function (instanceRequest) {
    try {
        const self = this;
        const service_user_id = "";
        let service_description = self.data.description;
        const service_name = self.data.name;
        const paymentStructure = (await PaymentStructureTemplate.find({id: instanceRequest.payment_structure_template_id}))[0]
        if (self.data.detail) {

            // todo : strip out XSS
            service_description = `${service_description} <hr> ${self.data.detail}`;
        }
        // Initialize the new service instance
        const instanceAttributes = {
            name: instanceRequest.name || self.get("name"),
            description: service_description,
            requested_by: instanceRequest.requested_by,
            user_id: instanceRequest.user_id,
            service_id: self.get("id"),
            type: paymentStructure.get("type"),
            split_configuration : paymentStructure.get("split_configuration"),
            status : "requested",
            payment_structure_template_id: paymentStructure.data.id
        };
        const submittedProperties = instanceRequest.references.service_template_properties;
        const ServiceInstance = require('../models/service-instance');
        const service = new ServiceInstance(await ServiceInstance.createPromise(instanceAttributes));
        const props = await service.generateProps(submittedProperties);
        if (paymentStructure.data.type === 'one_time') {
            const charge_obj = {
                'user_id': service.get('user_id'),
                'service_instance_id': service.get('id'),
                'currency': paymentStructure.get('currency'),
                'amount': instanceRequest.amount || paymentStructure.get('amount') || 0,
                'description': service.get('name')
            };
            const charge = await  Charges.createPromise(charge_obj);
        }
        const plan = (paymentStructure.data.type === 'one_time' || paymentStructure.data.type === 'custom' || paymentStructure.data.type === "split") ? {...paymentStructure.data, amount : 0, interval : "day"} : {...paymentStructure.data, ...instanceRequest};
        const payStructure = ((instanceRequest.amount === 0 && paymentStructure.data.type !== "subscription") || instanceRequest.amount === undefined) ? null : (await service.buildPayStructure(plan));
        const payPlan = await service.createPayPlan(payStructure);
        // if (instanceAttributes.requested_by === instanceAttributes.user_id) {
        await service.subscribe();
        // }

        return service;
    }catch(e){
        console.error(e);
        throw e;
    }
};

ServiceTemplate.prototype.deleteFiles = function(callback){
    const self = this;
    Promise.all([ServiceTemplate.iconFilePath, ServiceTemplate.imageFilePath].map(filePath => {
        return new Promise(function(resolveTop,rejectTop){
            File.findFile(filePath, self.get("id"), function(files){
                Promise.all(files.map(file => {
                    return new Promise(function(resolve, reject){
                        file.delete(function(result){
                            resolve(result);
                        })
                    })
                })).then(function(deleted){
                    resolveTop(deleted);
                }).catch(function(err){
                    rejectTop(err);
                })
            })
        })
    })).then(function(result){
        callback()
    }).catch(function(error){
        console.error(error);
    });
};

module.exports = ServiceTemplate;

