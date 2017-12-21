/**
 * Created by metoikos on 21.12.2017.
 * Project: hapi-boilerplate
 */
const mongoose = require('mongoose');
const schema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
}, {collection: 'user'});

mongoose.model('User', schema);