/**
 * Created by metoikos on 21.12.2017.
 * Project: hapi-boilerplate
 */
const mongoose = require('mongoose');
const User = mongoose.model('User');
exports.view = {
    description: 'main request handler',
    handler: async (request, h) => {
        const user = await User.findOne({}).exec();

        return user;
    }
};