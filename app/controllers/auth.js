/**
 * Created by metoikos on 21.12.2017.
 * Project: hapi-boilerplate
 */
const mongoose = require('mongoose');
const User = mongoose.model('User');
const validators = require('../../lib/validators');

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
    description: 'sign in user to system',
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
    description: 'show sign in form',
    handler: async (request, h) => {

        const user = request.yar.get('auth');
        // if there is a valid session, send user to home page
        if (user && user.id) return h.redirect('/');

        return h.view('auth', {success: request.yar.flash('success')})
    }
};

exports.registerForm = {
    auth: false,
    plugins: {
        'crumb': {
            restful: false
        }
    },
    description: 'show register form',
    handler: async (request, h) => {

        const user = request.yar.get('auth');
        // if there is a valid session, send user to home page
        if (user && user.id) return h.redirect('/');

        return h.view('register')
    }
};

exports.register = {
    auth: false,
    plugins: {
        'crumb': {
            restful: false
        }
    },
    validate: {
        payload: validators.register
    },
    description: 'register user',
    handler: async (request, h) => {

        const {name, email, password} = request.payload;
        const user = new User({name, email, password, active: true});
        await user.save();
        request.yar.flash('success', 'User registration successful!');

        return h.redirect('/')
    }
};

exports.logout = {
    auth: false,
    plugins: {
        'crumb': {
            restful: false
        }
    },
    description: 'sign out the user',
    handler: async (request, h) => {
        request.yar.reset();
        return h.redirect('/')
    }
};
