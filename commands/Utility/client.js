exports.run = async(client, message, args) => {
    message.delete().catch(() => {});
    let channel = await client.utils.findMember(message, args);
    if (!member) return client.missing(message, exports.info.arguments)
    client.db.findById(client.user.id, async function(err, res) {

    });
}, exports.info = {
    name: "client",
    aliases: [],
    permission: `MANAGE_GUILD`,
    description: `Add / Remove a user from the client list and role.`,
    arguments: 'USER'
}