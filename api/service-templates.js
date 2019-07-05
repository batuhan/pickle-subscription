const async = require('async');
const multer = require("multer");
const mkdirp = require("mkdirp");
const path = require("path");
const _ = require("lodash");
const xss = require('xss');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const EventLogs = require('../models/event-log');
const File = require("../models/file");
const Fund = require('../models/fund');
const Invitation = require('../models/invitation');
const ServiceCategory = require('../models/service-category');
const ServiceTemplate = require('../models/service-template');
const ServiceInstance = require("../models/service-instance");
const ServiceTemplateProperty = require("../models/service-template-property");
const Role = require('../models/role');
const User = require('../models/user');
const store = require("../config/redux/store");
// todo: generify single file upload for icon, image, avatar, right now duplicate code
const {iconFilePath} = ServiceTemplate;
const {imageFilePath} = ServiceTemplate;
const slug = require("slug");
const {validateProperties} = require("../lib/handleInputs");
const Tier = require("../models/tier");
const PaymentStructureTemplate = require("../models/payment-structure-template");

const fileManager = store.getState(true).pluginbot.services.fileManager[0];
const jwt = require('jsonwebtoken');



const upload = (path) => {
    return multer({storage: fileManager.storage(path), limits : {fileSize : uploadLimit()}})
}


let uploadLimit = function () {

    return store.getState().options.upload_limit * 1000000;

}


const emptyImage = new Buffer([0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3b]);
// todo - entity posting should have correct error handling, response should tell user what is wrong like if missing column


module.exports = function (router) {

    // strips out possible xss
    router.post(function (req, res, next) {
        if (req.body && req.body.details != null) {
            req.body.details = xss(req.body.details);
        }
        next();
    })

    router.get('/service-templates/:id(\\d+)/icon', validate(ServiceTemplate), function (req, res, next) {
        const {id} = req.params;
        File.findFile(iconFilePath, id, function (icon) {
            if (icon.length > 0) {
                const file = icon[0];
                fileManager.sendFile(file, res);
            } else {
                res.status(404).json({"error": "image not found"})

                // res.send(emptyImage, { 'Content-Type': 'image/gif' }, 404);
            }
        })

    });
    router.put('/service-templates/:id(\\d+)/icon', auth(null, ServiceTemplate, 'created_by'), upload(iconFilePath).single("template-icon"), function (req, res, next) {
        const {file} = req;
        file.user_id = req.user.get('id');
        file.name = file.originalname;
        File.findFile(iconFilePath, req.params.id, function (templateIcon) {
            if (templateIcon.length > 0) {
                const iconToDelete = templateIcon[0];
                fileManager.deleteFile(iconToDelete);
            }
            const icon = new File(file);
            icon.create(function (err, result) {
                result.message = "Icon Uploaded"
                res.json(result);
            })
        })

    });
    router.delete("/service-templates/:id(\\d+)/icon", validate(ServiceTemplate), auth(null, ServiceTemplate, 'created_by'), function (req, res, next) {
        File.findFile(iconFilePath, req.params.id, function (icon) {
            fileManager.deleteFile(icon[0]).then(function () {
                res.json({message: "File Deleted!"});
            })
        })
    });


    router.delete("/service-templates/:id(\\d+)/image", validate(ServiceTemplate), auth(null, ServiceTemplate, 'created_by'), function (req, res, next) {
        File.findFile(imageFilePath, req.params.id, function (image) {
            fileManager.deleteFile(image[0]).then(function () {
                res.json({message: "File Deleted!"});
            })
        })
    });


    router.get('/service-templates/:id(\\d+)/image', validate(ServiceTemplate), function (req, res, next) {
        const {id} = req.params;
        File.findFile(imageFilePath, id, function (image) {
            if (image.length > 0) {
                const file = image[0];
                fileManager.sendFile(file, res);
            } else {
                // todo: default image logic goes here
                res.status(404).json({"error": "image not found"})
                // res.send(emptyImage, { 'Content-Type': 'image/gif' }, 404);
            }
        })

    });

    router.put('/service-templates/:id(\\d+)/image', auth(null, ServiceTemplate, 'created_by'), upload(imageFilePath).single('template-image'), function (req, res, next) {
        const {file} = req;
        file.user_id = req.user.get('id');
        file.name = file.originalname;
        File.findFile(imageFilePath, req.params.id, function (image) {
            if (image.length > 0) {
                const imageToDelete = image[0];
                fileManager.deleteFile(imageToDelete);
            }
            const imageToCreate = new File(file);
            imageToCreate.create(function (err, result) {
                result.message = "Image Uploaded"
                res.json(result);
            })
        })

    });

    router.get('/service-templates/:id/request', validate(ServiceTemplate), async function (req, res, next) {
        const serviceTemplate = res.locals.valid_object;
        const tiers = await Tier.find({service_template_id: serviceTemplate.data.id}, true);
        serviceTemplate.data.references = {};
        res.locals.valid_object.data.references.tiers = tiers.map(tier => tier.data);
        serviceTemplate.getRelated(ServiceTemplateProperty, function (props) {
            // this object for authenticated call
            res.locals.valid_object.data.references[ServiceTemplateProperty.table] = props.map(entity => entity.data);
            if (serviceTemplate.get('published') == true) {

                if (!req.isAuthenticated()) {
                    const publicProps = _.filter(props, (prop => !prop.data.private));
                    serviceTemplate.data.references[ServiceTemplateProperty.table] = publicProps.map(entity => entity.data);
                    delete serviceTemplate.data.overhead;
                    res.json(serviceTemplate.data);
                }
                else {
                    next();
                }
            }
            else {
                next();
            }
        });

    });
    router.get('/service-templates/:id/request', auth(), function (req, res, next) {

        const serviceTemplate = res.locals.valid_object;
        const permission_array = res.locals.permissions;
        const hasPermission = (permission_array.some(p => p.get("permission_name") == "can_administrate" || p.get("permission_name") == "can_manage"));
        if (serviceTemplate.get('published') == true || hasPermission) {
            if(hasPermission){
                res.json(serviceTemplate.data);
            }
            else{
                const publicProps = _.filter(serviceTemplate.data.references[ServiceTemplateProperty.table], (prop => !prop.private));
                serviceTemplate.data.references[ServiceTemplateProperty.table] = publicProps;
                delete serviceTemplate.data.overhead;
                res.json(serviceTemplate.data);
            }
        }
        else {
            next();
        }
    });

    // added reject to auth cuz it needs to handle failures, preventing memory leaks
    const authPromise = function(req, res){
        return new Promise((resolve, reject) => {
            if(req.isAuthenticated()){
                auth()(req, res, resolve, reject)
            }else{
                resolve();
            }
        })
    };


    // middleware to validate and adjust price.. todo: move price adjjustment somewhere else
    const validateServiceRequest = async function (req, res, next) {
        try {
            if(!store.getState().options.stripe_publishable_key){
                throw "Cannot request, no Stripe Key";
            }
            const serviceTemplate = res.locals.valid_object;
            const props = (await serviceTemplate.getRelated(ServiceTemplateProperty)) || null;
            const req_body = req.body;
            const reqProps = req_body.references && req_body.references.service_template_properties || [];
            const paymentStructureTemplate = (await PaymentStructureTemplate.find({id: req_body.payment_structure_template_id}))[0];

            // check if the payment structure exists
            if(!paymentStructureTemplate){
                return res.status(400).json({error: 'Payment structure template not found'});
            }
            const tier = (await Tier.find({id: paymentStructureTemplate.data.tier_id, service_template_id: serviceTemplate.data.id}))[0];
            
            // check if the structure's tier belongs to the template
            if(!tier){
                return res.status(400).json({error: 'Payment Structure does not belong to this service template'});
            }
            res.locals.tier = tier;
            await authPromise(req, res);
            const permission_array = res.locals.permissions || [];
            const handlers = (store.getState(true).pluginbot.services.inputHandler || []).reduce((acc, handler) => {
                acc[handler.name] = handler.handler;
                return acc;
            }, {});
            // this is true when user can override things
            const hasPermission = (permission_array.some(p => p.get("permission_name") === "can_administrate" || p.get("permission_name") === "can_manage"));
            const templatePrice = paymentStructureTemplate.get("amount");
            let price = hasPermission ? (req_body.amount || templatePrice) : templatePrice;
            const trialPeriod = paymentStructureTemplate.get("trial_period_days");

            // todo: this doesn't do anthing yet, needs to check the "passed" props not the ones on the original...
            // let validationResult = props ? validateProperties(props, handlers) : [];
            // if (validationResult.length > 0) {
            //     return res.status(400).json({error: validationResult});
            // }

            // todo: less looping later
            let metricIndex = null;
            const mergedProps = props.map((prop, index) => {
                const propToMerge = reqProps.find(reqProp => reqProp.id === prop.data.id);
                const mergedProp = propToMerge ? {...prop.data, "data" : propToMerge.data} : prop
                if(mergedProp.type === "metric" && mergedProp.config.pricing && mergedProp.config.pricing.tiers && !mergedProp.config.pricing.tiers.includes(tier.data.name)){
                    metricIndex = index;
                }
                return mergedProp;
            });
            if (props) {
                const priceProps = [...mergedProps];
                if(metricIndex !== null){
                    priceProps.splice(metricIndex, 1);
                }

                price = require("../lib/handleInputs").getPrice(priceProps, handlers, price);

            }

            // set trial period to 0 if null
            res.locals.valid_object.data.trial_period_days = res.locals.valid_object.data.trial_period_days || 0;

            res.locals.adjusted_price = price;
            res.locals.merged_props = mergedProps;
            res.locals.payment_structure_template = paymentStructureTemplate;
            if (!req.isAuthenticated() || (req_body.hasOwnProperty("email") && req.user.data.email !== req_body.email)) {

                if (req_body.hasOwnProperty("email")) {
                    const mailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (!req_body.email.match(mailFormat)) {
                        return res.status(400).json({error: 'Invalid email format'});
                    }
                } else {
                    return res.status(400).json({error: 'Must have property: email'});
                }

                if ((!req_body.hasOwnProperty("token_id") || req_body.token_id === '') && price !== 0 && trialPeriod <= 0) {
                    return res.status(400).json({error: 'Must have property: token_id'});
                }

                const user = await User.findOne("email", req_body.email);
                if (user.data) {
                    if(hasPermission){
                        req.body.client_id = user.get("id");
                        res.locals.request_for = user;
                        return next();
                    }
                    const invitation = await Invitation.findOne("user_id", user.get("id"));
                    if (invitation.data) {
                        return res.status(400).json({error: 'User has already been invited'});

                    } 
                        return res.status(400).json({error: 'Email already exists'});
                    
                }

            }
            return next();

        }catch(error){
            console.error("error validating....", error);
            res.status(500).json({error});
        }
    }

    /**
     * The request function will request a new service instance for an unauthenticated user
     * Creates a new user and adds payment information
     * Requires:
     * user email
     * service template request details
     *
     */

    router.post("/service-templates/:id/request", validate(ServiceTemplate), validateServiceRequest, async function (req, res, next) {
        let isNew;
        let user;
        try {
            const serviceTemplate = res.locals.valid_object;
            const {references} = serviceTemplate;
            const paymentStructureTemplate = res.locals.payment_structure_template;
            const props = references ? references.service_template_properties : null;
            const req_body = req.body;
            if(!req_body.references){
                req_body.references = {};
            }
            req_body.references.service_template_properties = res.locals.merged_props;
            const Promise = require("bluebird");
            const permission_array = res.locals.permissions || [];
            const hasPermission = (permission_array.some(p => p.get("permission_name") === "can_administrate" || p.get("permission_name") === "can_manage"));

            const responseJSON = {};
            // using promiseProxy for non-standard callbacks
            user = req.user;

            // is the user authenticated (are they logged in)?
            isNew = !req.isAuthenticated() || (req_body.hasOwnProperty("email") && !req_body.hasOwnProperty("client_id") && req.user.data.email !== req_body.email);
            const store = require('../config/redux/store');

            // todo: once in plugin this code needs big changes
            let {lifecycleManager} = store.getState(true).pluginbot.services;
            if(lifecycleManager) {
                lifecycleManager = lifecycleManager[0];
                try {
                    await lifecycleManager.preProvision({
                        request: req_body,
                        template: serviceTemplate
                    });
                } catch (e) {
                    return res.status(400).json({error: e});
                }

            }
            // if it's a new user request we need to create an account, invitation
            // todo: move this part into a function
            if (isNew && serviceTemplate.get('published')) {

                const globalProps = store.getState().options;
                const roleId = globalProps.default_user_role;

                const newUser = new User({"email": req_body.email, "role_id": roleId, "status": "active"});
                if(req_body.password){
                    const password = require("bcryptjs").hashSync(req_body.password, 10);

                    newUser.set("password", password)
                    newUser.set("status", "active");
                }
                if(req_body.userName){
                    newUser.set("name", req_body.userName);
                }
                if(req_body.token){
                    newUser.set("google_user_id", req_body.token);
                }
                // promisify the createWithStripe function
                const createUser = Promise.promisify(newUser.createWithStripe, {context: newUser});

                // create the new user
                const createdUser = await createUser();
                // if(!req_body.password) {
                //     let invite = new Invitation({"user_id": createdUser.get("id")});
                //     let createInvite = Promise.promisify(invite.create, {context: invite});
                //     //create the invitation for the user.
                //     let createdInvite = await createInvite();
                //     responseJSON.api = req.protocol + '://' + req.get('host') + "/api/v1/users/register?token=" + createdInvite.get("token");
                //     responseJSON.url = req.protocol + '://' + req.get('host') + "/invitation/" + createdInvite.get("token");
                //
                // }
                const user_role = new Role({id : createdUser.get("role_id")}) ;

                // todo : remove this once it supports promises
                if(!req.isAuthenticated()) {
                    const permissionPromise = new Promise(resolve => {
                        user_role.getPermissions(function (perms) {
                            const permission_names = perms.map(perm => perm.data.permission_name);
                            return resolve(permission_names);
                        });
                    });

                    const loginPromise = new Promise((resolve, reject) => {
                        req.logIn(createdUser, {session: true}, (err) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve();
                            }
                        });

                    });

                    // log in the user (give them a cookie)
                    await loginPromise;

                    // set some data for the response

                    // currently the permissions that the client app sets get passed here.
                    responseJSON.permissions = await permissionPromise;
                }
                responseJSON.uid = createdUser.get("id");

                user = createdUser;


            }else if(!serviceTemplate.get('published') && !hasPermission){
                return res.status(403).json({"error" : "Unauthorized"});
            }


            let newFund = null;
            // if token_id exists, create/update the user's fund
            if (req_body.token_id && req_body.token_id !== '') {
                newFund = Fund.promiseFundCreateOrUpdate(req_body.client_id || user.get('id'), req_body.token_id);
            }

            // create the service instance

            // adjusted price...
            req_body.amount = res.locals.adjusted_price;
            // elevated accounts can override things
            if (hasPermission) {
                res.locals.overrides = {
                    user_id : req_body.client_id || user.get("id"),
                    requested_by : req.user.get("id"),
                    description : req_body.description || serviceTemplate.get("description"),
                    name : req_body.name || serviceTemplate.get("name"),
                    trial_period_days : req_body.trial_period_days || paymentStructureTemplate.get("trial_period_days")
                };


            }else{
                res.locals.overrides = {
                    user_id : user.get("id"),
                    requested_by : req.user.get("id"),
                    trial_period_days : paymentStructureTemplate.get("trial_period_days") || 0
                }
            }

            await  newFund;

            let newInstance = await serviceTemplate.requestPromise({
                ...req_body,
                ...res.locals.overrides,

            });

            newInstance = await newInstance.attachReferences();
            let postData = {};
            if(lifecycleManager) {
                postData = await lifecycleManager.postProvision({
                    request: req_body,
                    instance: newInstance,
                    template: serviceTemplate
                });
            }
            if(isNew){
                const newUser = (await User.find({id: user.get("id")}, true))[0];
                responseJSON.token = jwt.sign({ uid: user.get("id"), user: newUser.data }, process.env.SECRET_KEY, { expiresIn: '1h' });
            }
            res.json({
                ...responseJSON,
                ...newInstance.data,
                ...postData,
                request: req_body
            });

            try {
                newInstance.data.properties = newInstance.data.references.service_instance_properties.reduce((acc, prop) => {
                    acc[prop.name] = prop.data && prop.data.value;
                    return acc;
                }, {});
                if(newInstance.data.references.payment_structure_templates[0].type === "custom"){
                    store.dispatchEvent("service_instance_custom_requested_by_user", newInstance);
                }else if (isNew && req_body.password === undefined) {

                    // newInstance.set("api", responseJSON.api);
                    // newInstance.set("url", responseJSON.url);
                    // store.dispatchEvent("service_instance_requested_new_user", newInstance);
                    store.dispatchEvent("service_instance_requested_by_user", newInstance);

                }else if(isNew){
                    store.dispatchEvent("service_instance_requested_by_user", newInstance);
                }else if (req.uid !== newInstance.get("user_id")) {
                    store.dispatchEvent("service_instance_requested_by_user", newInstance);

                } else {
                    store.dispatchEvent("service_instance_requested_by_user", newInstance);
                }
            }catch(e){
                console.error("error during dispatchin", e);
            }

        } catch (error) {
            console.error(error);
            if(isNew && user){
                user.deleteWithStripe(function(err, result){
                    console.log("deleted user: ", result, err);
                });
            }
            return res.status(500).json({error});
        }


    });


    router.post("/service-templates", auth(), function (req, res, next) {
        req.body.created_by = req.user.get("id");
        // req.body.trial_period_days = req.body.trial_period_days || 0;
        // req.body.currency = store.getState().options.currency;
        const properties = req.body.references && req.body.references.service_template_properties;
        const tiers = req.body.references && req.body.references.tiers;

        if(tiers) {
            req.body.references.tiers = tiers.map(tier => {
                const paymentTemplates = tier.references && tier.references.payment_structure_templates || [];
                tier.references.payment_structure_templates = paymentTemplates.map(payment => {
                    payment.currency = store.getState().options.currency;
                    return payment;
                })
                return tier;
            })
        }
        if(properties){
            req.body.references.service_template_properties = properties.map(prop => {
                return {
                    ...prop,
                    name : slug(prop.prop_label, {lower : true})
                };
            });
        }

        ServiceTemplate.findAll("name", req.body.name, (templates) => {
            if (templates && templates.length > 0) {
                res.status(400).json({error: "Service template name already in use"})
            } else {
                next();
            }
        })
    });

    router.put(`/service-templates/:id(\\d+)`, validate(ServiceTemplate), auth(), function(req, res, next) {
        req.body.trial_period_days = req.body.trial_period_days || 0;
        req.body.currency = store.getState().options.currency;
        const properties = req.body.references && req.body.references.service_template_properties;
        if(properties){
            req.body.references.service_template_properties = properties.map(prop => {
                return {
                    ...prop,
                    name : slug(prop.prop_label, {lower : true})
                };
            });
        }
        // todo: add validation for name.
        next();
    });


    router.get("/service-templates/public", function (req, res, next) {
        const key = "published";
        const value = true;

        new Promise((resolve, reject) => {
            // Get the list of templates and apply order from query if requested
            if (req.query.order_by) {
                let order = 'ASC';
                if (req.query.order) {
                    if (req.query.order.toUpperCase() === 'DESC') {
                        order = 'DESC';
                    }
                }
                ServiceTemplate.findAllByOrder(key, value, req.query.order_by, order, templates => {
                    if (templates.length == 0) {
                        reject([])
                    }
                    else {
                        resolve(templates);
                    }
                })
            }
            else {
                ServiceTemplate.findAll(key, value, templates => {
                    if (templates.length == 0) {
                        resolve([])
                    }
                    else {
                        resolve(templates);
                    }
                })
            }
        })
            .then((templates) => {
                // Apply the query limit to the array of templates
                return new Promise((resolve, reject) => {
                    if (req.query.limit) {
                        if (isNaN(req.query.limit)) {
                            console.error(`limit ${req.query.limit} is not a number`);
                            reject(`limit ${req.query.limit} must be a number`)
                        }
                        else {
                            resolve(templates.slice(0, req.query.limit));
                        }
                    }
                    else {
                        resolve(templates);
                    }
                });
            })
            .then(templates => {
                // Attach references to templates
                return Promise.all(templates.map(template => {
                    return new Promise((resolve, reject) => {
                        template.attachReferences(updatedParent => {
                            resolve(updatedParent);
                        })
                    })
                }))
            })
            .then(templates => {
                // send response
                res.json(templates.map(function (entity) {
                    delete entity.data.overhead;
                    return entity.data
                }))
            })
            .catch(err => {
                // send error response
                console.error('Error with Get public templates request: ', err);
                res.status(400).json({error: err});
            });
    });


    router.get(`/service-templates/search`, function (req, res, next) {
        function getPublicSearch() {
            new Promise((resolve, reject) => {
                ServiceTemplate.search(req.query.key, req.query.value, function (templates) {
                    if (templates.length == 0) {
                        reject('No published templates found with search criteria')
                    }
                    else {
                        resolve(templates);
                    }
                })
            })
                .then(templates => {
                    // filter for published templates
                    return new Promise((resolve, reject) => {
                        resolve(_.filter(templates, 'data.published'));
                    });
                })
                .then(templates => {
                    // Attach references to templates
                    return Promise.all(templates.map(template => {
                        return new Promise((resolve, reject) => {
                            template.attachReferences(updatedParent => {
                                resolve(updatedParent);
                            })
                        })
                    }))
                })
                .then(templates => {
                    // send response
                    res.json(templates.map(function (entity) {
                        delete entity.data.overhead;
                        return entity.data
                    }))
                })
                .catch(err => {
                    // send error response
                    console.error('Error with Get public templates request: ', err);
                    res.status(400).json({error: err});
                });
        }

        if (!req.isAuthenticated()) {
            getPublicSearch();
        }
        else {
            // If the user is authenticated and has the role 'user' allow to see public templates
            new Promise((resolve, reject) => {
                Role.findOne("id", req.user.get("role_id"), function (role) {
                    resolve(role.get('role_name') === 'user');
                })
            })
                .then(function (isUser) {
                    if (isUser) {
                        getPublicSearch();
                    }
                    else {
                        // admin or staff go to entity route
                        next();
                    }
                });
        }

    });

    // before generics
    require("./entity")(router, ServiceTemplate, "service-templates");
    // after generics

    // Todo: service template files need to be removed upon template removal
    // router.delete("/service-templates/:id(\\d+)", validate(ServiceTemplate), auth(), function(req, res, next){
    //     res.locals.valid_object.deleteFiles(function(){
    //         next();
    //     })
    // });

    return router;
};