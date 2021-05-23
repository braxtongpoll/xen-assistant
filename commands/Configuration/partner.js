const { MessageEmbed } = require("discord.js");

exports.run = async(client, message, args) => {
    if (!args[0]) return client.missing(message, exports.info.arguments);
    client.db.findById(client.user.id, async function(err, res) {
        let toPostChannel = await message.guild.channels.cache.find(c => c.id === res.partnerChannel);
        switch (args[0].toLowerCase()) {
            case "add":
                let NEWID = Object.keys(res.partners).length;
                let name = await client.waitRes(message, "What is the name of this partner?");
                let discordID = await client.waitRes(message, "What is the discord ID for the owner of this partner?");
                let description = await client.waitRes(message, "What is the description for this partner?");
                let logo = await client.waitRes(message, "What is the logo for this partner?");
                let image = await client.waitRes(message, "What is the image for this partner? *If none type none");
                res.partners[NEWID] = {
                    addedBy: message.author.tag,
                    addedOn: new Date(),
                    owner: discordID,
                    description: description,
                    name: name,
                    logo: logo
                };
                if (image.toLowerCase() !== "none") res.partners[NEWID].image = image;
                updatePartners(client, toPostChannel, res.partners);
                client.db.findByIdAndUpdate(client.user.id, {
                    partners: res.partners
                }).then(() => {
                    message.channel.bulkDelete(10);
                    message.channel.send("<:check:845537998207451136> Partner added.");
                }).catch(() => {});
                break;
            case "remove":
                if (!res.partners[args[1]]) return message.channel.send("<:Deny:845537998204043274> Invalid partner ID.");
                res.partners[args[1]] = undefined;
                updatePartners(client, toPostChannel, res.partners);
                client.db.findByIdAndUpdate(client.user.id, {
                    partners: res.partners
                }).then(() => {
                    message.channel.bulkDelete(10);
                    message.channel.send("<:check:845537998207451136> Partner removed.");
                }).catch(() => {});
                break;
            case "update":
                updatePartners(client, toPostChannel, res.partners);
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
    arguments: 'ADD / REMOVE / UPDATE'
}

async function updatePartners(client, channel, partners) {
    channel.bulkDelete(100);
    let embed = new MessageEmbed()
        .setColor(client.config.color)
    await Object.keys(partners).forEach(async function(id) {
        if (partners[id] == null) return;
        let member = channel.guild.members.cache.find(m => m.id === partners[id].owner);
        if (!member) return;
        embed
            .setTitle(partners[id].name)
            .setDescription(`**Owner**: ${member}\n\n${partners[id].description}`)
            .setFooter(`${id} | Xen Development Partner`)
            .setThumbnail(partners[id].logo)
        try { embed.setImage(partners[id].image) } catch {};
        channel.send(embed);
    });
}