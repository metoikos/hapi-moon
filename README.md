# Simple yet powerful hassle-free hapi.js Server boilerplate

Hapi-Moon provides a ready to go server boilerplate for hapi applications. All you need to do is install dependencies and run `npm start` command. 

With Hapi-Moon you'll have:
* Multi environment configs (dev/prod/test with [config](https://github.com/lorenwest/node-config))
* MongoDB (Mongoose) Models 
* Authentication
* Rest API Support 
* View Render Support ([nunjucks](https://mozilla.github.io/nunjucks))
* Cache (Redis with [catbox-redis](https://github.com/hapijs/catbox-redis))
* Cookie Management with [yar](https://github.com/hapijs/yar) (stores sessions in Redis backend)

## Usage
```no-highlight
git clone https://github.com/metoikos/hapi-moon.git
cd hapi-moon
npm install
npm start
```

## Create User

Run ```npm run add-user``` then follow instructions

[![asciicast](https://asciinema.org/a/afeei7aIEhLKMd6RtbKqUJR8O.svg)](https://asciinema.org/a/afeei7aIEhLKMd6RtbKqUJR8O)


## Acknowledgements
This module borrows from jolly, thank you to @ravisuhag for his excellent work.
