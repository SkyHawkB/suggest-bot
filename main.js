const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const stringify = require('pretty-json-stringify');
const globalConfig = require('./config/global/settings.json');

const onOwnMessage = (message) => {
  if(message.embeds.length == 0) return;
  if(message.embeds[0].fields.length != 1) return;

  message.react('✖');
  message.react('✔');
};
const getConfig = (message) => {
  return require(`./config/perguild/${message.guild.id}.json`);
};
const getPrefix = (message) => {
  return getConfig(message).prefix;
};

fs.readdir('./commands/', (err, files) => {
  console.log(' ');
  if(err) return console.error(err);

  files.forEach(file => {
    let eventFunction = require(`./commands/${file}`);
    let eventName = file.split(".")[0];
    console.log(`Loaded command '${eventName}'!`);

    client.on(eventName, (...args) => eventFunction.run(client, ...args));
  });

  console.log('All commands loaded!');
  console.log(' ');
});

client.once('ready', () => {
  console.log('Connected to Discord!');
  console.log(' ');
  client.user.setActivity(`for ideas...`, {'type': 'WATCHING'});
  client.guilds.forEach((value, key, map) => {
    if(!fs.existsSync(`./config/perguild/${value.id}.json`)) {
      let __default = require('./config/perguild/default.json');
      if(value.channels.find('name', 'suggestions') != null) {
        __default.channel = value.channels.find('name', 'suggestions');
      }

      const config = stringify(
        __default,
        {
          shouldExpand: (object, level, key) => {
            return true;
          },
          spaceBeforeColon: ''
        }
      );

      fs.writeFileSync(`./config/perguild/${value.id}.json`, config);
      console.log(`Created missing config for "${value.name}"!`);
    }
  });
});
client.on('message', (message) => {
  if(message.author.id == client.user.id) return onOwnMessage(message);

  if(message.author.bot) return;
  if(!message.guild) return message.channel.send('You must be in a server to use commands!');
  if(message.content.indexOf(getPrefix(message)) !== 0) return;

  const args = message.content.slice(getPrefix(message).length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(command.includes('/') || command.includes('\\')) return;

  if(fs.existsSync(`./commands/${command}.js`)) {
    try {
      const commandFile = require(`./commands/${command}.js`);
      commandFile.run(client, message, args, getConfig(message));
    } catch (err) {
      console.error(err);
    }
  } else {
    message.channel.send(`Command not found! Try \`${getPrefix(message)}help\` for a list of commands!`);
  }
});
client.on('guildCreate', (guild) => {
  let __default = require('./config/perguild/default.json');
  if(guild.channels.find('name', 'suggestions') != null) {
    __default.channel = guild.channels.find('name', 'suggestions');
  }

  const config = stringify(
    __default,
    {
      shouldExpand: (object, level, key) => {
        return true;
      },
      spaceBeforeColon: ''
    }
  );

  fs.writeFileSync(`./config/perguild/${guild.id}.json`, config);
  console.log(`Joined "${guild.name}" and initialized configs!`);
});
client.on('guildDelete', (guild) => {
  fs.unlinkSync(`./config/perguild/${guild.id}.json`);
  console.log(`Deleted configs for "${guild.name}"!`);
});

client.login(globalConfig.token);
