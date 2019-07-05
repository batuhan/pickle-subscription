require('dotenv').config({path: require("path").join(__dirname, '../env/.env')});

const store = require("../config/redux/store");
const {triggerEvent} = require("../config/redux/actions");
const ServiceInstance = require("../models/service-instance");


store.initialize().then((result) => {
    console.log(result);
    console.log("HUH");
    ServiceInstance.findOne("id", 1, function (instance) {
        console.log(`found instance ${  instance.get("name")}`);
        store.dispatch(triggerEvent("request_service_instance_admin", instance));
    });
});



