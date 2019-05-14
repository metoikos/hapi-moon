/**
 * Created by metoikos on 2019-05-11.
 * Project: hapi-moon
 */
const Lab = require('@hapi/lab');
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = require('@hapi/code').expect;
const Joi = require('@hapi/joi');
const validators = require('../lib/validators');

describe('Validate data validators', () => {

    it('Should accept valid registration payload', async () => {
        let data = {
            name: 'John Doe',
            email: 'sample@test.com',
            password: 'asd12345',
            passwordMatch: 'asd12345',
        };
        const result = Joi.validate(data, validators.register, {abortEarly: false});

        expect(result.error).to.be.null();
        expect(result.error).not.to.exist();
    });

    it('should reject empty payload', async () => {
        let data = {
        };
        const result = Joi.validate(data, validators.register, {abortEarly: false});

        expect(result.error).not.to.null();
        expect(result.error).to.exist();
    });

    it('should reject mismatch passwords', async () => {
        let data = {
            name: 'John Doe',
            email: 'sample@test.com',
            password: 'asd12345',
            passwordMatch: 'asd1234',
        };
        const result = Joi.validate(data, validators.register, {abortEarly: false});

        expect(result.error).not.to.null();
        expect(result.error).to.exist();
    });

    it('should reject invalid email', async () => {
        let data = {
            name: 'John Doe',
            email: 'sample@testcom',
            password: 'asd12345',
            passwordMatch: 'asd12345',
        };
        const result = Joi.validate(data, validators.register, {abortEarly: false});

        expect(result.error).not.to.null();
        expect(result.error).to.exist();
    });

    it('should reject invalid login email', async () => {
        let data = {
            email: 'sample@testcom',
            password: 'asd12345',
        };
        const result = Joi.validate(data, validators.login, {abortEarly: false});

        expect(result.error).not.to.null();
        expect(result.error).to.exist();
    });

    it('Should accept valid login payload', async () => {
        let data = {
            email: 'sample@test.com',
            password: 'asd12345',
        };
        const result = Joi.validate(data, validators.login, {abortEarly: false});

        expect(result.error).to.be.null();
        expect(result.error).not.to.exist();
    });

    it('Should reject valid empty password for login', async () => {
        let data = {
            email: 'sample@test.com',
            password: '',
        };
        const result = Joi.validate(data, validators.login, {abortEarly: false});

        expect(result.error).not.to.null();
        expect(result.error).to.exist();
    });
});
