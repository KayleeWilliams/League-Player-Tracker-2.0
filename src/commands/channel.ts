
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { command } from "../interfaces/command";
import { getChannel } from "../modules/getChannel";
import { updateChannel } from "../modules/updateChannel"
import { createEmbed } from "../modules/createEmbed"

export const channel: command = {
	data: new SlashCommandBuilder()
		.setName('channel')
		.setDescription('Set a channel to send outputs to')
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('Channel to send outputs to')
				.setRequired(true)),

	run: async (interaction) => {
		await interaction.deferReply();
		const channel = interaction.options.getChannel("channel", true);
        
        // Find server
        const server = await getChannel(interaction.guildId);
        const channelReuslt = await updateChannel(server, channel.id);
       
        if (channelReuslt) {
            const embed = await createEmbed('Success', 'The new channel has been set!', 3066993);
            await interaction.editReply({ embeds: [embed] });
        }

        else {
            const embed = await createEmbed('Error', 'An error occured whilst changing the channel!', 15158332  );
            await interaction.editReply({ embeds: [embed] });
        }
		
  },
};
