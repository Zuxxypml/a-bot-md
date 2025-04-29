const fetch = require("node-fetch");
const { sticker } = require("../lib/sticker");

let handler = async (m, { conn, args, usedPrefix, command }) => {
  // If no URL provided or it's not a valid Line Store sticker link, throw with usage example
  if (
    !args[0] ||
    !args[0].match(/https:\/\/store\.line\.me\/stickershop\/product\/.*/i)
  ) {
    throw `*This command fetches stickers from Line*\n\nExample usage:\n${
      usedPrefix + command
    } https://store.line.me/stickershop/product/8149770`;
  }

  // Fetch sticker data from the API
  let res = await fetch(
    global.API("lolhuman", "/api/linestick", { url: args[0] }, "apikey")
  );
  if (!res.ok) throw "Server error… please notify the bot owner";

  let json = await res.json();
  m.reply(`*Title:* ${json.result.title}`);

  // Convert each sticker URL into a sticker and send it
  for (let url of json.result.stickers) {
    let output = await sticker(false, url, global.packname, global.author);
    await conn.sendFile(m.chat, output, "linesticker.webp", "", m);
    await delay(1500);
  }
};

handler.help = ["linesticker <link>"];
handler.tags = ["sticker"];
handler.command = /^(stic?kerline)$/i;

handler.limit = true;

module.exports = handler;

// Simple delay helper
const delay = (time) => new Promise((res) => setTimeout(res, time));
