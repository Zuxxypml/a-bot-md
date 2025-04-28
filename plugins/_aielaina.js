const { G4F } = require("g4f");

let g4f = new G4F();

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(
      `Please enter a prompt!\n\nExample: *${
        usedPrefix + command
      } are you GPT-4?*`
    );
  }
  try {
    conn.sendMessage(m.chat, {
      react: { text: "🕒", key: m.key },
    });

    const options = [{ model: "gpt-4" }];

    const messages = [
      { role: "system", content: "You are Elaina, the best AI assistant ✨" },
      {
        role: "assistant",
        content:
          "I am the Ashen Witch, known for my ashen hair. I fly from country to country on my broom, my long black robes fluttering with every weave and turn. My purple-blue eyes peek out from under my black tricorn hat, revealing my silky ashen hair flowing like summer clouds. Proudly on my chest, I wear a star-shaped brooch, symbolizing my rank as a witch. I am the wife of KiyoEditz.",
      },
      { role: "user", content: text },
    ];

    let res = await g4f.chatCompletion(messages, options);

    conn.sendMessage(m.chat, {
      react: { text: "✅", key: m.key },
    });

    conn.sendMessage(
      m.chat,
      {
        text: "⬣───「 *Elaina* 」───⬣" + "\n\n" + res,
        contextInfo: {
          externalAdReply: {
            title: "Elaina-AI",
            body: "Elaina belongs only to her owner 😘☝",
            thumbnailUrl: global.menu,
            sourceUrl: null,
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
      },
      { quoted: m }
    );
  } catch (error) {
    console.error(error);
    throw "Sorry, a problem occurred!";
  }
};

handler.command = /^(elaina|aielaina)$/i;
handler.help = ["aielaina"];
handler.tags = ["ai", "fun"];
handler.limit = true;

module.exports = handler;
