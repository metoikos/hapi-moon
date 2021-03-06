/**
 * Created by metoikos on 28.12.2017.
 * Project: hapi-moon
 */
const Boom = require('@hapi/boom');
exports.plugin = {
    async register(server, options) {
        const implementation = function (server, options) {

            return {
                authenticate: function (request, h) {
                    // if there is no session information
                    if (!request.yar.get('auth')) {
                        const headers = request.headers;
                        // if this request is xmlhttp then return as json
                        if (headers['x-requested-with'] === 'XMLHttpRequest') {
                            throw Boom.unauthorized("Please login to system");
                        }
                        // redirect user to login page
                        return h.redirect('/auth/login').takeover()
                    }
                    return h.authenticated({credentials: request.yar.get('auth')});
                }
            }
        };
        server.auth.scheme('basic', implementation);
        server.auth.strategy('simple', 'basic');
        server.auth.default('simple')
    },
    name: 'authentication-rules',
    version: require('../package.json').version
};
