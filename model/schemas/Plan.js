var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;

var planSchema = new Schema({
    name: String
});

module.exports = Mongoose.model("Plan", planSchema);
