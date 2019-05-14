/**
 * Created by metoikos on 21.12.2017.
 * Project: hapi-boilerplate
 */
const Boom = require('@hapi/boom');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const validators = require('../../lib/validators');

exports.login = {
    auth: false,
    validate: {
        payload: validators.login
    },
    plugins: {
        crumb: {
            restful: false
        }
    },
    description: 'sign in user to system',
    handler: async (request, h) => {
        const result = await User.login(request.payload.email, request.payload.password);
        if (result) {
            request.yar.set('auth', result.apiData());
            return {status: true, result: result.apiData()};
        }

        return h.view('auth', {error: 'Invalid email or password'}).code(403)
    }
};

exports.loginForm = {
    auth: false,
    plugins: {
        crumb: {
            restful: false
        }
    },
    description: 'show sign in form',
    handler: async (request, h) => {

        const user = request.yar.get('auth');
        // if there is a valid session, send user to home page
        if (user) {
            return h.redirect('/')
        }

        return h.view('auth', {success: request.yar.flash('success')})
    }
};

exports.registerForm = {
    auth: false,
    plugins: {
        crumb: {
            restful: false
        }
    },
    description: 'show register form',
    handler: async (request, h) => {

        const user = request.yar.get('auth');
        // if there is a valid session, send user to home page
        if (user) return h.redirect('/');

        return h.view('register')
    }
};

exports.register = {
    auth: false,
    plugins: {
        crumb: {
            restful: false
        }
    },
    validate: {
        payload: validators.register
    },
    description: 'register user',
    handler: async (request, h) => {
        try {
            const {name, email, password} = request.payload;
            const user = new User({name, email, password, active: true});
            await user.save();
            request.yar.flash('success', 'User registration successful!');

            return h.redirect('/auth/login')
        } catch (e) {
            if (e.code && e.code === 11000) {
                return Boom.badRequest("The email address you used already registered. Please check your details!");
            }

            /* $lab:coverage:off$ */
            request.server.log(['error', 'client', 'createUser'], e);

            return Boom.badRequest(e.message, e);
            /* $lab:coverage:on$ */
        }
    }
};

exports.registerApi = {
    auth: false,
    validate: {
        payload: validators.register
    },
    description: 'register user with api request',
    handler: async (request, h) => {
        try {
            const {name, email, password} = request.payload;
            const user = new User({name, email, password, active: true});
            await user.save();
            request.yar.flash('success', 'User registration successful!');

            return {status: true, message: "User created successfully"}
        } catch (e) {
            if (e.code && e.code === 11000) {
                return Boom.badRequest("The email address you used already registered. Please check your details!");
            }

            /* $lab:coverage:off$ */
            request.server.log(['error', 'client', 'createUser'], e);

            return Boom.badRequest(e.message, e);
            /* $lab:coverage:on$ */
        }
    }
};

exports.logout = {
    auth: false,
    plugins: {
        crumb: {
            restful: false
        }
    },
    description: 'sign out the user',
    handler: async (request, h) => {
        request.yar.clear('auth');
        return h.redirect('/')
    }
};
