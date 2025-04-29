const { sticker } = require("../lib/sticker");
const { EmojiAPI } = require("emoji-api");
const emoji = new EmojiAPI();

// Supported platforms and their aliases
const platforms = {
  apple: ["ap", "ip", "apple"],
  facebook: ["fb", "fa", "facebook"],
  google: ["go", "google"],
  htc: ["ht", "htc"],
  lg: ["lg"],
  microsoft: ["mi", "mc", "microsoft"],
  mozilla: ["mo", "moz", "mozilla"],
  openmoji: ["op", "omoji", "openmoji"],
  pixel: ["pi", "pixel"],
  samsung: ["sa", "ss", "samsung"],
  twitter: ["tw", "twitter"],
  whatsapp: ["wa", "wh", "whatsapp"],
};

// Help message
const helpMessage = `
╔══「 Emoji to Sticker 」══╗
╟ Usage: ${usedPrefix}emo [platform] <emoji>
╟ 
╟ Example: ${usedPrefix}emo wa ❤️
╟ 
╟ Supported Platforms:
╟ ap - Apple
╟ fb - Facebook
╟ go - Google
╟ ht - HTC
╟ lg - LG
╟ mi - Microsoft
╟ mo - Mozilla
╟ op - OpenMoji
╟ pi - Pixel
╟ sa - Samsung
╟ tw - Twitter
╟ wa - WhatsApp (default)
╚═══════════════════╝
`.trim();

let handler = async (m, { usedPrefix, conn, args, text }) => {
  // Input validation
  if (!text) throw helpMessage;

  // Extract platform and emoji
  let platform = "whatsapp"; // default
  let emojiText = text;

  // Check if platform is specified
  if (args[0].length <= 3 && !args[0].match(/\p{Emoji}/u)) {
    platform = args[0].toLowerCase();
    emojiText = args.slice(1).join(" ").trim();
  }

  // Validate emoji input
  const emojiMatch = emojiText.match(/\p{Emoji}/u);
  if (!emojiMatch) throw "Please provide a valid emoji!\n" + helpMessage;

  const singleEmoji = emojiMatch[0];
  if (emojiText.replace(singleEmoji, "").match(/\p{Emoji}/u)) {
    throw "Please provide only one emoji!\n" + helpMessage;
  }

  try {
    // Get emoji data
    const res = await emoji.get(singleEmoji);
    if (!res || !res.images) throw "Emoji not found!";

    // Find the correct platform
    let platformKey =
      Object.keys(platforms).find((key) => platforms[key].includes(platform)) ||
      "whatsapp";

    // Get platform index (matches EmojiAPI response structure)
    const platformIndex = [
      "apple",
      "google",
      "samsung",
      "microsoft",
      "whatsapp",
      "twitter",
      "facebook",
      "pixel",
      "openmoji",
      "htc",
      "lg",
      "mozilla",
    ].indexOf(platformKey);

    if (platformIndex === -1) throw "Invalid platform!";

    const emojiImage = res.images[platformIndex] || res.images[4]; // fallback to WhatsApp

    // Create sticker
    const stickerBuffer = await sticker(
      null,
      emojiImage.url,
      global.packname,
      global.author
    );

    // Send sticker with additional info
    await conn.sendMessage(
      m.chat,
      {
        sticker: stickerBuffer,
        contextInfo: {
          externalAdReply: {
            title: `Emoji: ${singleEmoji}`,
            body: `Platform: ${platformKey}`,
            thumbnail: await (await fetch(emojiImage.url)).buffer(),
            mediaType: 1,
            mediaUrl: "",
          },
        },
      },
      { quoted: m }
    );
  } catch (error) {
    console.error("Emoji sticker error:", error);
    throw `Failed to create sticker. Please check:\n1. Your emoji input\n2. Platform selection\n\n${helpMessage}`;
  }
};

handler.help = ["emo [platform] <emoji>", "semoji [platform] <emoji>"];
handler.tags = ["converter", "sticker"];
handler.command = /^s?emo(ji)?$/i;
handler.limit = true;

module.exports = handler;
