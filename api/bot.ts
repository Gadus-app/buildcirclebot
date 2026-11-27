import { webhookCallback } from "grammy";
import { bot } from "../src/bot.js";

export default webhookCallback(bot, "https");

async function main() {
  await bot.api.deleteWebhook();
  console.log("Bot running locally (polling). Press Ctrl+C to stop.");
  await bot.start();
}

main();