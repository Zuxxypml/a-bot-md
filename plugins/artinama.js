const axios = require("axios");
const cheerio = require("cheerio");

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text)
    return m.reply(
      `Enter your name!\n\nExample:\n${usedPrefix + command} Wahyu`
    );
  let res = await getNameMeaning(text);
  if (!res.status) throw res.message;

  let cap = `
*Name:* ${res.message.name}
*Meaning:* ${res.message.meaning}
`.trim();

  m.reply(cap);
};

handler.help = ["artinama"].map((v) => v + " <name>");
handler.tags = ["primbon"];
handler.command = /^(artinama)$/i;

module.exports = handler;

async function getNameMeaning(value) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        "https://primbon.com/arti_nama.php?nama1=" +
          value +
          "&proses=+Submit%21+"
      )
      .then(({ data }) => {
        let $ = cheerio.load(data);
        let fetchText = $("#body").text();
        let result;
        try {
          result = {
            status: true,
            message: {
              name: value,
              meaning: fetchText
                .split("memiliki arti: ")[1]
                .split("Nama:")[0]
                .trim(),
              note: "You can also use numerology name compatibility apps to see how well your name aligns with yourself.",
            },
          };
        } catch {
          result = {
            status: false,
            message: `Meaning for the name "${value}" not found. Try searching with a different keyword.`,
          };
        }
        resolve(result);
      })
      .catch((err) => reject(err));
  });
}
