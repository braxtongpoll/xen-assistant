const { MessageEmbed } = require("discord.js");

function findChannel(message, args) {
    let channel;
    if (message.mentions.channels.first()) {
        channel = message.mentions.channels.first();
    } else {
        channel = message.guild.channels.cache.find(c => c.id === args[0]);
    };
    return channel;
};

exports.findChannel = findChannel;

function findMember(message, args) {
    let member;
    if (message.mentions.members.first()) {
        member = message.mentions.members.first();
    } else {
        member = message.guild.members.cache.find(c => c.id === args[0]);
    };
    return member;
};

exports.findMember = findMember;

function findRole(message, args) {
    let role;
    if (message.mentions.roles.first()) {
        role = message.mentions.roles.first();
    } else {
        role = message.guild.roles.cache.find(c => c.id === args[0]);
    };
    return role;
};

exports.findRole = findRole;