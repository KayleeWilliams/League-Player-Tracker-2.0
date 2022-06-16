import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { command } from "../interfaces/command";
import { getPUUID } from "../modules/getPUUID"
import { routing } from "../modules/routing"
import { getUserData } from "../modules/getUser";
import { newAccount } from "../modules/newAccount"


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
		await interaction.deferReply();
		const user = interaction.options.getUser("user", true);

        // Get Platform 
        const platformResult = await routing(interaction.options.getString("region", true));
        const platform = platformResult[1]

        // Get PUUID for account if platform is correct 
        if (platformResult[1] != null) {
            // Get PUUID
            const puuidResult = await getPUUID(platformResult[1], interaction.options.getString("username", true));

            // Get user 
            const userResult = await getUserData(user.id, interaction.guildId!.toString());
            
            // Update the database
            const accountRes = await newAccount(userResult, puuidResult.puuid, platformResult[1], platformResult[2], platformResult[0])

            // If successful display success message
            if (accountRes) {
                 const embed = new MessageEmbed()
                    .setTitle('Success!')
                    .setDescription(`${interaction.options.getString("username")} has been added to ${user.username}`)
                    .setColor('#BD554C')
                    .setTimestamp()

                await interaction.editReply({ embeds: [embed] });   
            }
        }

        else {
            const embed = new MessageEmbed()
                .setTitle('Error!')
                .setDescription('The region you entered could not be found.')
                .setColor('#61C554')
                .setTimestamp()
            
            await interaction.editReply({ embeds: [embed] });
        }
  },
};
