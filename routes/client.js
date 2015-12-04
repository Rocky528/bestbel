var Client = require("../model/schemas/Client"),
    defaultHandlers = require("./defaultHandlers"),
    utils = require("../lib/utils");


module.exports = function (server) {
    var joi = require("joi");
    var validationObject = {
        name: joi.string().required(),
        lastname: joi.string().required(),
        email: joi.string().required(),

    };
    var validateId = joi.string().regex(utils.ObjectIdRegex);

    server.route({
        method  : 'GET',
        path    : '/clients/{id}',
        handler : defaultHandlers.getById(Client),
        config  : {
            tags: ["api", "client"],
            description: "Get client by id",
            validate: {
                params: {
                    id: validateId
                }
            }
        }
    });

    server.route({
        method  : 'GET',
        path    : '/clients',
        handler : defaultHandlers.getCollection(Client),
        config  : {
            tags: ["api", "client"],
            description: "Get clients collection"
        }
    });

    server.route({
        method  : 'POST',
        path    : '/clients',
        handler : defaultHandlers.postHandler(Client),
        config  : {
            tags: ["api", "client"],
            description: "Create a new client",
            validate: {
                payload: validationObject
            }
        }
    });

    server.route({
        method  : 'PUT',
        path    : '/clients/{id}',
        handler : defaultHandlers.updateHandler(Client),
        config  : {
            tags: ["api", "client"],
            description: "Update a specific client",
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
        path    : '/clients/{id}',
        handler : defaultHandlers.deleteHandler(Client),
        config  : {
            tags: ["api", "client"],
            description: "Delete an client by id",
            validate: {
                params: {
                    id: validateId
                }
            }
        }
    });
};
