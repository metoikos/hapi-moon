# Simple yet powerful hassle-free and production ready hapi.js Server boilerplate

[![Build Status](https://travis-ci.org/metoikos/hapi-moon.svg?branch=master)](https://travis-ci.org/metoikos/hapi-moon)

Hapi-Moon provides a ready to go server boilerplate for hapi applications. 
All you need to do is install dependencies and run `npm start` command. 

With Hapi-Moon you'll have:
* Production ready docker setup
* Multi environment configs (dev/prod/test with [config](https://github.com/lorenwest/node-config))
* MongoDB (Mongoose) Models 
* Authentication
* Rest API Support 
* CSRF validation [crumb](https://github.com/hapijs/crumb)
* Cookie Management with [yar](https://github.com/hapijs/yar) (stores sessions in Redis backend)
* View Render Support ([nunjucks](https://mozilla.github.io/nunjucks))
* Cache (Redis with [catbox-redis](https://github.com/hapijs/catbox-redis))

## Usage

#### With Docker

```shell
git clone https://github.com/metoikos/hapi-moon.git
cd hapi-moon
docker-compose up
```
It will expose port 3009 for your hapi-moon application. You can
change the port and other details from [config/default.json](./config/default.json) file.


#### Standart NPM

```shell
git clone https://github.com/metoikos/hapi-moon.git
cd hapi-moon
npm install
npm test
npm start
```

Please visit [routes](./app/routes) and [controllers](./app/controllers) folders to see how to define a route and controller.

## Rest Api Usage

In order to use this boilerplate as REST API, you need to send "X-CSRF-Token" information in the header. 
Otherwise, your request won't be allowed by the server.

Also you need to remove `plugins.crumb` block from your handler.

```js
    plugins: {
        crumb: {
            restful: false
        }
    }
```

Let's say you want to implement authentication to your SPA 
then your auth/login handler would be like this.

```js
exports.login = {
    auth: false,
    validate: {
        payload: validators.login
    },    
    description: 'sign in user to system',
    handler: async (request, h) => {
        const result = await User.login(request.payload.email, request.payload.password);
        if (result) {
            request.yar.set('auth', result.apiData());
            return {status: true, result: result.apiData()};
        }

        return {error: 'Invalid email or password'}
    }
};
```

To read more about this please refer to [crumb](https://github.com/hapijs/crumb) documentation.

## Production deployment

To use this application under production, first, create a file named production.json under the config folder. Then update the necessary variables in it. 

For details about multi-environment config, please refer to [config](https://github.com/lorenwest/node-config).

To start your production application, you can use any of the below definitions.

### Standart Way
Install modules and then start the application

```shell
NODE_ENV=production NODE_CONFIG_DIR=./config npm start
```

### Docker Way
Just edit your production.json file and make sure that you have the correct settings in your [docker-compose.yml](./docker-compose.yml) file, and then start your application.

```shell
docker-compose up -d
```

### PM2

[PM2](https://pm2.keymetrics.io/) is a process manager for node and many other languages.

Install PM2 

```shell
npm install pm2@latest -g
pm2 startOrRestart pm2-startup.json
```

Please visit [PM2 documentation](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/) for other details.
### PM2 & Docker

You can use PM2 with Docker as well. You will find the instructions inside the Dockerfile.
Just make sure that you set the correct environment and config files. 

### Create User

Run ```npm run add-user``` then follow instructions

[![asciicast](https://asciinema.org/a/afeei7aIEhLKMd6RtbKqUJR8O.svg)](https://asciinema.org/a/afeei7aIEhLKMd6RtbKqUJR8O)
