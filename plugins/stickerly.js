const fetch = require("node-fetch");
const { sticker } = require("../lib/sticker");
let confirm = {};

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // If no search query provided, show usage example
  if (!text)
    throw `*This command fetches stickers from Stickerly based on a search query*\n\nExample usage:\n${
      usedPrefix + command
    } spongebob`;

  // Fetch sticker options from the API
  let res = await fetch(
    global.API("lolhuman", "/api/stickerwa", { query: text }, "apikey")
  );
  if (!res.ok) throw "Server error... please notify the bot owner";
  let json = await res.json();
  if (!json.status) throw "Server error";

  // Take the first 10 results
  let result = json.result.slice(0, 10);
  // Prompt user to pick one
  m.reply(
    `*Please choose a number*\n\n` +
      result.map((v, i) => `${i + 1}. ${v.title} (${v.author})`).join("\n")
  );

  // Store the options for when they reply
  confirm[m.sender] = { result };
};

handler.all = async function (m) {
  // Handle numeric choice or "stop"
  if (/^([1-9][0-9]?|stop)$/i.test(m.text)) {
    if (!(m.sender in confirm)) return;
    if (/stop/i.test(m.text)) {
      delete confirm[m.sender];
      return true;
    }

    let { result } = confirm[m.sender];
    let choice = parseInt(m.text);
    await m.reply(`_Number ${choice} selected_`);

    let selected = result[choice - 1];
    m.reply(
      `*Name:* ${selected.title}\n` +
        `*Total stickers:* ${selected.stickers.length}`
    );

    // Send each sticker with a short delay
    for (let url of selected.stickers) {
      let output = await sticker(false, url, global.packname, global.author);
      await conn.sendFile(m.chat, output, "stickerly.webp", "", m);
      await delay(1500);
    }

    delete confirm[m.sender];
    return true;
  }
};

handler.help = ["stickerly <search>"];
handler.tags = ["stickerother"];
handler.command = /^s(tic?ker)?(ly|wa)$/i;
handler.private = true;
handler.limit = 2;

module.exports = handler;

const delay = (time) => new Promise((res) => setTimeout(res, time));
