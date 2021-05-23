const { MessageEmbed } = require("discord.js");

module.exports = async(client, message) => {
    if (message.author == null) return;
    if (message.author.bot) return;
    client.db.findById(client.user.id, async function(err, res) {
        let logs = message.guild.channels.cache.get(res.discordLogs);
        if (!logs) return;
        let embed = new MessageEmbed()
            .setFooter(message.guild.name, message.guild.iconURL())
            .setColor(client.config.color)
            .setAuthor("Message Delete", message.author.displayAvatarURL())
            .addFields({
                name: "User",
                value: `${message.member}`,
                inline: true
            }, {
                name: "Channel",
                value: `${message.channel}`,
                inline: true
            })
            .setDescription(message.content)
        logs.send(embed)
    });
};