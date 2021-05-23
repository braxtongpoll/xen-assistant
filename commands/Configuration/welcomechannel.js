exports.run = async(client, message, args) => {
    let channel = await client.utils.findChannel(message, args);
    if (!channel) return client.missing(message, exports.info.arguments);
    client.docUpdate(message, "welcome_channel", `${channel.id}`, "<:check:845537998207451136> Welcome channel updated.");
}, exports.info = {
    name: "welcomechannel",
    aliases: [],
    permission: `MANAGE_GUILD`,
    description: `Set the channel to welcome new members.`,
    arguments: 'CHANNEL'
}