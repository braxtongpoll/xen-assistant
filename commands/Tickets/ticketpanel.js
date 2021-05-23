const { MessageEmbed } = require("discord.js");

exports.run = async(client, message, args) => {
    let name = await client.waitRes(message, "What is the name of this panel?");
    let description = await client.waitRes(message, "What is the embed description for this panel?");
    const filter = response => { return response.author.id === message.author.id };
    message.channel.send("What is the ID for the category for me to open these tickets?");
    let ret = await message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: [`time`] });
    if (!ret) return message.channel.send("<:Deny:845537998204043274> Time error.");
    let category;
    if (ret.first().mentions.channels.first()) {
        category = ret.first().mentions.channels.first();
    } else {
        category = message.guild.channels.cache.get(ret.first().content);
    };
    if (!category || category.type !== "category") return message.channel.send("<:Deny:845537998204043274> Invalid Category.");
    message.channel.send("Please provide the role(s) to support this ticket panel. *If multiple roles, seperate each with a space*");
    let roleData = await message.channel.awaitMessages(filter, { max: 1, time: 120000, errors: [`time`] });
    let roles = [];
    if (roleData.first().mentions.roles.first()) {
        roleData.first().mentions.roles.forEach(role => {
            roles.push(role.id);
        });
    };
    let arr = roleData.first().content.split(" ");
    for (let id of arr) {
        if (isNaN(id)) continue;
        let role = message.guild.roles.cache.get(id);
        if (role) roles.push(id);
    };
    message.channel.bulkDelete(8);
    client.db.findById(client.user.id, async function(err, res) {
        let embed = new MessageEmbed().setColor(client.config.color).setAuthor(name).setDescription(description)
        message.channel.send(embed).then(msgEmbed => {
            msgEmbed.react("🎟️");
            res.ticketPanels[msgEmbed.id] = {
                name: name,
                category: category.id,
                roles: roles,
                number: 1
            };
            client.docUpdate(message, "ticketPanels", res.ticketPanels);
        });
    });

}, exports.info = {
    name: "ticketpanel",
    aliases: [],
    permission: `MANAGE_GUILD`,
    description: `Create a new ticket panel.`,
    arguments: 'N/A'
};