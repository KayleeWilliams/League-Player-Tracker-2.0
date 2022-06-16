import { serversInt } from "../database/models/serversModel";

export const updateChannel = async (server: serversInt, channelId: string) => {
    // Update the channel
    server.channelId = channelId
    await server.save();
    return server

}
