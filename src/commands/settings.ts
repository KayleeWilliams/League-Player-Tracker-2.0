
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { command } from "../interfaces/command";
import { getChannel } from "../modules/getChannel";
import { createEmbed } from "../modules/createEmbed"

export const settings: command = {
	data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Get info about a user or a server!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('channel')
                .setDescription('Set channel to output messages to')
                .addChannelOption(option => 
                    option.setName('channel')
                        .setDescription('Channel to output to')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('match-url')
                .setDescription('Display a link to the match in the output')
                .addStringOption(option =>
                    option.setName('status')
                        .setDescription('Show Match URL')
                        .setRequired(true)
                        .addChoices(
                            { name: 'show', value: 'true' },
                            { name: 'hide', value: 'false' }
                        )))
        .addSubcommand(subcommand =>
                subcommand
                    .setName('match-info')
                    .setDescription('Display match info e.g. champion, kda etc')
                    .addStringOption(option =>
                        option.setName('status')
                            .setDescription('Show Match Info')
                            .setRequired(true)
                            .addChoices(
                                { name: 'show', value: 'true' },
                                { name: 'hide', value: 'false' }
                            ))),

	run: async (interaction) => {
		await interaction.deferReply();

        // Get the server 
        const server = await getChannel(interaction.guildId);

        // Set channel command
        if (interaction.options.getSubcommand() === 'channel') {
            const channel = interaction.options.getChannel('channel', true);
            
            // Update 
            server.channelId = channel.id;
            await server.save()
 
            const embed = await createEmbed('Success', 'The new channel has been set!', 3066993);
            await interaction.editReply({ embeds: [embed] });
        }

         // Set URL Visability
        if (interaction.options.getSubcommand() === 'match-url') {
            const choice = interaction.options.getString("status", true);
            var mode = (choice === 'true');
            
            var embed;
            if (mode === server.matchUrl ){
                embed = await createEmbed('Error', `This setting is already ${choice}!`, 15158332);

            } else {
                // Update
                if (mode) {
                    server.matchUrl = true;
                } else {
                    server.matchUrl = false;
                }
                
                await server.save()
                embed = await createEmbed('Success', `Show Match URL set to ${choice}!`, 3066993);
            }

             await interaction.editReply({ embeds: [embed] });
        }

        // Set Match Info Visibilitu
        if (interaction.options.getSubcommand() === 'match-info') {
            const choice = interaction.options.getString("status", true);
            var mode = (choice === 'true');
            
            var embed;
            if (mode === server.matchInfo ){
                embed = await createEmbed('Error', `This setting is already ${choice}!`, 15158332);

            } else {
                // Update
                if (mode) {
                    server.matchInfo = true;
                } else {
                    server.matchInfo = false;
                }
                
                await server.save()
                embed = await createEmbed('Success', `Show match info set to ${choice}!`, 3066993);
            }

             await interaction.editReply({ embeds: [embed] });
        }
  },
};
