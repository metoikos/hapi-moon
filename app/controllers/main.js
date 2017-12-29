/**
 * Created by metoikos on 21.12.2017.
 * Project: hapi-boilerplate
 */
const mongoose = require('mongoose');
const User = mongoose.model('User');
const validators = require('../../lib/validators');

exports.view = {
    description: 'main request handler',
    handler: async (request, h) => {
        return h.view('index', {'title': 'Home Page Title'});
    }
};

exports.login = {
    auth: false,
    validate: {
        payload: validators.login
    },
    plugins: {
        'crumb': {
            restful: false
        }
    },
    description: 'log-in user to system',
    handler: async (request, h) => {
        const result = await User.login(request.payload.email, request.payload.password);
        if (result) {
            request.yar.set('auth', result.apiData());
            return {status: true, result: result.apiData()};
        }

        return h.view('auth', {error: 'Invalid email or password'})
    }
};

exports.loginForm = {
    auth: false,
    plugins: {
        'crumb': {
            restful: false
        }
    },
    description: 'log-in user to system',
    handler: async (request, h) => {

        const user = request.yar.get('auth');
        // if there is a valid session, send user to home page
        if (user && user.id) return h.redirect('/');

        return h.view('auth')
    }
};