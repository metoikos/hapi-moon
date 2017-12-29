/**
 * Created by metoikos on 21.12.2017.
 * Project: hapi-boilerplate
 */
exports.plugin = {
    async register(server, options) {
        server.route([
            {
                method: 'GET',
                path: '/',
                options: require('../controllers/main').view
            },

        ]);
    },
    pkg: require('../../package.json'),
    dependencies: 'mongoose_connector'
};