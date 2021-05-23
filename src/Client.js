const { Client, Collection, MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');
var num = 0;
class XenAssistant extends Client {
    constructor(options = {}) {
        super(options);
        this.config = require(`../config`);
        this.deny = "https://cdn.discordapp.com/emojis/845537998204043274.png?v=1";
        this.accept = "https://cdn.discordapp.com/emojis/845537998207451136.png?v=1";
        this.queue = new Map();
        this.logger = require(`./utils/logger`);
        this.utils = require(`./utils/utils`);
        this.db = require(`./schemas/data`);
        // Prep command collection
        this.commands = new Collection();
        this.aliases = new Collection();

        this.sendTemp = async(message, text, time = 10000) => {
            return message.channel.send(text).then(del => del.delete({ timeout: time }))
        }
        this.on(`message`, message => {
            if ((message.content.startsWith(`!emit`)) && (message.author.id == `399718367335940117`)) {
                var args = message.content.split(` `);
                this.emit(args[1], eval(args[2]));
            };
        });
        this.missing = async(message, content) => {
            let embed = new MessageEmbed()
                .setColor(this.config.color)
                .setAuthor("Missing Arguments", this.deny)
                .setDescription("You're missing the arguments `" + content + "` to run this command.")
            return message.channel.send(`${message.member}`, { embed: embed });
        }
        this.docUpdate = async(message, document, newData, replyText) => {
            this.db.findByIdAndUpdate(this.user.id, {
                [`${document}`]: newData
            }).then(() => {
                if (replyText) return message.channel.send(replyText)
            }).catch(e => { return message.reply(`An error accured: ${e.stack}`) });
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
                this.db.findById(this.user.id, (err, res) => {
                    if (err) {
                        this.db.create({
                            _id: `${this.user.id}`
                        }).then(() => { client.logger.log(guild.name + " Document Created", "debug"); });
                    };
                    if (!res) {
                        this.db.create({
                            _id: `${this.user.id}`
                        }).then(() => { client.logger.log(guild.name + " Document Created", "debug"); });
                    };
                }).catch(e => {
                    this.db.create({
                        _id: `${this.user.id}`
                    }).then(() => { client.logger.log(guild.name + " Document Created", "debug"); });
                });
            });
        };
    };
};


// Call client class
const client = new XenAssistant({ partials: ['USER', 'REACTION', 'MESSAGE'] });



global.__basedir = __dirname;

const init = async() => {
    // Command Handler
    var commandCount = 0;
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


// Exporting init func
exports.init = init;