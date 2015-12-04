var Service = require("../model/schemas/Service"),
    defaultHandlers = require("./defaultHandlers"),
    utils = require("../lib/utils");


module.exports = function (server) {
    var joi = require("joi");
    var validationObject = {
        name: joi.string().required()
    };
    var validateId = joi.string().regex(utils.ObjectIdRegex);

    server.route({
        method  : 'GET',
        path    : '/services/{id}',
        handler : defaultHandlers.getById(Service),
        config  : {
            tags: ["api", "service"],
            description: "Get service by id",
            validate: {
                params: {
                    id: validateId
                }
            }
        }
    });

    server.route({
        method  : 'GET',
        path    : '/services',
        handler : defaultHandlers.getCollection(Service),
        config  : {
            tags: ["api", "service"],
            description: "Get services collection"
        }
    });

    server.route({
        method  : 'POST',
        path    : '/services',
        handler : defaultHandlers.postHandler(Service),
        config  : {
            tags: ["api", "service"],
            description: "Create a new service",
            validate: {
                payload: validationObject
            }
        }
    });

    server.route({
        method  : 'PUT',
        path    : '/services/{id}',
        handler : defaultHandlers.updateHandler(Service),
        config  : {
            tags: ["api", "service"],
            description: "Update a specific service",
            validate: {
                params : {
                    id: validateId
                },
                payload: validationObject
            }
        }
    });

    server.route({
        method  : 'DELETE',
        path    : '/services/{id}',
        handler : defaultHandlers.deleteHandler(Service),
        config  : {
            tags: ["api", "service"],
            description: "Delete an service by id",
            validate: {
                params: {
                    id: validateId
                }
            }
        }
    });
};
