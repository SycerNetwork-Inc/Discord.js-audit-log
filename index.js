console.log(`
███████╗██╗   ██╗ ██████╗███████╗██████╗ ███╗   ██╗███████╗████████╗██╗    ██╗ ██████╗ ██████╗ ██╗  ██╗
██╔════╝╚██╗ ██╔╝██╔════╝██╔════╝██╔══██╗████╗  ██║██╔════╝╚══██╔══╝██║    ██║██╔═══██╗██╔══██╗██║ ██╔╝
███████╗ ╚████╔╝ ██║     █████╗  ██████╔╝██╔██╗ ██║█████╗     ██║   ██║ █╗ ██║██║   ██║██████╔╝█████╔╝ 
╚════██║  ╚██╔╝  ██║     ██╔══╝  ██╔══██╗██║╚██╗██║██╔══╝     ██║   ██║███╗██║██║   ██║██╔══██╗██╔═██╗ 
███████║   ██║   ╚██████╗███████╗██║  ██║██║ ╚████║███████╗   ██║   ╚███╔███╔╝╚██████╔╝██║  ██║██║  ██╗
╚══════╝   ╚═╝    ╚═════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝    ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
                   Discord Audit Log By TinnerX                                                                                    
`)

const { Client, Intents, MessageEmbed } = require('discord.js');
const { token , guildID ,channel_log} = require('./config.json');

const client = new Client({ intents: [
    "GUILDS",
    "GUILD_BANS",
    "GUILD_EMOJIS_AND_STICKERS",
    "GUILD_INTEGRATIONS",
    "GUILD_INVITES",
    "GUILD_MEMBERS",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_MESSAGE_TYPING",
    "GUILD_PRESENCES",
    "GUILD_SCHEDULED_EVENTS",
    "GUILD_VOICE_STATES",
    "GUILD_VOICE_STATES",
    "GUILD_WEBHOOKS",
] });

client.on('ready', () => {
  console.log(`↳ Bot Online ${client.user.tag}!`);
});

client.on('channelCreate', async (message) => {
  if(message.guild.id !== guildID) return;
  async function post(title) {
    let room = client.channels.cache.get(channel_log)
    let embed = new MessageEmbed()
    .setColor("GREEN")
    .setAuthor(`🆕 Channel ${title} Created : ${message.name}`)
    .setFooter(`Channel ID : ${message.id}`)
    .setTimestamp()
    room.send({embeds: [embed]})
  }
  
  if(message.type === "GUILD_TEXT") { post("Text") }
  if(message.type === "GUILD_VOICE") { post("Voice") }
  if(message.type === "GUILD_CATEGORY") { post("Category") }
  if(message.type === "GUILD_NEWS") { post("News") }
  if(message.type === "GUILD_STORE") { post("Store") }
  if(message.type === "GUILD_STAGE_VOICE") { post("Stage Voice") }
});

client.on('channelDelete', async (message) => {
  if(message.guild.id !== guildID) return;
  async function post(title) {
    let room = client.channels.cache.get(channel_log)
    let embed = new MessageEmbed()
    .setColor("RED")
    .setAuthor(`🗑 Channel ${title} Deleted : ${message.name}`)
    .setFooter(`Channel ID : ${message.id}`)
    .setTimestamp()
    room.send({embeds: [embed]})
  }

  if(message.type === "GUILD_TEXT") { post("Text") }
  if(message.type === "GUILD_VOICE") { post("Voice") }
  if(message.type === "GUILD_CATEGORY") { post("Category") }
  if(message.type === "GUILD_NEWS") { post("News") }
  if(message.type === "GUILD_STORE") { post("Store") }
  if(message.type === "GUILD_STAGE_VOICE") { post("Stage Voice") }
});

client.on('channelPinsUpdate', async (message,date,urls) => {
  if(message.guild.id !== guildID) return;

  async function post(status,title) {
    let room = client.channels.cache.get(channel_log)
    let embed = new MessageEmbed()
    .setColor(`${status}`)
    .setAuthor(`📌 ${title} Channel ${message.name}`,'',urls)
    .setFooter(`Channel ID : ${message.id}`)
    .setTimestamp()
    room.send({embeds: [embed]})
  }

  if(message.type === "GUILD_TEXT" || message.type === "GUILD_NEWS") { if(date !== null) { post("GREEN",'Pin Message',`https://discord.com/channels/${message.guild.id}/${message.id}/${message.lastMessageId}`) } else { post("RED",'UnPin Message','') } }
});

client.on('channelUpdate', async (MessageOld,MessageNew) => {
  if(MessageOld.guild.id !== guildID && MessageNew.guild.id !== guildID) return;
  if(MessageOld.type === "GUILD_TEXT") {
    if(MessageNew.type === "GUILD_TEXT") {}
    if(MessageNew.type === "GUILD_NEWS") {}
  }
  if(MessageOld.type === "GUILD_VOICE") { 
    let room = client.channels.cache.get(channel_log)
    let embed = new MessageEmbed()
    .setAuthor(`🔊 Room ${MessageOld.name} Update.`)
    .setColor("BLURPLE")
    .setDescription(`\`\`\`
    Room Name : ${MessageOld.name} -> ${MessageNew.name}
    Region : ${MessageOld.rtcRegion === null ? 'Automatic' : MessageOld.rtcRegion} -> ${MessageNew.rtcRegion === null ? 'Automatic' : MessageNew.rtcRegion}
    Bitrate : ${MessageOld.bitrate} -> ${MessageNew.bitrate}
    UserLimit : ${MessageOld.userLimit === 0 ? 'Unlimit' : MessageOld.userLimit} -> ${MessageNew.userLimit === 0 ? 'Unlimit' : MessageNew.userLimit}\`\`\``)
    .setFooter(`Voice Room ID : ${MessageOld.id}`)
    .setTimestamp()
    room.send({embeds: [embed]})
   }
});

client.on('voiceStateUpdate', async (a, b) => {
  if (a.guild.id !== guildID && b.guild.id !== guildID) return;

  async function post(icon, id, idroom, status, color) {
    let room = client.channels.cache.get(channel_log);
    let nameroom = client.channels.cache.get(idroom)
    let name = client.users.cache.get(id)

    let embed = new MessageEmbed()
      .setColor(color)
      .setAuthor(`${name.username}#${name.discriminator}`,`https://cdn.discordapp.com/avatars/${name.id}/${name.avatar}`)
      .setDescription(`${icon} <@${name.id}> ${status} \`${nameroom.name}\``)
      .setTimestamp()
    room.send({ embeds: [embed] })
  }

  if (a.channelId !== null) { post("📤", a.id, a.channelId, "Leave for", "RED") }
  if (b.channelId !== null) { post("📥", b.id, b.channelId, "Join To", "AQUA") }
})

client.on('guildMemberAdd', async (message) => {
  if (message.guild.id !== guildID && b.guild.id !== guildID) return;
  let room = client.channels.cache.get(channel_log);
  let embed = new MessageEmbed()
  .setColor("GREEN")
  .setAuthor(`🚪 ${message.user.username}#${message.user.discriminator} Join Server`,`https://cdn.discordapp.com/avatars/${message.user.id}/${message.user.avatar}`)
  .setTimestamp()
  room.send({embeds : [embed]})
})

client.on('guildMemberRemove', async (message) => {
  if (message.guild.id !== guildID && b.guild.id !== guildID) return;
  let room = client.channels.cache.get(channel_log);
  let embed = new MessageEmbed()
  .setColor("RED")
  .setAuthor(`🚪 ${message.user.username}#${message.user.discriminator} Leave Server`,`https://cdn.discordapp.com/avatars/${message.user.id}/${message.user.avatar}`)
  .setTimestamp()
  room.send({embeds : [embed]})
})

client.login(token);
