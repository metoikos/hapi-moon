/**
 * Created by metoikos on 21.12.2017.
 * Project: hapi-boilerplate
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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


schema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});


mongoose.model('User', schema);