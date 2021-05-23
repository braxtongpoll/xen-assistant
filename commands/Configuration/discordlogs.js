exports.run = async(client, message, args) => {
    let channel = await client.utils.findChannel(message, args);
    if (!channel) return client.missing(message, exports.info.arguments);
    client.docUpdate(message, "discordLogs", `${channel.id}`, "<:check:845537998207451136> Discord Logs channel updated.");
}, exports.info = {
    name: "discordlogs",
    aliases: [],
    permission: `MANAGE_GUILD`,
    description: `Set the channel for discord audit logs.`,
    arguments: 'CHANNEL'
}