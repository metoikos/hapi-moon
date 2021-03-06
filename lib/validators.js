/**
 * Created by metoikos on 28.12.2017.
 * Project: hapi-moon
 */
const Joi = require('@hapi/joi');
const register = Joi.object().keys({
    name: Joi.string().max(100).min(2).required().trim().label('Name').error(() => 'Please enter your name!'),
    email: Joi.string().email().max(100).required().trim().label('E-mail').error(() => 'Please enter your e-mail address!'),
    password: Joi.string().min(2).required().trim().label('Password').error(() => 'Please enter your password!'),
    passwordMatch: Joi.string().valid(Joi.ref('password')).required().trim().label('Password again').error(() => 'Please enter your password again'),
});
const login = Joi.object().keys({
    email: Joi.string().email().required().trim().label('Email').error(() => 'Please enter you email address!'),
    password: Joi.string().min(2).required().trim().label('Password').error(() => 'Please enter your password!')
});

module.exports = {
    login,
    register,
};
