const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let bicon = bot.user.displayAvatarURL;
    let string = '';
    bot.guilds.forEach(guild => {
    string += guild.name + '\n';})
    let bt = bot.user.username;
    let botembed = new Discord.RichEmbed()
        .setColor("#000FF")
        .addField("Servers In", string)
        .setTimestamp()
        .setFooter("Command Used By: " + message.author.username, message.author.avatarURL);
    message.channel.send(botembed);
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "serverlist",
  category: "Miscelaneous",
  description: "To Get List Of Bot Server",
  usage: "serverlist"
};