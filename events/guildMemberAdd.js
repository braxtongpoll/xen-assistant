const { MessageEmbed } = require('discord.js');
const path = require('path');
const Canvas = require('canvas');
const { writeFileSync } = require('fs');


module.exports = async(client, member) => {
    client.db.findById(client.user.id, async function(err, res) {

    });
    let welcome_channel = member.guild.channels.cache.get()

}