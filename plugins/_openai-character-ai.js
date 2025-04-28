const fetch = require("node-fetch");

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text)
    throw `Please provide input text and character!\nExample: ${
      usedPrefix + command
    } Hello Kirito|Kirito`;

  try {
    let [prompt, character] = text.split("|");
    m.reply("Please wait a moment...");

    let res = await fetch(
      `https://api.betabotz.eu.org/api/search/c-ai?prompt=${encodeURIComponent(
        prompt
      )}&char=${encodeURIComponent(character)}&apikey=beta-KiyoEditz`
    );
    let json = await res.json();

    m.reply(json.message);
  } catch (error) {
    console.error(error);
    m.reply("An error occurred while executing the command.");
  }
};

handler.command = handler.help = ["c-ai", "character-ai"];
handler.tags = ["tools"];
handler.owner = false;
handler.limit = false;
handler.group = false;
handler.private = false;

module.exports = handler;
