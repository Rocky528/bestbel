var Plan = require("../model/schemas/Plan"),
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
        path    : '/plans/{id}',
        handler : defaultHandlers.getById(Plan),
        config  : {
            tags: ["api", "plan"],
            description: "Get plan by id",
            validate: {
                params: {
                    id: validateId
                }
            }
        }
    });

    server.route({
        method  : 'GET',
        path    : '/plans',
        handler : defaultHandlers.getCollection(Plan),
        config  : {
            tags: ["api", "plan"],
            description: "Get plans collection"
        }
    });

    server.route({
        method  : 'POST',
        path    : '/plans',
        handler : defaultHandlers.postHandler(Plan),
        config  : {
            tags: ["api", "plan"],
            description: "Create a new plan",
            validate: {
                payload: validationObject
            }
        }
    });

    server.route({
        method  : 'PUT',
        path    : '/plans/{id}',
        handler : defaultHandlers.updateHandler(Plan),
        config  : {
            tags: ["api", "plan"],
            description: "Update a specific plan",
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
        path    : '/plans/{id}',
        handler : defaultHandlers.deleteHandler(Plan),
        config  : {
            tags: ["api", "plan"],
            description: "Delete an plan by id",
            validate: {
                params: {
                    id: validateId
                }
            }
        }
    });
};
