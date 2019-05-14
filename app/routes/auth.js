/**
 * Created by metoikos on 21.12.2017.
 * Project: hapi-boilerplate
 */
exports.plugin = {
    async register(server, options) {
        const Controller = require('../controllers/auth');
        server.route([
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
            {
                method: 'GET',
                path: '/register',
                options: Controller.registerForm
            },
            {
                method: 'POST',
                path: '/register',
                options: Controller.register
            },
            {
                method: 'POST',
                path: '/register_api',
                options: Controller.registerApi
            },

        ]);
    },
    version: require('../../package.json').version,
    name: 'auth-route'
};
