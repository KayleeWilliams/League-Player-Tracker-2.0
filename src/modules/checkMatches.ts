import serversModel from "../database/models/serversModel";
import usersModel from "../database/models/usersModel";
import { getMatches } from "./getMatches";
import { getMatchData } from "./getMatchData";
import { lastMatch } from "./updateLastMatch";
import { Client, MessageEmbed } from "discord.js";
import { getUserData } from "./getUser";
import { convertChamp } from "./convertChamp";

export const checkMatches = async (bot: Client) => {

  // Get servers
  const serverData = await serversModel.find({});

    for (let server of serverData) {
        let usersData = await usersModel.find({serverId: server.serverId});
    
        for (let user of usersData) {
            for (let account of user.accounts) {
                
                // Check if the user has played any matches 
                const matches = await getMatches(account[3], account[0], Math.floor((Date.now() / 1000) - 3600));
                
                // If they have get info on matches
                let matchData = null;
                if ((matches != null) && (matches[0] != account[1])) {
                    matchData = await getMatchData(account[3], account[0], matches[0]);
                }

                // If matches, display result...
                if (matchData != null) {
                    
                    // Update account to prevent repeats 
                    const toUpdate = await getUserData(user.discordId, user.serverId)
                    await lastMatch(toUpdate, account[0], account[2], matchData.matchId);

                    // Create embed
                    const embed = new MessageEmbed()
                        .setTimestamp()
                        .setDescription(`[Click here for more details](https://www.leagueofgraphs.com/match/${account[4].toLowerCase()}/${matchData.matchId.split(/_/)[1]})`) 
                        .setThumbnail(`attachment://${matchData.champ}.png`)

                    const discordUser = await bot.users.fetch(user.discordId);

                    if (matchData.win) {
                        embed.setTitle(`${discordUser.username} just won a game!`);
                        embed.setColor(3066993);
                    } else {
                        embed.setTitle(`${discordUser.username} just lost a game!`);
                        embed.setColor(15158332);
                    }

                    const displayName = await convertChamp(matchData.champ);

                    embed.addFields(
                        { name: 'Champion', value: `${displayName}`, inline: true },
                        { name: 'Role', value: `${matchData.position}`, inline: true },
                        { name: '\u200b', value: '\u200b', inline: true },
                        { name: 'KDA', value: `${matchData.kda.join('/')}`, inline: true },
                        { name: 'CS', value: `${matchData.csTotal} (${matchData.csAverage})`, inline: true },
                        { name: '\u200b', value: '\u200b', inline: true },
                    );

                    embed.setFooter({ text: `The match took ${String(matchData.gameLength[0]).padStart(2, '0')}:${String(matchData.gameLength[1]).padStart(2, '0')}` });

                    // Send the embed
                    const channel = await bot.channels.cache.get(server.channelId);
                    if (channel.type == "GUILD_TEXT") {
                        channel.send({ embeds: [embed], files: [`./src/champions/${matchData.champ}.png`]});
                    }
                }
            }
        }
    }
}