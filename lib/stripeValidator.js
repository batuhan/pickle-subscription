
const async = require("async");


const validateStripe = function(publishable, secret, cb){
    if(!publishable || !secret){
        return cb("Stripe keys must be entered!");
    }
    async.series([
        function(callback) {
            // Validate Stripe Secret key
            const stripe = require('stripe')(secret);
            stripe.events.list({ limit: 1 }, function(err, result) {
                if(!err) {
                    callback(null, result);
                } else {
                    console.error(err)
                    cb("Invalid Stripe Secret Key");
                }
            });
        },
        function(callback) {
            // Validate Stripe Publishable key
            const request = require("request");
            const dataString = 'card[number]=4242424242424242&card[exp_month]=1&card[exp_year]=2017&card[cvc]=123';
            const options = {
                url: 'https://api.stripe.com/v1/tokens',
                method: 'POST',
                body: dataString,
                auth: {
                    'user': publishable,
                }
            };
            request(options, function(err, response, body){
                const body_json = JSON.parse(body);
                const msg = 'Stripe Keys Validated!';
                if(!body_json.error){
                    cb("Error validating", msg);
                } else if(body_json.error.type == 'card_error') {
                        cb(null, msg);
                    } else {
                        cb("Invalid Stripe Publishable Key");
                    }
            });
        }
    ]);
};

module.exports = validateStripe;