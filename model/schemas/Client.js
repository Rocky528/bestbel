var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;
var utils = require("../../lib/utils");
var async = require("async");
var Plan = Mongoose.model("Plan");
var Service = Mongoose.model("Service");

var clientSchema = new Schema({
    name       : String,
    lastname : String,
    email: { type: String, unique: true },
    plans : [{
        type: Schema.ObjectId,
        ref: "Plan"
    }],
    services   : [{
        type: Schema.ObjectId,
        ref: "Service"
    }]
});

clientSchema.pre("find", function (next) {
    this.populate("services");
    this.populate("plans");
    next();
});

clientSchema.pre("findOne", function (next) {
    this.populate("services");
    this.populate("plans");
    next();
});

clientSchema.pre("save", function (next) {
    if (this.plans && this.plans instanceof Array) {
        async.parallel(this.plans
            .map(function (p) {
                return utils.validateModelExists.bind(utils.validateModelExists, Plan, p.id);
            }).concat(this.services.map(function (s) {
                return utils.validateModelExists.bind(utils.validateModelExists, Service, s.id);
            })),
            next
        );
    } else {
        next();
    }
});

module.exports = Mongoose.model("Client", clientSchema);
