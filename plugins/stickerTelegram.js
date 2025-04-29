const fetch = require("node-fetch");

const fetchStickers = async (query) => {
  const url = `https://api.telegram.org/bot${
    process.env.TELEGRAM_TOKEN
  }/getStickerSet?name=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!data.ok) {
      throw new Error(data.description || "Error fetching sticker set");
    }
    const stickers = data.result.stickers;
    return stickers.map((sticker) => ({
      file_id: sticker.file_id,
      url: `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${sticker.file_id}`,
    }));
  } catch (error) {
    throw new Error("Error occurred while fetching stickers.");
  }
};

const getRandomSticker = (stickers) =>
  stickers[Math.floor(Math.random() * stickers.length)];

const handler = async (m, { conn, text, usedPrefix, command }) => {
  const [query, count] = text.split("|").map((s) => s.trim());

  if (!query) {
    return m.reply(
      `❗ Invalid input.\n` +
        `Use the correct format:\n` +
        `${usedPrefix + command} [query]\n` +
        `${usedPrefix + command} [query]|[number]\n` +
        `${usedPrefix + command} [query]|all\n` +
        `${usedPrefix + command} [query]|random`
    );
  }

  try {
    const stickers = await fetchStickers(query);

    if (!stickers.length) {
      return m.reply("❗ No stickers found.");
    }

    // Send one random sticker
    if (!count || count.toLowerCase() === "random") {
      const randomSticker = getRandomSticker(stickers);
      return conn.sendFile(
        m.chat,
        randomSticker.url,
        "",
        "*Random Telegram Sticker*",
        m
      );
    }

    // Send all stickers
    if (count.toLowerCase() === "all") {
      for (const stk of stickers) {
        await conn.sendFile(m.chat, stk.url, "", "", m);
        await new Promise((res) => setTimeout(res, 1000));
      }
      return;
    }

    // Send a specific sticker by number
    const index = parseInt(count, 10) - 1;
    if (isNaN(index) || index < 0 || index >= stickers.length) {
      return m.reply("❗ Invalid sticker number.");
    }

    return conn.sendFile(
      m.chat,
      stickers[index].url,
      "",
      `*Telegram Sticker (${index + 1}/${stickers.length})*`,
      m
    );
  } catch (error) {
    console.error("Error fetching stickers:", error);
    return m.reply("❗ An error occurred while fetching stickers.");
  }
};

handler.help = [
  "stickertele [query]",
  "stickertelegram [query]|[number]",
  "telesticker [query]|all",
  "telegramsticker [query]|random",
];
handler.tags = ["sticker"];
handler.command = /^(stickertele(gram)?|telesticker|telegramsticker)$/i;
handler.limit = 1;

module.exports = handler;
