exports.run = async(client, message, args) => {
    let channel = await client.utils.findChannel(message, args);
    if (!channel) return client.missing(message, exports.info.arguments);
    client.docUpdate(message, "partnerChannel", `${channel.id}`, "<:check:845537998207451136> Partner channel updated.");
}, exports.info = {
    name: "partnerchannel",
    aliases: [],
    permission: `MANAGE_GUILD`,
    description: `Set the channel for partners to be posted.`,
    arguments: 'CHANNEL'
}