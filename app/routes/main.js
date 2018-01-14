/**
 * Created by metoikos on 21.12.2017.
 * Project: hapi-boilerplate
 */
exports.plugin = {
    async register(server, options) {
        const Controller = require('../controllers/main');
        server.route([
            {
                method: 'GET',
                path: '/',
                options: Controller.view
            },
            {
                method: 'GET',
                path: '/login',
                options: Controller.loginForm
            },
            {
                method: 'POST',
                path: '/login',
                options: Controller.login
            },
            {
                method: 'GET',
                path: '/logout',
                options: Controller.logout
            },

        ]);
    },
    version: require('../../package.json').version,
    name: 'main-route'
};