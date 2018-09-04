const Discord = require("discord.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const m = await message.channel.send("Unbanning User...");
  const modChannel = message.guild.channels.find(c => c.name === message.settings.modLogChannel);
  if (!modChannel) {
    return m.edit(`Could not find #${message.settings.modLogChannel} channel. Please create it and try again`);
  }
  let target;
  try {
    const bans = await message.guild.fetchBans();
    target = bans.find(u=> u.id === args[0]);
  } catch (e) {}
  if (!target) {
    return m.edit("User not found or not banned from this guild.");
  }
  const reason = args.slice(1).join(" ");
  if (!reason) {
    return m.edit("Please provide a reason for the ban.");
  }
  const key =`${message.guild.id}-${target.id}`;
  client.logs.ensure(key, []);
  try {
    await message.guild.unban(target, reason);
    const embed = new Discord.RichEmbed()
      .setTitle("User Unban")
      .setDescription(`**Action** : Unban\n**User** : ${target.tag} (${target.id})\n**Reason** : ${reason}`)
      .setThumbnail(target.displayAvatarURL)
      .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL)
      .setColor("#ffbb00")
      .setTimestamp();
    const embedMessage = await modChannel.send(embed);
    client.logs.push(key, {
      type: "unban", reason, timestamp: Date.now(), user: target.id, mod: message.author.id,
      channel: modChannel.id, message: embedMessage.id
    });
    m.edit(`Successfully unbanned user ${target.tag}`);
  } catch (e) {
    m.edit(`Could not unban user ${target.tag}: ${e}`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "unban",
  category: "Moderation",
  description: "Bans a user, with a reason. Use -clear (or -c) to clean their messages.",
  usage: "unban @user reason"
};