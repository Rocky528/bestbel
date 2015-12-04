var utils = require("../lib/utils");
var throwIfError = utils.throwIfError;
var Boom = require("boom");
var _ =  require("lodash");
var toHal = utils.toHal;

/**
 * Returns the document that matches the given id.
 *
 * @param Model
 * @returns {Function}
 */
module.exports.getById = function (Model) {

    return function (request, reply) {
        Model.findById(request.params.id, throwIfError(function (m) {
            if (m) {
                reply(toHal(request.path, m));
            } else {
                reply(Boom.notFound());
            }
        }));
    };
};

/**
 * Return whole collection. Does not take filters.
 *
 * @param Model
 * @returns {Function}
 */
module.exports.getCollection = function (Model) {

    return function (request, reply) {
        Model.find({}, throwIfError(function (collection) {

            collection = collection.map(function (item) {
                return toHal(request.path + "/" + item._id, item);
            });

            reply(
                toHal(request.path, {
                    items: collection
                })
            );
        }));
    };
};


/**
 * Given a mongoose model returns a function to insert a new document based on
 * the given model
 *
 * @param Model
 * @returns {Function}
 */
module.exports.postHandler = function (Model) {

    return function (request, reply) {
        var a;

        a = new Model(request.payload);

        a.save(throwIfError(function (m) {

                reply(toHal(request.path + "/" + m._id, m));
            })
        );

    };
};


/**
 * Given a mongoose model returns a function to delete a document using the
 * given id
 *
 * @param Model
 * @returns {Function}
 */
module.exports.deleteHandler = function (Model) {

    return function (request, reply) {

        Model.findById(request.params.id,
            throwIfError(function (a) {
                if (a) {

                    a.remove(throwIfError(function () {

                        reply()
                            .code(204)
                            .type('application/json');
                        })
                    );
                } else {
                    reply(Boom.notFound());
                }
            })
        );

    };
};


/**
 * Given a mongoose model returns a function to update said model from a given
 * payload and an id param.
 *
 * @param Model
 * @returns {Function}
 */
module.exports.updateHandler = function (Model) {

    return function (request, reply) {

        var updatedObject = request.payload;

        Model
            .findById(request.params.id)
            .exec(
            throwIfError(function (m) {
                if (m) {
                    Object.keys(updatedObject).forEach(function (key) {
                        //We check if the model instance already has a property
                        //with that key to prevent adding new properties through
                        //this method
                        if (m._doc.hasOwnProperty(key)) {
                            m[key] = updatedObject[key];
                        }
                    });

                    m.save(throwIfError(function (saved) {

                            reply(saved);
                        })
                    );
                } else {
                    reply(Boom.notFound());
                }

            })
        );
    };
};