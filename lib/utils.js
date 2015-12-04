var Boom = require("boom"),
    ObjectId = require("mongoose").Types.ObjectId,
    _ = require("lodash");

/**
 * Takes a function which receives an error handler as the first argument, and
 * returns a function that takes the rest of the arguments.
 *
 * @param {Function} fn
 * @returns {Function}
 */
function throwIfError(fn) {
    if (!fn) fn = function () {};

    return function (err) {

        if (err) {
            if (err instanceof Error) {
                throw err;
            } else {
                throw new Error(err);
            }
        }

        var args = Array.prototype.slice.call(arguments);
        fn.apply(null, args.splice(1));
    };
}



function validateModelExists(Model, modelId, done) {

    //is modelId a Mongoose ObjectId or a hex string?
    if (modelId instanceof ObjectId ||
        (typeof modelId == "string" && ObjectId.isValid(modelId))) {

        //is it already in our db with the given id?
        Model.findById(modelId, function (err, data) {
            if (err) done(Boom.badImplementation(err.message));

            if (data) {
                //Bingo!
                done(null, data);
            } else {
                done(Boom.badData(Model.collection.name + " " +
                    modelId.toString() + " not found"));
            }
        });
    } else {
        //the id is invalid
        done(Boom.badData(modelId.toString() + " is not a valid ObjectId"));
    }
}

/**
 * This function does not create a mixin. It only updates the properties already
 * existing in the object "a" with the properties in object "b".
 *
 * @param a {Object} - Mongoose object whose properties we want updated
 * @param b {Object} - Plain js object whose properties we want to use to update
 *                     the mongoose object
 * @returns {Object} - Updated mongoose object
 */
function updateObject (a, b) {
    //we don't want to override ids
    delete b._id;

    Object.keys(b).forEach(function (key) {
        //We check if the model instance already has a property with that key to
        // prevent adding new properties through this method
        if (a._doc.hasOwnProperty(key)) {
            a[key] = b[key];
        }
    });

    return a;
}

/**
 * Regex to test whether a given string is a 24 character hex string. Should
 * only be used where a regexp is the only option. To check if an object is a
 * mongoose objectID use Mongoose.Types.ObjectId.isValid instead
 *
 * @type {RegExp}
 */
var ObjectIdRegex = /^[0-9a-fA-F]{24}$/;


var toHal = _.curry(function toHal(path, data) {
    return _.extend({
        _links: {
            _self: {
                href: path
            }
        }
    },
    JSON.parse(JSON.stringify(data)));
});


module.exports = {
    throwIfError : throwIfError,
    ObjectIdRegex : ObjectIdRegex,
    validateModelExists: validateModelExists,
    toHal : toHal
};
