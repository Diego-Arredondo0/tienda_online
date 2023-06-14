const mongoose = require('mongoose');

const {NOTES_APP_MONGODB_HOST, NOTES_APP_MONGODB_DATABASE} = process.env;

const MONGODB_URI = "mongodb+srv://ldsantoyoarredondo:xj2wZKSj9vchGmch@cluster0.5nvugyw.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI)
    .then(db => console.log('Db is connected to', db.connection.host))
    .catch(err => console.log(err));
