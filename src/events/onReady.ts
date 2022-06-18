import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Client } from "discord.js";
import { commandList } from "../commands/commandList"
import { checkMatches } from "../modules/checkMatches"

export const onReady = async (bot: Client) => {
    const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN as string);
    const commandData = commandList.map((command) => command.data.toJSON());
    await rest.put(Routes.applicationCommands(`${process.env.DISCORD_CLIENT_ID}`), { body: commandData });

    console.log("Tracker online & ready!");
    setInterval(async() => { 
        await checkMatches(bot); 
    }, 2 * 60 * 1000);
};


