/**
 * Created by metoikos on 28.12.2017.
 * Project: hapi-moon
 */
const Joi = require('joi');
module.exports = {
    login: Joi.object().keys({
        email: Joi.string().email().required().trim().label('Email').error(new Error('Please enter you email address!')),
        password: Joi.string().min(2).required().trim().label('Password').error(new Error('Please enter your password!'))
    })
};