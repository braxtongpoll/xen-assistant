const { MessageEmbed } = require("discord.js");

module.exports = async(client, message) => {
    if (message.author.bot || !message.guild || !message.member) return;
    client.db.findById(client.user.id, (err, res) => {
        if (message.content.startsWith(res.prefix)) return commandController(client, message, res.prefix);

    });
};

function commandController(client, message, prefix) {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();
    const cmd = client.commands.get(command);
    try {
        if (!message.member.hasPermission(cmd.info.permission)) {
            let embed = new MessageEmbed()
                .setColor(client.config.color)
                .setAuthor("Missing Permission", client.deny)
                .setDescription("You're missing the permission `" + cmd.info.permission + "` to run this command.")
            return message.channel.send(`${message.member}`, { embed: embed }).then(a => a.delete({ timeout: 10000 }));
        }
    } catch {};
    if (cmd) {
        try {
            cmd.run(client, message, args)
        } catch (e) {
            return console.log(error, `[NON-FATAL]: ${e}`)
        };
    };
};