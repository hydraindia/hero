const Discord = require("discord.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const m = await message.channel.send("Fetching History...");
  const modChannel = message.guild.channels.find(c => c.name === message.settings.modLogChannel);
  if (!modChannel) {
    return m.edit(`Could not find #${message.settings.modLogChannel} channel. Please create it and try again`);
  }
  let target;
  try {
    target = message.mentions.users.first() || client.users.get(args[0]) || await client.fetchUser(args[0]);
  } catch (e) { console.log(e); }

  if (!target) target = message.author;
  await m.edit(`Fetching History for **${target.tag} (${target.id})** ...`);
  if (!client.logs.has(`${message.guild.id}-${target.id}`))
    return m.edit("No moderation action detected. This guy's clean as a whistle, Boss.");

  const actions = {};
  Object.values(client.logs.get(`${message.guild.id}-${target.id}`)).forEach(action => {
    if (!actions[action.type]) {
      actions[action.type] = 1;
    } else {
      actions[action.type]++;
    }
  });
  const embed = new Discord.RichEmbed()
    .setThumbnail(target.displayAvatarURL)
    .setAuthor(`${target.tag} (${target.id})`, target.displayAvatarURL);
  let str = "";
  for (const [key, value] of Object.entries(actions)) {
    str += `**${value} ${key.toProperCase()}s**\n`;
  }
  embed.addField("**Moderation History**", str);
  message.channel.send(embed);
};


exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "history",
  category: "Moderation",
  description: "View your moderation history or some other user's.",
  usage: "history [@user/ID]"
};