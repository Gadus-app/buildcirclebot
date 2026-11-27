import { bot } from "../src/bot.js";

async function main() {
  await bot.api.deleteWebhook();
  console.log("Bot running locally (polling). Press Ctrl+C to stop.");
  await bot.start();
}

main();