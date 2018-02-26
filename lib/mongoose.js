/**
 * Created by metoikos on 22.12.2017.
 * Project: hapi-boilerplate
 */

const Mongoose = require('mongoose');
const Glob = require('glob');
Mongoose.Promise = require('bluebird');

exports.plugin = {
    async register(server, options) {
        try {
            const conn = await Mongoose.connect(options.uri);
            server.decorate('server', 'mongoose', conn);

            // When the connection is disconnected

            Mongoose.connection.on('connected', function () {
                console.log('Mongo Database connected');
            });

            // When the connection is disconnected
            Mongoose.connection.on('disconnected', function () {
                console.log(' Mongo Database disconnected');
            });

            // If the node process ends, close the mongoose connection
            process.on('SIGINT', async () => {
                await Mongoose.connection.close();
                console.log('Mongo Database disconnected through app termination');
                process.exit(0);
            });

            // Load models
            const models = Glob.sync('app/models/*.js');
            models.forEach(function (model) {
                require('../' + model);
            });
        } catch (e) {
            console.log(e);
            throw e
        }
    },
    name: 'mongoose_connector',
    version: require('../package.json').version
};

