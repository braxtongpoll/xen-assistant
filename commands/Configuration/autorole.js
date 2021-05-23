exports.run = async(client, message, args) => {
    let role = await client.utils.findRole(message, args);
    if (!role) return client.missing(message, exports.info.arguments);
    client.db.findById(client.user.id, (err, res) => {
        if (res.autoRoles.includes(role.id)) {
            res.autoRoles = res.autoRoles.filter(id => id !== role.id);
            client.docUpdate(message, "autoRoles", res.autoRoles, "<:check:845537998207451136> Auto roles were updated. Role removed.");
        } else {
            res.autoRoles.push(role.id);
            client.docUpdate(message, "autoRoles", res.autoRoles, "<:check:845537998207451136> Auto roles were updated. Role added.");
        }
    });
}, exports.info = {
    name: "autorole",
    aliases: [],
    permission: `MANAGE_GUILD`,
    description: `Add / Remove an autorole.`,
    arguments: 'ROLE'
}