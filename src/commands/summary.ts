
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { command } from "../interfaces/command";
import { queryRiot } from "../modules/riotAPI";
import { getUserData } from "../modules/getUser";
import { getMatchData } from "../modules/getMatchData";
import { convertChamp } from "../modules/convertChamp";
import { createEmbed } from "../modules/createEmbed";

export const summary: command = {
	data: new SlashCommandBuilder()
    	.setName('summary')
		.setDescription('Get a 7 day summary of a users games')
		.addStringOption(option =>
                    option.setName('range')
                        .setDescription('Summary from range')
                        .setRequired(true)
                        .addChoices(
                            { name: 'week', value: 'week' },
                            { name: 'day', value: 'day' }
                    	))
		.addUserOption(option =>
			option.setName('user')
				.setDescription('User to summarise')
				.setRequired(true)),

    run: async (interaction) => {
        
        await interaction.deferReply();
		const user = interaction.options.getUser("user", true);
		const range = interaction.options.getString("range", true);

		if (interaction.guildId!) {

			// Get response from database
			const userResult = await getUserData(user.id, interaction.guildId.toString());

			if (userResult.accounts.length != 0 && userResult!) {
				const accounts: string[][] = userResult.accounts;

				let data = false;
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
					var time = 604800;
					if (range == 'day') {
						time = 86400;
					}
 
					let uri = `https://${accounts[i][3]}.api.riotgames.com/lol/match/v5/matches/by-puuid/${accounts[i][0]}/ids?startTime=${Math.floor((Date.now() / 1000) - time)}&queue=420&count=100`;
                	const matches = await queryRiot(uri);

					// Loop through matches and add output to arrays
					if (matches) {
						if (matches.length != 0){
							for (let m in matches) {
								const matchData = await getMatchData(accounts[i][3], accounts[i][0], matches[m]);

								if (matchData != null) {

									sum.wins.push(matchData.win);
									sum.kills += matchData.kda[0];
									sum.deaths += matchData.kda[1];
									sum.assists += matchData.kda[2]; 
									sum.csTotal += matchData.csTotal;
									sum.csAverage += +matchData.csAverage;
									sum.matchIds.push(matchData.matchId);

									if (Object.keys(champs).includes(matchData.champ) == false) {
										champs[matchData.champ] = 0;
									}

									if (Object.keys(positions).includes(matchData.position) == false) {
										positions[matchData.position] = 0;
									}

									champs[matchData.champ] += 1;
									positions[matchData.position] += 1;
									data = true; 
								}
							}
						}
					} 
				} 
				
				if (!data) {
					const embed = await createEmbed('Error', `${interaction.options.getUser('user')!.username} has not played any games!`, 15158332)
					await interaction.editReply({ embeds: [embed] });
					return 
				}

				// Make data presentable
				const games = sum.matchIds.length

				const winrate = ((sum.wins.filter(Boolean).length/sum.wins.length) * 100).toFixed(2);

				const sortedChamps = Object.entries(champs).sort((a,b) => b[1]-a[1]).slice(0, 3)
				const sortedRoles = Object.entries(positions).sort((a,b) => b[1]-a[1]).slice(0, 3)

				let displayChamps = []
				let displayRoles = []

				for (let i = 0; i < sortedChamps.length; i++) {
					displayChamps.push(`${await convertChamp(sortedChamps[i][0])}` );
				}

				for (let i = 0; i < sortedRoles.length; i++) {
					displayRoles.push(`${sortedRoles[i][0]}`);
				}

				const avgKills = (sum.kills/games).toFixed(1);
				const avgDeaths = (sum.deaths/games).toFixed(1);
				const avgAssists = (sum.assists/games).toFixed(1);
				const avgCsTotal = (sum.csTotal/games).toFixed(0);
				const avgCsM = (sum.csAverage/games).toFixed(1);

				// Display output
				const embed = new MessageEmbed()
					.setTitle(`${interaction.options.getUser('user')!.username}'s 7 Day Summary!`)
					.setThumbnail(`attachment://${sortedChamps[0][0]}.png`)
					.addFields(
						{ name: 'Winrate', value: `${winrate}%`, inline: true },
						{ name: 'Games Played', value: `${games}`, inline: true },
						{ name: '\u200b', value: '\u200b', inline: true },
						{ name: 'Average KDA', value: `${avgKills}/${avgDeaths}/${avgAssists}`, inline: true },
						{ name: 'Average CS', value: `${avgCsTotal} (${avgCsM})`, inline: true },
						{ name: '\u200b', value: '\u200b', inline: true },
						{ name: 'Top Champs', value: `${displayChamps.join('\n')}`, inline: true },
						{ name: 'Top Roles', value: `${displayRoles.join('\n')}`, inline: true },
						{ name: '\u200b', value: '\u200b', inline: true },

                    );

				if (((sum.wins.filter(Boolean).length/sum.wins.length) * 100) >= 50) {
					embed.setColor(3066993);
				} else {
					embed.setColor(15158332);
				}

				if (range == 'day') {
					embed.setTitle(`${interaction.options.getUser('user')!.username}'s 24 Hour Summary!`)
				}

				
				// console.log(champs);
				await interaction.editReply({ embeds: [embed], files: [`./src/champions/${sortedChamps[0][0]}.png`] });
            }
        }
    }
}