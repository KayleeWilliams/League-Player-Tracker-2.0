import { MessageEmbed } from "discord.js";

export const createEmbed = async (title: string, description: string, colour: number) => {
    const embed = new MessageEmbed()
        .setTitle(`${title}`)
        .setDescription(`${description}`)
        .setColor(colour)
        .setTimestamp()

    return embed
}