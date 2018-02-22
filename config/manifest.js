/**
 * Created by metoikos on 21.12.2017.
 * Project: hapi-boilerplate
 */
const config = require('config');
const Config = JSON.parse(JSON.stringify(config));
const Nunjucks = require('nunjucks');
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
    // {
    //     plugin: './lib/auth' // if you need authentication then uncomment this plugin, and remove "auth: false" below
    // },
    {
        plugin: './app/routes/main'
    },
    {
        plugin: './app/routes/user',
        routes: {
            prefix: '/user'
        }
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
            auth: false // remove this to enable authentication or set your authentication profile ie. auth: 'jwt'
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

exports.options = {
    // somehow vision only works if you register your vision plugin at this point
    // otherwise it gives you an error => Cannot render view without a views manager configured
    // Not a perfect solution but it works OK
    preRegister: async (server) => {
        await server.register(require('vision'));
        server.views({
            engines: {
                html: {
                    compile: (src, options) => {
                        const template = Nunjucks.compile(src, options.environment);
                        return (context) => {
                            return template.render(context);
                        };
                    },
                    prepare: (options, next) => {
                        options.compileOptions.environment = Nunjucks.configure(options.path, {watch: false});
                        return next();
                    }
                }
            },
            path: './templates' // look at server.js, for more information: [relativeTo: __dirname]
        });
    }

};
