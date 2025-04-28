const fetch = require("node-fetch");

let handler = async (m, { text }) => {
  if (!text)
    throw `Please input text and character!\nExample: .cai hi who are you|Kirito`;
  try {
    let [prompt, character] = text.split("|");
    m.reply(`Please wait a moment...`);

    let response = await fetch(
      API("btc", "api/search/c-ai?prompt", {
        prompt,
        char: character,
        apikey: btc,
      })
    );
    let json = await response.json();

    m.reply(json.message);
  } catch (error) {
    console.error(error);
    m.reply("An error occurred while running the command.");
  }
};

handler.command = handler.help = ["cai"];
handler.tags = ["ai"];
handler.owner = false;
handler.limit = false;
handler.group = false;
handler.private = false;

module.exports = handler;
