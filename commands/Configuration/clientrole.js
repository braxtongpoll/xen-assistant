exports.run = async(client, message, args) => {
    let channel = await client.utils.findRole(message, args);
    if (!channel) return client.missing(message, exports.info.arguments);
    client.docUpdate(message, "clientRole", `${channel.id}`, "<:check:845537998207451136> Client role updated.");
}, exports.info = {
    name: "clientrole",
    aliases: [],
    permission: `MANAGE_GUILD`,
    description: `Set the main client role.`,
    arguments: 'ROLE'
}