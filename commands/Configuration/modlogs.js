exports.run = async(client, message, args) => {
    let channel = await client.utils.findChannel(message, args);
    if (!channel) return client.missing(message, exports.info.arguments);
    client.docUpdate(message, "modLogs", `${channel.id}`, "<:check:845537998207451136> Moderation Logs channel updated.");
}, exports.info = {
    name: "modlogs",
    aliases: [],
    permission: `MANAGE_GUILD`,
    description: `Set the channel for moderation audit logs.`,
    arguments: 'CHANNEL'
}