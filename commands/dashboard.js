var Discord = require(`discord.js`)
exports.run = async (client, message) => {

let d = new Discord.RichEmbed()

.addField('Dashboard','http://www.tetrabot.cf/?i=1')
.addBlankField(true);

message.channel.send(d)

}
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "dashboard",
  category: "System",
  description: "To Go On Dashboard Of Bot",
  usage: "To Configure Bot"
};


