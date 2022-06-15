
import { SlashCommandBuilder } from "@discordjs/builders";
import { command } from "../interfaces/command";

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
		console.log(user.username);
  },
};
