const { prompt } = require(`../src/utils/start.js`);
const mongoose = require("mongoose");
var num = 0;
module.exports = async(client) => {
    initDB(client);
    prompt(client);
    client.documentCheck();
    statusUpdate(client);
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

function statusUpdate(client) {
    if (num == 0) {
        client.user.setPresence({
            activity: {
                name: `${client.users.cache.size} Members`,
                type: "Watching"
            },
            status: "online"
        });
        num = 1;
    } else {
        client.db.findById(client.user.id, async function(err, res) {
            client.user.setPresence({
                activity: {
                    name: `${res.clients.length} Clients`,
                    type: "Watching"
                },
                status: "online"
            });
            num = 0;
        });
    }
    setTimeout(() => {
        statusUpdate(client)
    }, 15000);
}