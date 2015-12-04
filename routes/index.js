module.exports = function (server) {
    require("./service")(server);
    require("./plan")(server);
    require("./client")(server);
};
