import serversModel, { serversInt } from "../database/models/serversModel";

export const getServerData = async (guild): Promise<serversInt> => {

  // If the user data exists return it
  let serverData = await serversModel.findOne({ serverId: guild.id });

  if (serverData) {
    return serverData;
  }
  
  const channel = guild.channels.cache.find(channel => channel.type === 'GUILD_TEXT' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'));

  // If not add the user to the database...
  serverData = await serversModel.create({
    serverId: guild.id,
    channelId: channel.id,
    date: Date.now(),
  });

  return serverData;
};