const mongoose = require('mongoose');
const schema = mongoose.Schema;

const RoomSchema = new schema({
    email: { type: String, index: true, required: true },
    sessionId: { type: String, required: true },
    apiKey: { type: String, required: true },
    token: { type: String, required: true }
})

module.exports = mongoose.model('room', RoomSchema);