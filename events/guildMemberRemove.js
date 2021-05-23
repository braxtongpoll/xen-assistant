module.exports = async(client, member) => {
    client.db.findById(client.user.id, async function(err, res) {
        let memberLogs = member.guild.channels.cache.get(res.memberLogs);
        let roles = "|";
        await member.roles.cache.forEach(role => {
            if (role.id == member.guild.id || role.name == "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬") return;
            roles += ` ${role.name} |`
        })
        if (memberLogs) memberLogs.send(`📤 ${member} (**${member.user.tag}**) has left.\n  Roles: ` + "`" + roles + "`");
    });
};