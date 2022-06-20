
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { command } from "../interfaces/command";

export const summary: command = {
	data: new SlashCommandBuilder()
    	.setName('summary')
		.setDescription('Get a 7 day summary of a users games')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('User to summarise')
				.setRequired(true)),
    run: async (interaction) => {
        
    }
}