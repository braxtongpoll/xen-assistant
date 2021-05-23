const mongoose = require('mongoose');

const main = new mongoose.Schema({
    _id: String,
    prefix: { type: String, default: "." },
    cases: { type: Object, default: {} },
    partners: { type: Object, default: {} },
    partnerChannel: { type: String, default: "" },
    partnerRoles: { type: String, default: "" },
    clients: { type: Array, default: [] },
    clientRoles: { type: String, defualt: "" },
    ticketPanels: { type: Object, default: {} },
    reactionRoles: { type: Object, default: {} },
    welcome_channel: { type: String, default: null },
    memberLogs: { type: String, default: null },
    discordLogs: { type: String, default: null },
    autoRoles: { type: Array, default: [] },
    ticketLogs: { type: String, default: null },
    cases: { type: Object, default: {} },
    caseNumber: { type: Number, default: 1 },
    modLogs: { type: String, default: null }
});
module.exports = mongoose.model(`main`, main);