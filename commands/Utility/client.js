exports.run = async(client, message, args) => {
    message.delete().catch(() => {});
    let member = await client.utils.findMember(message, args);
    if (!member) return client.missing(message, exports.info.arguments)
    client.db.findById(client.user.id, async function(err, res) {
        let role = message.guild.roles.cache.find(r => r.id === res.clientRole);
        if (role) member.roles.add(role.id).catch(e => {});
        if (res.clients.includes(member.id)) {
            res.clients = res.clients.filter(id => id !== member.id);
            if (role) member.roles.remove(role.id).catch(e => {});
        } else {
            res.clients.push(member.id);
            if (role) member.roles.add(role.id).catch(e => {});
        }
        client.docUpdate(message, "clients", res.clients, "<:check:845537998207451136> Client list updated.");
    });
}, exports.info = {
    name: "client",
    aliases: [],
    permission: `MANAGE_GUILD`,
    description: `Add / Remove a user from the client list and role.`,
    arguments: 'USER'
}