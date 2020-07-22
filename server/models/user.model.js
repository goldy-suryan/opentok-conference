const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UserSchema = new schema({
    username: { type: String, required: true },
    email: { type: String, index: true, required: true },
    password: { type: String, required: true }
})

module.exports = mongoose.model('User', UserSchema);