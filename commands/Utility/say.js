exports.run = async(client, message, args) => {
    message.delete().catch(() => {});
    let channel = await client.utils.findChannel(message, args) || message.channel;
    if (!args[0]) return client.missing(message, exports.info.arguments)
    channel.send(args.join(" "));
}, exports.info = {
    name: "say",
    aliases: [],
    permission: `MANAGE_GUILD`,
    description: `Have Xen Assistant say something.`,
    arguments: 'CONTENT TO SAY'
}