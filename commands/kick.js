const Discord = require("discord.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const m = await message.channel.send("Kicking User...");
  const modChannel = message.guild.channels.find(c => c.name === message.settings.modLogChannel);
  if (!modChannel) {
    return m.edit(`Could not find #${message.settings.modLogChannel} channel. Please create it and try again`);
  }
  let target;
  try {
    target = message.mentions.users.first() || client.users.get(args[0]) || await client.fetchUser(args[0]);
  } catch (e) { }
  const member = message.guild.member(target);
  if (!target || !member) return m.edit("Could not locate member by ID or mention");
  if (!member.kickable || message.member.highestRole.position <= member.highestRole.position) {
    return m.edit(`Nice try ${message.author}, but you can't ban that user. Or I can't. One thing's for sure: they ain't banned, and now they know you tried. Right, ${target}?`);
  }

  const reason = args.slice(1).join(" ") || "No reason provided";
  const key =`${message.guild.id}-${target.id}`;
  client.logs.ensure(key, []);
  const flag = message.flags[0];
  const days = (flag && (flag === "clear" || flag === "c")) ? 7 : 0;
  let wasDMed = "";
  await target.send(`You've been kicked from ${message.guild.name} by ${message.author.tag}, for: ${reason}.\nPlease make sure to correct your attitude before rejoining.`)
    .catch(err => {
      wasDMed = "Member could not be DMed before ban";
    });
  try {
    await member.kick({reason});
    const embed = new Discord.RichEmbed()
      .setTitle("Member Kick")
      .setDescription(`**Action** : Kick\n**User** : ${target.tag} (${target.id})\n**Reason** : ${reason}\n${wasDMed}`)
      .setThumbnail(target.displayAvatarURL)
      .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL)
      .setColor("#ffbb00")
      .setTimestamp();
    const embedMessage = await modChannel.send(embed);
    client.logs.push(key, {
      type: "kick", reason, timestamp: Date.now(), user: target.id, mod: message.author.id,
      channel: modChannel.id, message: embedMessage.id
    });
    m.edit(`Successfully kicked user ${target.tag}`);
  } catch (e) {
    m.edit(`Could not kick user ${target.tag}: ${e}`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "kick",
  category: "Moderation",
  description: "Kicks a user, with a reason. Use -clear (or -c) to clean their messages.",
  usage: "kick [-clean|-c] @user reason"
};