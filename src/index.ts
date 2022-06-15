import { Client } from "discord.js";
import { IntentOptions } from "./config/intentOptions";
import { connectDatabase } from "./database/connectDatabase";
import { onReady } from "./events/onReady";
import { onInteraction } from "./events/onInteraction";

(async () => {
  const bot = new Client({ intents: IntentOptions });

  // When bot is ready
  bot.on("ready", async () => await onReady(bot));

  // Interaction Handler 
  bot.on("interactionCreate", async (interaction) => await onInteraction(interaction));
  
  // Connect to MongoDB
  await connectDatabase();
 
  await bot.login(process.env.DISCORD_TOKEN);
})();