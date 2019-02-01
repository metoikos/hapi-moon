/**
 * Created by metoikos on 21.12.2017.
 * Project: hapi-boilerplate
 */

exports.view = {
    description: 'main request handler',
    handler: async (request, h) => {
        return request.auth.credentials;
    }
};
