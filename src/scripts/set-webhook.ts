import "dotenv/config";
import { Bot } from "grammy";

async function main() {
  const token = process.env.BOT_TOKEN;
  const url = process.env.URL;
  if (!token || !url) throw new Error("BOT_TOKEN and PUBLIC_URL are required");

  const bot = new Bot(token);
  await bot.api.setWebhook(`${url}/api/bot`, {
    secret_token: process.env.WEBHOOK_SECRET || undefined,
  });

  console.log(await bot.api.getWebhookInfo());
}

main();