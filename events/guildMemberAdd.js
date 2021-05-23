const { MessageEmbed } = require('discord.js');
const path = require('path');
const Canvas = require('canvas');
const { writeFileSync } = require('fs');


module.exports = async(client, member) => {
    client.db.findById(client.user.id, async function(err, res) {
        let welcome_channel = member.guild.channels.cache.get(res.welcome_channel);
        let memberLogs = member.guild.channels.cache.get(res.memberLogs);
        //Main Welcome

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