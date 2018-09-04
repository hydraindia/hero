const Discord = require('discord.js');

module.exports = (client, message, args) => {
  
  const embed = new Discord.MessageEmbed()
    .setTitle(message.guild.name)
    .setThumbnail(message.guild.iconURL())
    .setFooter(message.guild.owner.user.tag, message.guild.owner.user.avatarURL())
    .addField('Members', `${message.guild.members.filter(member => member.user.bot).size} bots of ${message.guild.memberCount} members.`)
    .addField('Channels', `${message.guild.channels.filter(chan => chan.type === 'voice').size} voice / ${message.guild.channels.filter(chan => chan.type === 'text').size} text`)
    .addField('Roles', message.guild.roles.map(r => r.name).join(' , '));
  message.channel.send({ embed });
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "serverinfo",
  category: "Miscelaneous",
  description: "To Get Info About Server",
  usage: "serverinfo"
};