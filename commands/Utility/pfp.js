exports.run = async(client, message, args) => {
    let member = message.mentions.members.first() || message.guild.members.cache.find(m => m.id === args[0]) || message.member;
    message.channel.send(member.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
}, exports.info = {
    name: "pfp",
    aliases: [],
    permission: `@everyone`,
    description: `Get someones profile picture.`,
    arguments: 'USER'
}