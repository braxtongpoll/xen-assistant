const { MessageEmbed } = require("discord.js");

exports.run = async(client, message, args) => {
    message.delete().catch(() => {});
    client.db.findById(client.user.id, async function(err, res) {
        let inguild = "";
        let outofguild = "";
        for (let id of res.clients) {
            let member = await message.guild.members.cache.find(m => m.id === id);
            if (member) {
                inguild += `<:check:845537998207451136> ${member}\n`;
            } else {
                let user = await client.users.fetch(id);
                outofguild += `<:Deny:845537998204043274> ${user.username}\n`;
            }
        }
        let embed = new MessageEmbed()
            .setFooter(`${res.clients.length} Clients | ` + message.guild.name, message.guild.iconURL())
            .setColor(client.config.color)
            .setTitle("Xen Development Clients")
            .addFields({
                name: "In Guild",
                value: inguild,
                inline: true
            }, {
                name: "Out of Guild",
                value: outofguild,
                inline: true
            })
        message.channel.send(embed);
    });
}, exports.info = {
    name: "clients",
    aliases: [],
    permission: `@everyone`,
    description: `View all the clients of Xen Development.`,
    arguments: 'N/A'
}