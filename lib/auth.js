/**
 * Created by metoikos on 28.12.2017.
 * Project: twitter-alarm
 */
const Boom = require('boom');
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
                            throw Boom.unauthorized("Lütfen sisteme giriş yapınız!");
                        }
                        // return h.unauthenticated("Lütfen sisteme giriş yapınız!");
                        // throw Boom.unauthorized("Lütfen sisteme giriş yapınız! x");
                        return h.redirect('/admin_login').takeover()
                    }
                    return h.authenticated({credentials: request.yar.get('auth')});
                }
            }
        };
        server.auth.scheme('basic', implementation);
        server.auth.strategy('simple', 'basic');
        server.auth.default('simple')
    },
    name: 'auth',
    version: require('../package.json').version
};