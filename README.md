# Simple yet powerful hassle-free hapi.js Server boilerplate

[![Build Status](https://travis-ci.org/metoikos/hapi-moon.svg?branch=master)](https://travis-ci.org/metoikos/hapi-moon)

Hapi-Moon provides a ready to go server boilerplate for hapi applications. All you need to do is install dependencies and run `npm start` command. 

With Hapi-Moon you'll have:
* Multi environment configs (dev/prod/test with [config](https://github.com/lorenwest/node-config))
* MongoDB (Mongoose) Models 
* Authentication
* Rest API Support 
* CSRF validation [crumb](https://github.com/hapijs/crumb)
* Cookie Management with [yar](https://github.com/hapijs/yar) (stores sessions in Redis backend)
* View Render Support ([nunjucks](https://mozilla.github.io/nunjucks))
* Cache (Redis with [catbox-redis](https://github.com/hapijs/catbox-redis))

## Usage
```no-highlight
git clone https://github.com/metoikos/hapi-moon.git
cd hapi-moon
npm install
npm test
npm start
```

## Rest Api Usage

In order to use this boilerplate as rest api, you need to send "X-CSRF-Token" information in the header. 
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
then your auth/login handler should be like this.

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


## Create User

Run ```npm run add-user``` then follow instructions

[![asciicast](https://asciinema.org/a/afeei7aIEhLKMd6RtbKqUJR8O.svg)](https://asciinema.org/a/afeei7aIEhLKMd6RtbKqUJR8O)


## Acknowledgements
This module borrows from jolly, thank you to @ravisuhag for his excellent work.
