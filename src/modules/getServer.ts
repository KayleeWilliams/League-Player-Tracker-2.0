import serversModel, { serversInt } from "../database/models/serversModel";

export const getServerData = async (guild): Promise<serversInt> => {

  // If the user data exists return it
  let serverData = await serversModel.findOne({ serverId: guild.id });

  if (serverData) {
    return serverData;
  }

  // If not add the user to the database...
  serverData = await serversModel.create({
    serverId: guild.id,
    channelId: guild.systemChannelId,
    date: Date.now(),
  });

  return serverData;
};