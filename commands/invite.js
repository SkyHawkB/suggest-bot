module.exports.run = (client, message, args, config) => {
  message.channel.send("Invite the bot to your guild here: https://discordapp.com/api/oauth2/authorize?client_id=430017687968808972&permissions=346176&scope=bot");
};

module.exports.info = {
  "name": "invite",
  "help": "Get the bot's invite link!",
  "usage": "invite"
};
