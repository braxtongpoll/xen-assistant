const { MessageEmbed } = require("discord.js");

exports.run = async(client, message, args) => {
    if (!args[0]) return client.missing(messge, exports.info.arguments);
    client.db.findById(client.user.id, async function(err, res) {
        switch (args[0].toLowerCase()) {
            case "add":
                let NEWID = Object.keys(res.partners).length;
                let name = await client.waitRes(message, "What is the name of this partner?");
                let discordID = await client.waitRes(message, "What is the discord ID for the owner of this partner?");
                let description = await client.waitRes(message, "What is the description for this partner?");
                res.partners[NEWID] = {
                    addedBy: message.author.tag,
                    addedOn: new Date(),
                    owner: discordID,
                    description: description,
                    name: name
                };
                let toPostChannel = await message.guild.channels.cache.find(c => c.id === res.partnerChannel);
                toPostChannel.bulkDelete(100);
                let embed = new MessageEmbed()
                    .setColor(client.config.color)
                await Object.keys(res.partners).forEach(async function(id) {
                    let member = message.guild.members.cache.find(m => m.id === res.partners[id].user);
                    if (!member) return;
                    embed.setTitle(res.partners[id].name).setDescription(`**Owner**: ${member}\n\n${res.partners[id].description}`).setFooter(`${id} | Xen Development Partner`)
                    toPostChannel.send(embed);
                });
                client.db.findByIdAndUpdate(client.user.id, {
                    partners: res.partners
                }).then(() => {}).catch(() => {});
                break;
            case "remove":

                break;
            default:
                if (!args[0]) return client.missing(messge, exports.info.arguments);
        }
    });
}, exports.info = {
    name: "partner",
    aliases: [],
    permission: `MANAGE_GUILD`,
    description: `Add / Remove a partner.`,
    arguments: 'ADD / REMOVE'
}