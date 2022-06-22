
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { command } from "../interfaces/command";
import { getUserData } from "../modules/getUser";
import { createEmbed } from "../modules/createEmbed"
import { queryRiot } from "../modules/riotAPI";

export const accounts: command = {
	data: new SlashCommandBuilder()
		.setName('accounts')
		.setDescription('List all accounts linked to a user')
		.addUserOption(option =>
		option.setName('user')
			.setDescription('User to list connected accounts')
			.setRequired(true)),

	run: async (interaction) => {
		await interaction.deferReply({ ephemeral: true });
		const user = interaction.options.getUser("user", true);

		// Create embed
		const embed = new MessageEmbed()
			.setTitle(`${interaction.options.getUser('user')!.username}'s Accounts `)
			.setTimestamp();

		if (interaction.guildId!) {

			// Get response from database
			const userResult = await getUserData(user.id, interaction.guildId.toString());

			if (userResult.accounts.length != 0 && userResult!) {
				const accounts: string[][] = userResult.accounts;
				const regions: {[index: string]:any} = {};

				// Loop through all accounts and get usernames + regions 
				for (let i = 0; i < accounts.length; i++) {
					const uri = `https://${accounts[i][2]}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${accounts[i][0]}`;
					const response = await queryRiot(uri);

					if (response != null) {
						if (Object.keys(regions).includes(accounts[i][4]) == false) {
							regions[accounts[i][4]] = new Array();
						}

						regions[accounts[i][4]].push(response.name);
					}
				}
				
				for (const [region, usernames] of Object.entries(regions)) {
					embed.addField(`${region}`, `${usernames.toString().replace(/,/g, '\n')}`, false);
				}
				embed.setColor('#61C554');
			}

			else {
				embed.addField('Error', 'No accounts found!', false);
				embed.setColor('#BD554C');
			}

			// Send the embed
			await interaction.editReply({ embeds: [embed] });
		}
  },
};
