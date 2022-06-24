import { REST } from "@discordjs/rest";
import { Client } from "discord.js";
import { MessageEmbed } from "discord.js";
import { getServerData } from "../modules/getServer";

export const guildCreate = async (guild) => {
    // guild.systemChannel.send('Thanks for adding me to your server! To get started please use /channel to tell me where to post!');
    // const serverData = await getServerData(guild);
    const embed = new MessageEmbed()
        .setTitle('Thank you for adding me to your server!')
        .setDescription('[Support Server](https://discord.gg/wXXxJX7vaC)')
        .addFields(		
            { name: 'Get Started', value: 'To get started set up the bot using the command `/settings`.' },
            { name: 'Commands', value: 'For a list of the commands and uses check them out [here](https://docs.google.com/document/d/1EPBz05fmxVPWouCLv-LwxgEhwy8k42v1BukAuOxNbqQ/edit?usp=sharing).' },
            { name: 'Permissions', value: 'Find out how to restrict users from accessing commands [here](https://discord.com/blog/slash-commands-permissions-discord-apps-bots).' },
            { name: 'Disclaimer', value: "Player Tracker isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc."}
        )
        .setTimestamp()
        .setColor(10181046)

    const channel = guild.channels.cache.find(channel => channel.type === 'GUILD_TEXT' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'));
    const serverData = await getServerData(guild);
    channel.send({ embeds: [embed] });
};


