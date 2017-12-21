/**
 * Created by metoikos on 21.12.2017.
 * Project: hapi-boilerplate
 */
const Glue = require('glue');
const manifest = require('./config/manifest').manifest;

const options = {
    relativeTo: __dirname
};

const startServer = async function () {
    try {
        const server = await Glue.compose(manifest, options);
        await server.start();
        console.log('server started');
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
};

startServer();