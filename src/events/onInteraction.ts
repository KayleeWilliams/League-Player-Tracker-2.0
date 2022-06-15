import { Interaction } from "discord.js";
import { commandList } from "../commands/commandList";

export const onInteraction = async (interaction: Interaction) => {
    if (interaction.isCommand()) {
        for (const command of commandList) {
            if (interaction.commandName === command.data.name) {
            await command.run(interaction);
            break;
            }
        }
    }
};