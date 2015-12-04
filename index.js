var Hapi = require('hapi');
var mongoose = require("mongoose");
var config = require("./config");
var utils = require("./lib/utils");
var Inert = require("inert");
var Vision = require("vision");

var env = process.env.NODE_ENV || "dev";

mongoose.Promise = require("bluebird");

mongoose.connect(config.db[env]
    .replace("{user}", process.env.MONGO_USR)
    .replace("{pass}", process.env.MONGO_PASSWD)
);

var server = new Hapi.Server();

server.connection(config.connection);

server.env = env;

server.register([
        Inert,
        Vision,
        require("hapi-swagger")
    ],
    function (err) {
        if (err) throw err;
        server.start(function(){
            require("./routes")(server);
            console.log('Server running at:', server.info.uri);
        });
    }
);
