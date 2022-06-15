
import { SlashCommandBuilder } from "@discordjs/builders";
import { command } from "../interfaces/command";
import { getUserData } from "../modules/getUser";

export const accounts: command = {
	data: new SlashCommandBuilder()
		.setName('accounts')
		.setDescription('List all accounts linked to a user')
		.addUserOption(option =>
		option.setName('user')
			.setDescription('User to list connected accounts')
			.setRequired(true)),

	run: async (interaction) => {
		await interaction.deferReply();
		const user = interaction.options.getUser("user", true);
		if (interaction.guildId!) {
			// Get response from database
			const userResult = await getUserData(user.id, interaction.guildId.toString());
			if (userResult.accounts.length != 0) {
				console.log("more than 1!")
			}
		}
  },
};
