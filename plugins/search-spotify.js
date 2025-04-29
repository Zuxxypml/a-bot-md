const { searching } = require("../lib/spotify");

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Require a search query
  if (!text) {
    throw `Please enter a search query!\n\nExample: ${
      usedPrefix + command
    } Yesterday`;
  }

  // React with a “typing” indicator
  await conn.sendMessage(m.chat, {
    react: { text: "⏳", key: m.key },
  });

  try {
    // Perform the Spotify search
    const res = await searching(text);
    const results = res.data;

    if (!results || !results.length) {
      return m.reply(`No results found for "${text}".`);
    }

    // Build the message with each track’s info
    const messageText = results
      .map(
        (item) =>
          `╭─ 🎵 Title: *${item.title}*\n` +
          `│  ⭐ Popularity: *${item.popularity}*\n` +
          `╰─ 🔗 Link: ${item.url}\n`
      )
      .join("\n");

    // Prepare a fake contact to quote, so we get a nice preview
    const contactJid = "0@s.whatsapp.net";
    const contactName = await conn.getName(m.sender);
    const fakeContact = {
      key: {
        fromMe: false,
        participant: contactJid,
        ...(m.chat ? { remoteJid: contactJid } : {}),
      },
      message: {
        contactMessage: {
          displayName: contactName,
          vcard:
            `BEGIN:VCARD\n` +
            `VERSION:3.0\n` +
            `FN:${contactName}\n` +
            `TEL;waid=${m.sender.split("@")[0]}:${m.sender.split("@")[0]}\n` +
            `END:VCARD`,
        },
      },
    };

    // Send the search results with an external ad reply preview
    await conn.sendMessage(
      m.chat,
      {
        text: messageText,
        contextInfo: {
          externalAdReply: {
            title: `${htjava} Spotify Search`,
            body: `Search results for "${text}"`,
            thumbnailUrl: "https://telegra.ph/file/ede5c639173502e7e88cf.jpg",
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
      },
      { quoted: fakeContact }
    );
  } catch (error) {
    console.error(error);
    m.reply(`⚠️ An error occurred.\nError: ${error.message || error}`);
  }
};

handler.help = ["spotifysearch <query>", "spotifys <query>"];
handler.tags = ["search"];
handler.command = /^(spotifysearch|spotifys)$/i;

module.exports = handler;
