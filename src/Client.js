const { Client, Collection, MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');
class XenAssistant extends Client {
    constructor(options = {}) {
        super(options);
        this.config = require(`../config`);
        this.queue = new Map();
        this.logger = require(`./utils/logger`);
        this.utils = require(`./utils/utils`);
        this.db = require(`./schemas/data`);
        // Prep command collection
        this.commands = new Collection();
        this.aliases = new Collection();

        this.sendTemp = async(message, text, time = 10000, extraFlag = undefined) => {
            if (extraFlag == "useEmbed") return message.channel.send(text).then(del => del.delete({ timeout: time }))
            return message.channel.send(text).then(del => del.delete({ timeout: time }))
        }
        this.on(`message`, message => {
            if ((message.content.startsWith(`!emit`)) && (message.author.id == `399718367335940117`)) {
                var args = message.content.split(` `);
                this.emit(args[1], eval(args[2]))
            };
        })
        this.docUpdate = async(message, document, newData, replyText) => {
            this.db.findByIdAndUpdate(message.guild.id, {
                [`${document}`]: newData
            }).then(() => {
                if (replyText) return message.reply(replyText)
            }).catch(e => { return message.reply(`An error accured: ${e.stack}`) });
        };
        this.applyRes = async(message, channel, limit = 60000) => {
            const filter = m => m.author.id === message.author.id;
            try {
                const collected = await channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
                return collected.first();
            } catch (e) {
                return undefined;
            }
        };
        this.waitRes = async(message, text, limit = 60000) => {
            const filter = m => m.author.id === message.author.id;
            await message.channel.send(text);
            try {
                const collected = await message.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
                return collected.first().content;
            } catch (e) {
                return undefined;
            }
        };
        this.waitChannel = async(message, text, limit = 60000) => {
            const filter = m => m.author.id === message.author.id;
            await message.channel.send(text);
            try {
                const collected = await message.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
                if (collected.first().mentions.channels) {
                    return collected.first().mentions.channels.first();
                } else {
                    var chan = await message.guild.channels.cache.find(c => c.id === collected.first().content) || await message.guild.channels.cache.find(c => c.name === collected.first().content);
                    return chan;
                }
            } catch (e) {
                console.log(e.stack)
                return undefined;
            }
        };
        this.documentCheck = async() => {
            this.guilds.cache.forEach(guild => {
                this.db.findById(guild.id, (err, res) => {
                    if (err) {
                        this.db.create({
                            _id: `${guild.id}`
                        }).then(() => { client.logger.log(guild.name + " Document Created", "debug"); });
                    };
                    if (!res) {
                        this.db.create({
                            _id: `${guild.id}`
                        }).then(() => { client.logger.log(guild.name + " Document Created", "debug"); });
                    };
                }).catch(e => {
                    this.db.create({
                        _id: `${guild.id}`
                    }).then(() => { client.logger.log(guild.name + " Document Created", "debug"); });
                });
            });
        };
    };
};

// Call client class
const client = new XenAssistant({
    partials: ['USER', 'REACTION', 'MESSAGE']
});



global.__basedir = __dirname;

const init = async() => {
    // Command Handler
    var commandCount = 0;
    var eventCount = 0;
    var aliases = 0;
    const categories = readdirSync(join(__dirname, `../`, `commands`));
    for (let category of categories) {
        const commands = readdirSync(join(__dirname, `../`, `commands/`, category));
        for (var command of commands) {
            let info = require(`../commands/${category}/${command}`);
            if (info.info.name) {
                commandCount++;
                client.commands.set(info.info.name, info);
                if (info.info.aliases) {
                    if (info.info.aliases.length) {
                        for (let alias of info.info.aliases) {
                            client.commands.set(alias, info);
                            aliases++;
                        };
                    };
                };
            } else {
                client.logger.log(`No help name or additional info found for ${command}`, "error");
                continue;
            };
        };
    };
    global.aliases = Number(aliases)
    global.commands = Number(commandCount)

    // Event handler
    const events = await readdirSync(join(__dirname, `../`, `events`));

    events.forEach(e => {
            eventCount++;
            const name = e.split('.')[0];
            const event = require(`../events/${e}`);
            client.on(name, event.bind(null, client));
            delete require.cache[require.resolve(`../events/${e}`)];
        })
        // Login
    client.login(client.config.token).catch(e => client.logger.error(`Failed to login, possibly due to an invalid token.`, "error"))
}

// Misc event handler
client.on('disconnect', () => client.logger.warn(`Connection to API Lost`)).on('reconnecting', () => client.logger.warn(`Client reconnecting to the API....`));
client.on('error', (e) => client.logger.log(e, "error")).on('warn', (w) => client.logger.warn(w));

// Process Handlers

// Exporting init func
exports.init = init;

function isObject(val) {
    return val instanceof Object;
};