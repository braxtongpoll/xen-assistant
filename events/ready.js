const { prompt } = require(`../src/utils/start.js`);
const mongoose = require("mongoose");
module.exports = async(client) => {
    initDB(client);
    prompt(client);
    client.documentCheck();
};

function initDB(client) {
    mongoose.connect(client.config.database, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    }, err => {
        if (err) return client.logger.log("Database error.\n" + err.stack, "error");
        if (!err) return console.log("Mongo Parsed", "success")
    });
}
err => {
    if (err) console.log(`Failed to init mongoDB ${err.stack}`)
}