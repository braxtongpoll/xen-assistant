const mongoose = require('mongoose');

const main = new mongoose.Schema({
    _id: String,
    prefix: { type: String, default: "." },
    cases: { type: Object, default: {} },
    partners: { type: Object, default: {} },
    partnerChannel: { type: String, default: "" },
    partnerRoles: { type: String, default: "" },
    clients: { type: Object, default: {} },
    clientRoles: { type: String, defualt: "" },
    ticketNumber: { type: Number, default: 1 },
    ticketPanels: { type: Object, default: {} },
    reactionRoles: { type: Object, default: {} }
});
module.exports = mongoose.model(`main`, main);