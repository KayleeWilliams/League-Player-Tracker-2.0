import usersModel, { usersInt } from "../database/models/usersModel";

export const getUserData = async (discordId: string, serverId: string): Promise<usersInt> => {

  // If the user data exists return it
  let userData = await usersModel.findOne({ discordId: discordId, serverId: serverId });

  if (userData) {
    return userData;
  }

  // If not add the user to the database
  userData = await usersModel.create({
    discordId: discordId,
    serverId: serverId,
    accounts: [],
  });

  return userData;
};