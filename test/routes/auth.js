/**
 * Created by metoikos on 27.02.2018.
 * Project: Smart Platform Server
 */
const Lab = require('@hapi/lab');
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const after = lab.after;
const expect = require('@hapi/code').expect;
const Glue = require('@hapi/glue');
const serverConfig = require('../../config/manifest');
const helpers = require("../../lib/utils");
const dirname = __dirname + '/../../../';
const options = {...serverConfig.options, relativeTo: dirname};
describe('Validate auth routes', () => {

    let server;
    before(async () => {
        server = await Glue.compose(serverConfig.manifest, options);
    });

    after(async () => {
        await server.mongoose.connection.db.dropDatabase();
        await server.stop();
        await helpers.delay(100);
    });

    it('should create a user', async () => {
        const res = await server.inject({
            url: '/auth/admin', method: 'post'
        });
        expect(res.statusCode).to.equal(400);
    });

    it('It should reject invalid payload', async () => {
        const res = await server.inject({
            url: '/auth/admin', method: 'post', payload: {
                username: 'yilmaz@tooplay.com',
                passwordx: 'asdasd'
            }
        });
        expect(res.statusCode).to.equal(400);
    });

    it('It should reject invalid auth type', async () => {
        const res = await server.inject({
            url: '/auth/tesx', method: 'post', payload: {
                username: 'yilmaz@tooplay.com',
                password: 'asdasd'
            }
        });
        expect(res.statusCode).to.equal(400);
    });

    it('It should reject invalid credentials', async () => {
        const res = await server.inject({
            url: '/auth/admin', method: 'post', payload: {
                username: 'yilmaz@tooplay.com',
                password: '123123'
            }
        });
        expect(res.statusCode).to.equal(401);
        expect(res.result.message).to.equal("Hatalı e-posta ya da şifre!");
    });

    it('It should obtain jwt token', async () => {
        const res = await server.inject({
            url: '/auth/admin', method: 'post', payload: {
                username: 'yilmaz@tooplay.com',
                password: 'asdasd'
            }
        });
        expect(res.statusCode).to.equal(200);
        expect(res.result.token).to.exist();
        expect(res.result.status).to.equal(true);
    });
});
