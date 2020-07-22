const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/opentok', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;

db.once('open', (e) => console.log('connected to db'));