/**
 * Created by metoikos on 22.12.2017.
 * Project: hapi-boilerplate
 */

const Mongoose = require('mongoose');
const Glob = require('glob');
Mongoose.Promise = require('bluebird');

exports.plugin = {
    async register(server, options) {
        Mongoose.connect(options.uri, function (err) {
            if (err) {
                console.log(err);
                throw err;
            }
        });

        // When the connection is disconnected

        Mongoose.connection.on('connected', function () {
            console.log('Mongo Database connected');
        });


        // When the connection is disconnected

        Mongoose.connection.on('disconnected', function () {
            console.log(' Mongo Database disconnected');
        });


        // If the node process ends, close the mongoose connection

        process.on('SIGINT', function () {
            Mongoose.connection.close(function () {
                console.log('Mongo Database disconnected through app termination');
                process.exit(0);
            });
        });

        // Load models
        const models = Glob.sync('app/models/*.js');
        models.forEach(function (model) {
            require('../' + model);
        });
    },
    name: 'mongoose_connector',
    version: require('../package.json').version
};

