/**
 * Created by metoikos on 2019-02-01.
 * Project: hapi-moon
 */


const Hoek = require('hoek');
const Joi = require('joi');
const util = require('./util');
const config = require('config');
const Mongoose = require('mongoose');
const readline = require('readline');

const register = Joi.object().keys({
    name: Joi.string().max(100).min(2).required().trim().label('Name').error(err => ({message: "Please enter your name!"})),
    email: Joi.string().email().max(100).required().trim().label('E-mail').error(err => ({message: "Please enter your e-mail address!"})),
    password: Joi.string().min(2).required().trim().label('Password').error(new Error('Please enter your password!'))
});

Mongoose.connect(config.get('mongo'), {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
}, function (err) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
});

require('../app/models/user');
const User = Mongoose.model('User');

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('SIGINT', () => {
    rl.question(util.ColorOutput('FgCyan', "Are you sure you want to exit? [y, yes]\n"), (answer) => {
        console.log("rl");
        if (answer.match(/^y(es)?$/i)) {
            rl.close();
        }
    });
});


const question = (q) => {
    return new Promise(resolve => {
        rl.question(util.ColorOutput('FgMagenta', q + ": "), (answer) => {
            resolve(answer);
        });
    })
};


const handleJobs = async () => {
    console.log(util.ColorOutput('FgYellow', 'Welcome to hapi-moon dump commandline utility'));
    let name = await question("Please enter user's full name (min 2 char)");
    let email = await question("Please enter user e-mail");
    let password = await question("Password (min 2 char)");

    const result = Joi.validate({
        name, email, password
    }, register, {abortEarly: false});

    Hoek.assert(result.error === null, result.error);

    const user = new User({
        name, email, password, active: true
    });
    await user.save();
};

handleJobs().then(() => {
    console.log(util.ColorOutput('FgGreen', 'User created successfully!'));
    setTimeout(() => {
        process.exit(0);
    }, 500);
}).catch((err) => {
    console.log(util.ErrorOutput('An error occurred while creating the user'));
    console.log(util.LogOutput(err));
    process.exit(0);
});
