/**
 * Created by metoikos on 21.12.2017.
 * Project: hapi-boilerplate
 */
const config = require('config');
const Config = JSON.parse(JSON.stringify(config));
const plugins = [
    {
        plugin: require('yar'),
        options: Config.cookie
    },
    {
        plugin: require('crumb'),
        options: Config.crumb
    },
    {
        plugin: './lib/mongoose',
        options: {
            uri: Config.mongo
        }
    },
    {
        plugin: './app/routes/main'
    }
];
exports.manifest = {
    server: {
        router: {
            stripTrailingSlash: true,
            isCaseSensitive: false
        },
        routes: {
            security: {
                hsts: false,
                xss: true,
                noOpen: true,
                noSniff: true,
                xframe: false
            },
            cors: true,
            jsonp: 'callback', // <3 Hapi,
            auth: false
        },
        debug: Config.debug,
        port: Config.port,
        cache: [
            {...Config.redisCache, engine: require('catbox-redis'),}
        ]
    },
    register: {
        plugins
    }
};