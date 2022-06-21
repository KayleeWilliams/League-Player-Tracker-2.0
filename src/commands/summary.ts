
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { command } from "../interfaces/command";
import { getUserData } from "../modules/getUser"
import { getMatches } from "../modules/getMatches";
import { getMatchData } from "../modules/getMatchData";
import { convertChamp } from "../modules/convertChamp";
import { createEmbed } from "../modules/createEmbed"

export const summary: command = {
	data: new SlashCommandBuilder()
    	.setName('summary')
		.setDescription('Get a 7 day summary of a users games')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('User to summarise')
				.setRequired(true)),

    run: async (interaction) => {
        
        await interaction.deferReply();
		const user = interaction.options.getUser("user", true);

		if (interaction.guildId!) {

			// Get response from database
			const userResult = await getUserData(user.id, interaction.guildId.toString());

			if (userResult.accounts.length != 0 && userResult!) {
				const accounts: string[][] = userResult.accounts;
				// const regions: {[index: string]:any} = {};
				let champs: {[index: string]: number} = {};
				let positions: {[index: string]: number} = {};

				const sum = {
					wins: [],
					kills: 0,
					deaths: 0,
					assists: 0,
					csTotal: 0,
					csAverage: 0,
					matchIds: [],
				} 

				// Loop through all accounts and get usernames + regions 
				for (let i = 0; i < accounts.length; i++) {

					// Get matches 
					const matches = await getMatches(accounts[i][3], accounts[i][0], Math.floor((Date.now() / 1000) - 604800));

					// Loop through matches and add output to arrays
                    if (matches.length != 0){
                        //for (let k = 0; i < matches.length; k++) {
						for (let m in matches) {
                            const matchData = await getMatchData(accounts[i][3], accounts[i][0], matches[m]);

							if (matchData != null) {
								sum.wins.push(matchData.win);
								sum.kills += matchData.kda[0];
								sum.deaths += matchData.kda[1];
								sum.assists += matchData.kda[2]; 
								sum.csTotal += matchData.csTotal;
								sum.csAverage += matchData.csAverage;
								sum.matchIds.push(matchData.matchId);


								if (Object.keys(champs).includes(matchData.champ) == false) {
									champs[matchData.champ] = 0;
								}

								if (Object.keys(positions).includes(matchData.position) == false) {
									positions[matchData.position] = 0;
								}

								champs[matchData.champ] += 1;
								positions[matchData.position] += 1;

							}
                        }
                    }
				}  
				
				const games = sum.matchIds.length

				const winrate = ((sum.wins.filter(Boolean).length/sum.wins.length) * 100).toFixed(2);

				const sortedChamps = Object.entries(champs).sort((a,b) => b[1]-a[1]).slice(0, 3)
				const sortedRoles = Object.entries(positions).sort((a,b) => b[1]-a[1]).slice(0, 2)

				// console.log(sortedChamps.slice(0, 3))
				let displayChamps = []
				let displayRoles = []

				for (let i = 0; i < sortedChamps.length; i++) {
					displayChamps.push(await convertChamp(sortedChamps[i][0]));
				}

				for (let i = 0; i < sortedRoles.length; i++) {
					displayRoles.push(sortedRoles[i][0]);
				}

				const avgKills = (sum.kills/games).toFixed(1);
				const avgDeaths = (sum.deaths/games).toFixed(1);
				const avgAssists = (sum.assists/games).toFixed(1);
				const avgCsTotal = (sum.csTotal/games).toFixed(0);
				const avgCsM = (sum.csAverage/games).toFixed(1);


				const embed = new MessageEmbed()
					.setTitle(`${interaction.options.getUser('user')!.username}'s 7 Day Summary!`)
					.setThumbnail(`attachment://${sortedChamps[0][0]}.png`)
					.addFields(
                        { name: 'Games Played', value: `${games}`, inline: false },
                        { name: 'Winrate', value: `${winrate}%`, inline: false },
						{ name: 'Top Champs', value: `${displayChamps.join(', ')}`, inline: false },
						{ name: 'Top Roles', value: `${displayRoles.join(', ')}`, inline: false },
						{ name: 'Average KDA', value: `${avgKills} / ${avgDeaths} / ${avgAssists}`, inline: false },
						{ name: 'Average CS', value: `${avgCsTotal} (${avgCsM})`, inline: false },
                    );

				if (((sum.wins.filter(Boolean).length/sum.wins.length) * 100) >= 50) {
					embed.setColor(3066993);
				} else {
					embed.setColor(15158332);
				}

				
				// console.log(champs);
				await interaction.editReply({ embeds: [embed], files: [`./src/champions/${sortedChamps[0][0]}.png`] });
            }

			else {
				const embed = await createEmbed('Error', `${interaction.options.getString("username")} has not played any games!`, 15158332)
                await interaction.editReply({ embeds: [embed] });
			}

        }
    }
}