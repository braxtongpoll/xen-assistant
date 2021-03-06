const { MessageEmbed, MessageAttachment } = require(`discord.js`);
const fs = require(`fs`);
exports.run = async(client, message, args) => {
    if (!message.channel.name.includes(`ticket`)) return message.reply(`You can only run this command in a ticket channel!`).then(a => a.delete({ timeout: 5000 })).catch(e => {});
    let thing;
    if (message.mentions.members.first()) {
        thing = message.mentions.members.first();
    } else if (message.mentions.roles.first()) {
        thing = message.mentions.roles.first();
    } else {
        thing = message.guild.roles.cache.find(r => r.id === args[0]) || message.guild.members.cache.find(m => m.id === args[0]);
    };
    if (!thing) return client.utils.missing(message, `MEMBER / ROLE`);
    message.delete();
    message.channel.updateOverwrite(thing.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true });
    message.channel.send(`${thing} was added to the ticket.`);
}, exports.info = {
    name: "add",
    aliases: [],
    permission: `@everyone`,
    description: `Add a member or role to a ticket.`,
    arguments: '<prefix>add [member/role]'
}