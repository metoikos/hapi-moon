/**
 * Created by metoikos on 21.12.2017.
 * Project: hapi-boilerplate
 */

exports.view = {
    description: 'main request handler',
    auth: false, // <= This page is public
    handler: async (request, h) => {
        return h.view('index', {'title': 'Home Page Title', secretLink: true});
    }
};

exports.secretPage = {
    description: 'main request handler',
    handler: async (request, h) => {
        return h.view('index', {'title': 'This page is secret', showLogout: true});
    }
};
