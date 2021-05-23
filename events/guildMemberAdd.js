const Canvas = require("discord-canvas");
const Discord = require("discord.js")

module.exports = async(client, member) => {
    client.db.findById(client.user.id, async function(err, res) {
        let welcome_channel = member.guild.channels.cache.get(res.welcome_channel);
        let memberLogs = member.guild.channels.cache.get(res.memberLogs);

        // Adding auto roles

        for (let id of res.autoRoles) {
            member.roles.add(id).catch(e => {});
        }

        //Main Welcome
        const image = await new Canvas.Welcome()
            .setUsername(member.user.username)
            .setDiscriminator(member.user.discriminator)
            .setMemberCount(member.guild.memberCount)
            .setGuildName(member.guild.name)
            .setAvatar(member.user.displayAvatarURL({ format: "jpg" }))
            .setColor("border", "#FFFFFF")
            .setColor("username-box", "#FFFFFF")
            .setColor("discriminator-box", "#FFFFFF")
            .setColor("message-box", "#FFFFFF")
            .setColor("title", "#00ccff")
            .setColor("avatar", "#FFFFFF")
            .toAttachment()
        const attachment = new Discord.MessageAttachment(image.toBuffer(), "welcome-image.png");
        if (welcome_channel) welcome_channel.send(attachment);
        //Moderation Log Welcome

        var date = await member.user.createdAt;
        var joinTime = member.user.createdTimestamp
        var today = new Date().getTime();
        var days = ((today - joinTime) / 86400000).toString().split(`.`)[0]
        var monthArray = [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`];
        var cDate = `${date.getDate()} ${monthArray[date.getMonth()]} ${date.getFullYear()}`
        if (memberLogs) memberLogs.send(`📥 ${member} (**${member.user.tag}**) has joined.\n  Created: ` + "`" + cDate + "` `" + days + " days ago" + "`");
    });

}