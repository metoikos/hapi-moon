/**
 * Created by metoikos on 28.12.2017.
 * Project: twitter-alarm
 */
const Joi = require('joi');
module.exports = {
    login: Joi.object().keys({
        email: Joi.string().email().required().trim().label('E-posta').error(new Error('Lütfen e-posta adresinizi giriniz!')),
        password: Joi.string().min(2).required().trim().label('Şifre').error(new Error('Lütfen şifrenizi giriniz!'))
    })
};