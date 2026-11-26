import { existsSync } from "node:fs";
import path from "node:path";
import { Bot, Context, InlineKeyboard, InputFile,  } from "grammy";

function need(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

const BOT_TOKEN = need("BOT_TOKEN");
const CHANNEL_USERNAME = need("CHANNEL_USERNAME");
const WHATSAPP_LINK = need("WHATSAPP_LINK");

const FILE_PATH = path.join(process.cwd(), "files", "n8n-guide.docx");
const channelUrl = `https://t.me/${CHANNEL_USERNAME.replace("@", "")}`;



export const bot = new Bot(BOT_TOKEN);
async function isMember(userId: number): Promise<boolean> {
  try {
    const member = await bot.api.getChatMember(CHANNEL_USERNAME, userId);
    if (member.status === "restricted") return member.is_member;
    return ["creator", "administrator", "member"].includes(member.status);
  } catch (error) {
    console.error("getChatMember failed:", error);
    return false;
  }
}


const WELCOME_IMAGE = path.join(process.cwd(), "files", "welcome.jpg");

async function sendWelcome(ctx: Context, keyboard: InlineKeyboard) {
  const text =
    "👋 Welcome!\n\nJoin our Telegram channel, then tap the second button to get your file.";

  if (existsSync(WELCOME_IMAGE)) {
    await ctx.replyWithPhoto(new InputFile(WELCOME_IMAGE), {
      caption: text,
      reply_markup: keyboard,
    });
  } else {
    await ctx.reply(text, { reply_markup: keyboard });
  }
}


async function sendFile(ctx: Context) {
  if (!existsSync(FILE_PATH)) {
    console.error("File not found:", FILE_PATH);
    await ctx.reply("The file is not ready yet. Please try again soon.");
    return;
  }

  await ctx.replyWithDocument(new InputFile(FILE_PATH, "n8n-setup-guide.docx"), {
    caption: "Here is your n8n setup guide. Good luck!",
  });

  await ctx.reply(
    "Stuck? Ask questions and get help from other students in our WhatsApp community:\n" +
      WHATSAPP_LINK
  );
}


bot.command("start", async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  if (await isMember(userId)) {
    await sendFile(ctx);
    return;
  }

  const keyboard = new InlineKeyboard()
    .url("1. Join the channel", channelUrl)
    .row()
    .text("2. I joined, send me the file", "check");
    
  await sendWelcome(ctx, keyboard);
  await ctx.reply(
    "Welcome! To get the file, please join our Telegram channel first. Then tap the second button.",
    { reply_markup: keyboard }
  );
});

bot.callbackQuery("check", async (ctx) => {
  await ctx.answerCallbackQuery();
  if (await isMember(ctx.from.id)) {
    await sendFile(ctx);
  } else {
    await ctx.reply(
      "I cannot see you in the channel yet. Please join, wait a few seconds, then tap the button again."
    );
  }
});



bot.catch((err) => console.error("Bot error:", err.error));