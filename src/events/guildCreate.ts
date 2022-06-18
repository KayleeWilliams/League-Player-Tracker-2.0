import { REST } from "@discordjs/rest";
import { Client } from "discord.js";
import { getServerData } from "../modules/getServer";

export const guildCreate = async (guild) => {
    // guild.systemChannel.send('Thanks for adding me to your server! To get started please use /channel to tell me where to post!');
    // const serverData = await getServerData(guild);


    const channel = guild.channels.cache.find(channel => channel.type === 'GUILD_TEXT' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'));
    const serverData = await getServerData(guild);
    channel.send("Thanks for adding me to your server! To get started please use /channel to tell me where to post!");
};


