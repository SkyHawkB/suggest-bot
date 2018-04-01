const MessageEmbed = require('discord.js').MessageEmbed;

module.exports.run = (client, message, args, config) => {
  const embed = new MessageEmbed()
    .setColor(65280)
    .setAuthor(message.guild.name, message.guild.iconURL({'format': 'png', 'size': 512}))
    .addField('Channel:', `${config.channel.name}`, true)
    .addField('Prefix:', config.prefix, true)
    .setFooter('Made by SkyHawk#1058', 'https://i.imgur.com/HIFpgjC.png');

  message.channel.send(embed);
};
