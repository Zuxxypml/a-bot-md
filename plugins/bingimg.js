const fetch = require("node-fetch");

let handler = async (
  m,
  { conn, args, text, command, usedPrefix, isCreator, isPrems }
) => {
  if (!text)
    return m.reply(
      `*Please provide a prompt!*\n\nExample:\n${
        usedPrefix + command
      } a dynamic origami representation of Luffy from One Piece, painted with vibrant colors, capturing the essence of the character's energy, in the style of manga illustrations, exaggerated facial expression, Canon EOS 5D Mark IV, studio portrait, shōnen anime`
    );

  conn.sendMessage(m.chat, {
    react: {
      text: "🕒",
      key: m.key,
    },
  });

  try {
    let url = await fetch(
      `https://api.alyachan.dev/api/bing-image?q=${encodeURIComponent(
        text
      )}&apikey=${api.alya}`
    );
    const res1 = await url.json();
    let teks1 = `*BING IMAGE SEARCH*\n\n`;
    teks1 += `∘ *Prompt* : ${text}`;

    for (let v of res1.data) {
      await conn.sendFile(m.chat, v.url, "", teks1, m);
    }
  } catch (e) {
    console.log(e);
    m.reply("```ERROR:``` " + e);
  }
};

handler.command = handler.help = ["bing-img", "bingimg", "bingimage"];
handler.tags = ["ai"];
handler.premium = true;
handler.limit = true;

module.exports = handler;
