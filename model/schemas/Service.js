var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;

var serviceSchema = new Schema({
    name: String
});

module.exports = Mongoose.model("Service", serviceSchema);