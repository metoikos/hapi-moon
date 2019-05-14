/**
 * Created by metoikos on 12.05.2019.
 * Project: hapi-moon
 */
const Lab = require('@hapi/lab');
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const after = lab.after;
const expect = require('@hapi/code').expect;
const Glue = require('@hapi/glue');
const serverConfig = require('../config/manifest');
const helpers = require("../lib/utils");
const dirname = `${__dirname}/../`;
const options = {...serverConfig.options, relativeTo: dirname};
describe('Validate auth routes', () => {
    let server, cookie;
    before(async () => {
        server = await Glue.compose(serverConfig.manifest, options);

        const res = await server.inject({
            url: `/`,
            method: 'get'
        });
        const header = res.headers['set-cookie'];

        // ref: https://github.com/hapijs/crumb/blob/master/test/index.js#L134
        cookie = header[0].match(/crumb=([^\x00-\x20\"\,\;\\\x7F]*)/);
    });

    after(async () => {
        await server.mongoose.connection.db.dropDatabase();
        await server.stop();
        await helpers.delay(100);
    });

    it('should register a user', async () => {
        const res = await server.inject({
            url: '/auth/register',
            method: 'post',
            payload: {
                name: 'John Doe',
                email: 'sample@test.com',
                password: 'asdasd',
                passwordMatch: 'asdasd',
                crumb: cookie[1],
            },
            headers: {
                cookie: 'crumb=' + cookie[1],
                // 'x-csrf-token': cookie[1]
            }
        });
        // it should return to /auth/login page
        expect(res.statusCode).to.equal(302);
        expect(res.headers['location']).to.equal('/auth/login');
    });

    it('should register a user from SPA request', async () => {
        const res = await server.inject({
            url: '/auth/register_api',
            method: 'post',
            payload: {
                name: 'John Doe',
                email: 'sample2@test.com',
                password: 'asdasd',
                passwordMatch: 'asdasd',
            },
            headers: {
                cookie: 'crumb=' + cookie[1],
                'x-csrf-token': cookie[1]
            }
        });
        expect(res.statusCode).to.equal(200);
        expect(res.result.status).to.equal(true);
    });

    it('should reject duplicate user', async () => {
        // Rest Api endpoint
        const res = await server.inject({
            url: '/auth/register_api',
            method: 'post',
            payload: {
                name: 'John Doe',
                email: 'sample2@test.com',
                password: 'asdasd',
                passwordMatch: 'asdasd',
            },
            headers: {
                cookie: 'crumb=' + cookie[1],
                'x-csrf-token': cookie[1]
            }
        });
        expect(res.statusCode).to.equal(400);
        expect(res.result.message).to.equal('The email address you used already registered. Please check your details!');

        // html form endpoint
        const res2 = await server.inject({
            url: '/auth/register',
            method: 'post',
            payload: {
                name: 'John Doe',
                email: 'sample2@test.com',
                password: 'asdasd',
                passwordMatch: 'asdasd',
                crumb: cookie[1],
            },
            headers: {
                cookie: 'crumb=' + cookie[1],
            }
        });
        expect(res2.statusCode).to.equal(400);
        expect(res2.result.message).to.equal('The email address you used already registered. Please check your details!');
    });

    it('should reject invalid payload', async () => {
        const res = await server.inject({
            url: '/auth/register_api',
            method: 'post',
            payload: {
                name: 'John Doe',
                email: 'sample2@test.com',
                password: 'asdas2d',
                passwordMatch: 'asdasd',
            },
            headers: {
                cookie: 'crumb=' + cookie[1],
                'x-csrf-token': cookie[1]
            }
        });

        expect(res.statusCode).to.equal(400);
        expect(res.result.details.passwordMatch).to.equal('Please enter your password again');
    });

    it('should redirect to auth page for without authentication', async () => {
        const res = await server.inject({
            url: '/secret',
            method: 'get',
        });

        expect(res.statusCode).to.equal(302);
        expect(res.headers['location']).to.equal('/auth/login');
    });

    it('should render auth page', async () => {
        const res = await server.inject({
            url: '/auth/login',
            method: 'get',
        });

        expect(res.statusCode).to.equal(200);
        expect(res.result.indexOf('Hapi Moon Auth')).to.above(-1);
        expect(res.result.indexOf('<input type="text" name="email">')).to.above(-1);
    });

    it('should render register page', async () => {
        const res = await server.inject({
            url: '/auth/register',
            method: 'get',
        });

        expect(res.statusCode).to.equal(200);
        expect(res.result.indexOf('Hapi Moon Register')).to.above(-1);
        expect(res.result.indexOf('<input type="text" name="email">')).to.above(-1);
    });

    it('should login to system', async () => {
        const res = await server.inject({
            url: '/auth/login',
            method: 'post',
            payload: {
                email: 'sample2@test.com',
                password: 'asdasd',
                'crumb': cookie[1]
            },
            headers: {
                cookie: 'crumb=' + cookie[1],
            }
        });

        expect(res.statusCode).to.equal(200);
        expect(res.result.status).to.equal(true);
        expect(res.result.result.email).to.equal('sample2@test.com');
    });

    it('should reject invalid login', async () => {
        const res = await server.inject({
            url: '/auth/login',
            method: 'post',
            payload: {
                email: 'sample2@test.com',
                password: 'asdasda',
                'crumb': cookie[1]
            },
            headers: {
                cookie: 'crumb=' + cookie[1],
            }
        });

        expect(res.statusCode).to.equal(403);
    });

    it('should allow authenticated user to see secret page', async () => {
        const res = await server.inject({
            url: '/auth/login',
            method: 'post',
            payload: {
                email: 'sample2@test.com',
                password: 'asdasd',
                'crumb': cookie[1]
            },
            headers: {
                cookie: 'crumb=' + cookie[1],
            }
        });

        expect(res.statusCode).to.equal(200);
        expect(res.result.status).to.equal(true);
        expect(res.result.result.email).to.equal('sample2@test.com');
        const header = res.headers['set-cookie'];

        const yarCookie = header[0].match(/hapi-moon-auth=([^\x00-\x20\"\,\;\\\x7F]*)/);

        const res2 = await server.inject({
            url: '/secret',
            method: 'get',
            headers: {
                cookie: `crumb=${cookie[1]};hapi-moon-auth=${yarCookie[1]}`,
            }
        });

        expect(res2.statusCode).to.equal(200);
        expect(res2.result.indexOf('This page is secret')).to.above(-1);
        expect(res2.result.indexOf('Go to homepage')).to.above(-1);
    });

    it('should prevent to access login or register form if user already signed-in', async () => {
        const res = await server.inject({
            url: '/auth/login',
            method: 'post',
            payload: {
                email: 'sample2@test.com',
                password: 'asdasd',
                'crumb': cookie[1]
            },
            headers: {
                cookie: 'crumb=' + cookie[1],
            }
        });

        expect(res.statusCode).to.equal(200);
        expect(res.result.status).to.equal(true);
        expect(res.result.result.email).to.equal('sample2@test.com');
        const header = res.headers['set-cookie'];

        const yarCookie = header[0].match(/hapi-moon-auth=([^\x00-\x20\"\,\;\\\x7F]*)/);

        const res2 = await server.inject({
            url: '/auth/login',
            method: 'get',
            headers: {
                cookie: `crumb=${cookie[1]};hapi-moon-auth=${yarCookie[1]}`,
            }
        });

        expect(res2.statusCode).to.equal(302);
        expect(res2.headers['location']).to.equal('/');

        const res3 = await server.inject({
            url: '/auth/register',
            method: 'get',
            headers: {
                cookie: `crumb=${cookie[1]};hapi-moon-auth=${yarCookie[1]}`,
            }
        });

        expect(res3.statusCode).to.equal(302);
        expect(res3.headers['location']).to.equal('/');
    });


    it('should logout and block access to secret page', async () => {
        const res = await server.inject({
            url: '/auth/login',
            method: 'post',
            payload: {
                email: 'sample2@test.com',
                password: 'asdasd',
                'crumb': cookie[1]
            },
            headers: {
                cookie: 'crumb=' + cookie[1],
            }
        });

        expect(res.statusCode).to.equal(200);
        expect(res.result.status).to.equal(true);
        expect(res.result.result.email).to.equal('sample2@test.com');
        const header = res.headers['set-cookie'];

        const yarCookie = header[0].match(/hapi-moon-auth=([^\x00-\x20\"\,\;\\\x7F]*)/);

        const res2 = await server.inject({
            url: '/secret',
            method: 'get',
            headers: {
                cookie: `crumb=${cookie[1]};hapi-moon-auth=${yarCookie[1]}`,
            }
        });

        expect(res2.statusCode).to.equal(200);
        expect(res2.result.indexOf('This page is secret')).to.above(-1);
        expect(res2.result.indexOf('Go to homepage')).to.above(-1);

        const res3 = await server.inject({
            url: '/auth/logout',
            method: 'get',
            headers: {
                cookie: `crumb=${cookie[1]};hapi-moon-auth=${yarCookie[1]}`,
            }
        });

        expect(res3.statusCode).to.equal(302);
        expect(res3.headers['location']).to.equal('/');
    });


    it('should return user information from user endpoint', async () => {
        const res = await server.inject({
            url: '/auth/login',
            method: 'post',
            payload: {
                email: 'sample2@test.com',
                password: 'asdasd',
                'crumb': cookie[1]
            },
            headers: {
                cookie: 'crumb=' + cookie[1],
            }
        });

        expect(res.statusCode).to.equal(200);
        expect(res.result.status).to.equal(true);
        expect(res.result.result.email).to.equal('sample2@test.com');
        const header = res.headers['set-cookie'];

        const yarCookie = header[0].match(/hapi-moon-auth=([^\x00-\x20\"\,\;\\\x7F]*)/);

        const res2 = await server.inject({
            url: '/user',
            method: 'get',
            headers: {
                cookie: `crumb=${cookie[1]};hapi-moon-auth=${yarCookie[1]}`,
                'x-csrf-token': cookie[1]
            }
        });

        expect(res2.statusCode).to.equal(200);
        expect(res2.result.email).to.equal('sample2@test.com');
    });


    it('should return as JSON to ajax requests', async () => {
        const res = await server.inject({
            url: '/user',
            method: 'get',
            headers: {
                cookie: `crumb=${cookie[1]}`,
                'x-csrf-token': cookie[1],
                'x-requested-with': 'XMLHttpRequest',
            }
        });

        expect(res.statusCode).to.equal(401);
        expect(res.result.message).to.equal('Please login to system');
    });

});
