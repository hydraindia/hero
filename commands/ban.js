const Discord = require("discord.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const m = await message.channel.send("Banning User...");
  const modChannel = message.guild.channels.find(c => c.name === message.settings.modLogChannel);
  if (!modChannel) {
    return m.edit(`Could not find #${message.settings.modLogChannel} channel. Please create it and try again`);
  }
  let target;
  try {
    target = message.mentions.users.first() || client.users.get(args[0]) || await client.fetchUser(args[0]);
  } catch (e) { }
  if (!target) return m.edit("Could not locate member by ID or mention");
  
  const member = message.guild.member(target);
  if (member) {
    if (!member.bannable || message.member.highestRole.position <= member.highestRole.position) {
      return m.edit(`Nice try ${message.author}, but you can't ban that user. Or I can't. One thing's for sure: they ain't banned, and now they know you tried. Right, ${target}?`);
    }
  }

  const soft = ["s", "soft"].some(flag => message.flags.includes(flag));
  const clear = ["c", "clear"].some(flag => message.flags.includes(flag));

  const reason = args.slice(1).join(" ") || "No reason provided";
  const key =`${message.guild.id}-${target.id}`;
  client.logs.ensure(key, []);
  const days = (clear || soft) ? 7 : 0;
  let wasDMed;


  await target.send(`You've been banned from ${message.guild.name} by ${message.author.tag}, for: ${reason}.\nThere is currently no appeal system, so... kthxbai`)
    .catch(() => {
      wasDMed = "Member could not be DMed before ban";
    });
  try {
    await message.guild.ban(target.id, {reason, days});
    const embed = new Discord.RichEmbed()
      .setTitle(soft ? "Member Softban" : "Member Ban")
      .setDescription(`**Action** : Ban\n**User** : ${target.tag} (${target.id})\n**Reason** : ${reason}\n${wasDMed}`)
      .setThumbnail(target.displayAvatarURL)
      .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL)
      .setColor([255, 0, 0])
      .setTimestamp();
    const embedMessage = await modChannel.send(embed);
    client.logs.push(key, {
      type: soft ? "softban" : "ban", reason, timestamp: Date.now(), user: target.id, mod: message.author.id,
      channel: modChannel.id, message: embedMessage.id
    });
    if (soft) {
      await message.guild.unban(target.id, {reason: "Softban"});
      m.edit(`Successfully softbanned user ${target.tag}`);
    } else {
      m.edit(`Successfully banned user ${target.tag}`);
    }
  } catch (e) {
    await m.edit(`Could not ban user ${target.tag}: ${e}`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "ban",
  category: "Moderation",
  description: "Bans a user, with a reason. Use -clear (or -c) to clean their messages.",
  usage: "ban [-clean|-c] @user reason"
};