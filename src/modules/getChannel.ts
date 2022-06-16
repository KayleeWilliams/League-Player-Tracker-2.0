import serversModel, { serversInt } from "../database/models/serversModel";

export const getChannel = async (serverId: string): Promise<serversInt> => {

  // If the user data exists return it
  let serverData = await serversModel.findOne({ serverId: serverId });

  return serverData;
};