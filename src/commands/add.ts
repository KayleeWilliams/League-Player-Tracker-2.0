import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { command } from "../interfaces/command";
import { queryRiot } from "../modules/riotAPI";
import { routing } from "../modules/routing";
import { getUserData } from "../modules/getUser";
import { newAccount } from "../modules/newAccount";
import { createEmbed } from "../modules/createEmbed";

export const add: command = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Add an account to a user')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('User to add the account to')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('region')
				.setDescription('The accounts region e.g. EUW')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('username')
				.setDescription('League Username')
				.setRequired(true)),

	run: async (interaction) => {
		await interaction.deferReply({ ephemeral: true });
		const user = interaction.options.getUser("user", true);

        // Get Platform 
        const platformResult = await routing(interaction.options.getString("region", true));
        const platform = platformResult[1]

        // Get PUUID for account if platform is correct 
        if (platformResult[1] != null) {
            // Get PUUID
            const uri = `https://${platformResult[1]}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${interaction.options.getString("username", true)}`;
            const puuidResult = await queryRiot(uri);

            if (puuidResult != null) {
                // Get user 
                const userResult = await getUserData(user.id, interaction.guildId!.toString());
                
                // Update the database
                const accountRes = await newAccount(userResult, puuidResult.puuid, platformResult[1], platformResult[2], platformResult[0])

                // If successful display success message
                if (accountRes != null) {
                    const embed = await createEmbed('Success!', `${interaction.options.getString("username")} has been added to ${user.username}`, 3066993)
                    await interaction.editReply({ embeds: [embed] });   
                } 

                else { 
                    const embed = await createEmbed('Error', `${interaction.options.getString("username")} is already added to this user`, 15158332)
                    await interaction.editReply({ embeds: [embed] });
                }
            }

            // If the puuid returns anything that isnt a puuid
            else {
                const embed = await createEmbed('Error', `${interaction.options.getString("username")} could not be found`, 15158332)
                await interaction.editReply({ embeds: [embed] });
            }
        }

        // If the region can't be found... 
        else {
            const embed = await createEmbed('Error', 'The region you entered could not be found.', 15158332)
            await interaction.editReply({ embeds: [embed] });
        }
  },
};
