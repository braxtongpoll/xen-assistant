exports.run = async(client, message, args) => {
    let channel = await client.utils.findChannel(message, args);
    if (!channel) return client.missing(message, exports.info.arguments);
    client.docUpdate(message, "memberLogs", `${channel.id}`, "<:check:845537998207451136> Member Log channel updated.");
}, exports.info = {
    name: "memberlogs",
    aliases: [],
    permission: `MANAGE_GUILD`,
    description: `Set the channel for members join/leaves to be logged.`,
    arguments: 'CHANNEL'
}