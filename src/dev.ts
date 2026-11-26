import "dotenv/config";

async function main() {
  const { bot } = await import("./bot.js");
  await bot.api.deleteWebhook();
  console.log("Bot running locally (polling). Press Ctrl+C to stop.");
  await bot.start();
}

main();