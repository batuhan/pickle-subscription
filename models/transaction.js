
const async = require('async');
const _ = require('lodash');
const Transaction = require("./base/entity")("transactions");
const Stripe = require('../config/stripe');
const User = require('./user');


Transaction.prototype.refund = function (amount=null, reason=null, callback) {
    const self = this;
    const refund = {
        charge : self.get('charge_id')
    };
    if(amount) refund.amount = amount;
    if(reason) refund.reason = reason;
    // Process the refund
    Stripe().connection.refunds.create(refund, function(err, refund) {
        if(!err){
            // Update the charge in the database
            self.syncCharge(function (new_charge) {
                callback(null, new_charge);
            });
        } else {
            callback(err, refund);
        }
    });
}

Transaction.prototype.syncCharge = function (callback) {
    const self = this;
    // Get the new Charge information
    Transaction.fetchCharge(self.get('charge_id'), function (err, new_charge) {
        if(!err){
            const id = self.get('id');
            self.data = new_charge;
            self.data.id = id;
            self.update(function (err, result) {
                callback(result);
            });
        } else {
            callback('Charge does not exist in Stripe!');
        }
    });
}

Transaction.fetchCharge = function (charge_id, callback) {
    // Only process the fetch if the charge is entered.
    if(charge_id) {
        async.waterfall([
            function (callback) {
                // Retrieve the charge from Stripe
                Stripe().connection.charges.retrieve(charge_id, function (err, charge) {
                    if(!err) {
                        charge.charge_id = charge.id;
                        delete charge.id;
                        delete charge.created;
                    }
                    callback(err, charge);
                });
            },
            function (charge, callback) {
                // Find the user associated with the charge
                User.findOne('customer_id', charge.customer, function (user) {
                    if (user.data) {
                        charge.user_id = user.get('id');
                    }
                    callback(null, charge);
                });
            },
            function (charge, callback) {
                // Check if the invoice already exist in the system
                if (charge.invoice) {
                    const Invoice = require('./invoice');
                    Invoice.findOne('invoice_id', charge.invoice, function (invoice) {
                        if (invoice.data) {
                            charge.invoice_id = invoice.get('id');
                        }
                        callback(null, charge);
                    });
                } else {
                    callback(null, charge);
                }
            }
        ], function (err, result) {
            callback(err, result);
        });
    } else {
        callback(null, null);
    }
}

module.exports = Transaction;