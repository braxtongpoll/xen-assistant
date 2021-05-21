module.exports = async(client, message) => {
    if (message.author.bot || !message.guild || !message.member) return;
    client.db.findById(client.user.id, (err, res) => {
        console.log(res);

    });
};