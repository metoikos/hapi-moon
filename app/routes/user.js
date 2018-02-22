/**
 * Created by metoikos on 21.12.2017.
 * Project: hapi-boilerplate
 */
exports.plugin = {
    async register(server, options) {
        const Controller = require('../controllers/user');
        server.route([
            {
                method: 'GET',
                path: '/',
                options: Controller.view
            },

        ]);
    },
    version: require('../../package.json').version,
    name: 'user-route'
};
