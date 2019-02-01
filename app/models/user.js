/**
 * Created by metoikos on 21.12.2017.
 * Project: hapi-boilerplate
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;
const schema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    active: {type: Boolean, default: false},
}, {collection: 'user'});

schema.index({"email": 1}, {unique: true}); // schema level
schema.index({"email": 1, active: 1}, {name: 'login_idx'}); // schema level

schema.methods.apiData = function () {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        active: this.active,
    }
};


/**
 * Login user with given information
 * @param email
 * @param password
 */
schema.statics.login = async function (email, password) {
    const user = await this.findOne({email: email, active: true}).exec();
    if (!user) return false;
    const doesMatch = await bcrypt.compare(password, user.password);
    return doesMatch ? user : false;
};


schema.pre('save', async function (next) {
    let user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    try {
        // generate a salt
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        // hash the password along with our new salt
        // override the cleartext password with the hashed one
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (e) {
        return next(e);
    }
});


mongoose.model('User', schema);
