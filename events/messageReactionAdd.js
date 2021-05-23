const { MessageEmbed } = require("discord.js");

module.exports = async(client, reaction, user) => {
    if (reaction.partial) try { await reaction.fetch().catch(e => { console.log(e) }) } catch (e) { return client.logger.log(`Failed to fetch partial reactions | [${e}]`, "error") };
    if (user.bot) return;
    if (!reaction.message.guild) return;
    client.db.findById(client.user.id, async function(err, res) {
        if (res.ticketPanels[reaction.message.id]) {
            if (reaction.emoji.name !== "🎟️") return reaction.users.removeAll();
            reaction.users.remove(user.id);
            let category = reaction.message.guild.channels.cache.get(res.ticketPanels[reaction.message.id].category);
            if (!category) return;
            reaction.message.guild.channels.create(`ticket-${res.ticketPanels[reaction.message.id].number}`, {
                type: "text",
                parent: category.id,
                permissionOverwrites: [{
                    id: reaction.message.guild.id,
                    deny: ["VIEW_CHANNEL"]
                }, {
                    id: user.id,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                }]
            }).then(async(channel) => {
                res.ticketPanels[reaction.message.id].number = res.ticketPanels[reaction.message.id].number + 1;
                client.docUpdate(reaction.message, "ticketPanels", res.ticketPanels);
                try {
                    for (let id of res.ticketPanels[reaction.message.id].roles) {
                        channel.updateOverwrite(id, { VIEW_CHANNEL: true, SEND_MESSAGES: true }).catch(e => {});
                    }
                } catch {};
                let embed = new MessageEmbed()
                    .setFooter(reaction.message.guild.name, reaction.message.guild.iconURL())
                    .setColor(client.config.color)
                    .setAuthor("New Ticket")
                    .setDescription("Welcome to your ticket! Please let us know how we may assist you.")
                channel.send(`${user}`, { embed: embed });
            });
        }
    });
}