const {call, put, all, select, fork, spawn, take} = require("redux-saga/effects");
const consume = require("pluginbot/effects/consume");
const bcrypt = require('bcryptjs');
const fetch = require("node-fetch");
const Promise = require("bluebird");
const crypto = require('crypto');

function* run(config, provide, channels) {
    const db = yield consume(channels.database);
    yield call(db.createTableIfNotExist, "webhooks", function (table) {
        table.increments();
        table.string('endpoint_url').unique().notNullable();
        table.string("health");
        table.boolean("async_lifecycle").notNullable().defaultTo(true);
        table.timestamps(true, true);
        console.log("Created 'webhooks ' table.");
    });

    // todo: possibly may need to give users ability to set these themselves...
    const headers = {
        "Content-Type": "application/json",
        "Accepts": "application/json"
    };

    const sendToWebhooks = (eventName) => async (event, sync_all = false) => {
        const webhooks = await db("webhooks").where(true, true);
        const webhook_responses = await Promise.reduce(webhooks, async (responses, webhook) => {

            const parsedEvent = Object.entries(event).reduce((acc, [key, eventValue]) => {
                acc[key] = eventValue.data ? eventValue.data : eventValue;
                return acc;
            }, {});
            const eventPayload = JSON.stringify({event_name : eventName, event_data : parsedEvent});
            const hmac = generateHmac(eventPayload, process.env.SECRET_KEY);
            const webhookRequest = fetch(webhook.endpoint_url, {method: "POST", body: eventPayload, headers: {...headers, "X-Servicebot-Signature" : hmac}})
                .then(async response => {
                    if (!response.ok) {
                        console.error("error making webhook request", response.statusText);
                    }
                    const statusText = (response.status >= 200 && response.status <= 299) ? "OK" : response.statusText;
                    await db("webhooks").where("id", webhook.id).update({health: statusText});
                })
                .catch(error => {
                    const health = error.errno || error
                    db("webhooks").where("id", webhook.id).update({health}).then(result => {

                    })
                });

            // if its not async, store responses
            if (!webhook.async_lifecycle || sync_all) {
                try {
                    responses[webhook.endpoint_url] = await (await webhookRequest).json();
                }catch(e){
                    console.error("unable to get response from webhook: ", e);
                }
            }
            return responses
        }, {});
        return {webhook_responses};
    };

    // todo: make this not hardcoded?
    const lifecycleHook = [
        {
            stage: "pre",
            run: sendToWebhooks("pre_provision")
        },
        {
            stage: "post",
            run: sendToWebhooks("post_provision")
        },
        {
            stage: "pre_decom",
            run: sendToWebhooks("pre_decommission")
        },
        {
            stage: "post_decom",
            run: sendToWebhooks("post_decommission")
        },
        {
            stage: "pre_reactivate",
            run: sendToWebhooks("pre_reactivate")
        },
        {
            stage: "post_reactivate",
            run: sendToWebhooks("post_reactivate")
        },
        {
            stage: "pre_property_change",
            run: sendToWebhooks("pre_property_change")
        },
        {
            stage: "post_property_change",
            run: sendToWebhooks("post_property_change")
        },
        {
            stage: "pre_payment_structure_change",
            run: sendToWebhooks("pre_payment_structure_change")
        },
        {
            stage: "post_payment_structure_change",
            run: sendToWebhooks("post_payment_structure_change")
        },
        {
            stage: "post_seat_created",
            run: sendToWebhooks("post_seat_created")
        },
        {
            stage: "post_seat_deleted",
            run: sendToWebhooks("post_seat_deleted")
        },
        {
            stage: "post_cancellation_pending",
            run: sendToWebhooks("post_cancellation_pending")
        },


    ];


    const processWebhooks = async (req, res, next) => {
        const responses = await sendToWebhooks("test")({"event_name": "test", "event_data" : {"test" : "data"}}, true);
        res.json({responses});
    }

    let generateHmac = function(body, secret){
        const hmac = crypto.createHmac('sha256', secret);
        hmac.update(body);
        return hmac.digest('hex');
    };


    const routeDefinition = [
        {
            endpoint: "/webhooks/test",
            method: "post",
            middleware: [processWebhooks],
            permissions: [],
            description: "Test all webhooks"

        }
    ];
    yield provide({lifecycleHook, routeDefinition})
}

module.exports = {run};