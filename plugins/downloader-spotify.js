const { getInfo, spotifydl } = require("../lib/spotify");
const canvafy = require("canvafy");

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text)
    throw `Please provide a Spotify link ‼️\n\n*Example:* ${
      usedPrefix + command
    } https://open.spotify.com/track/xxxxxxxx`;

  conn.sendMessage(m.chat, {
    react: {
      text: "🕒",
      key: m.key,
    },
  });

  try {
    let music = await spotifydl(text);
    const info = await getInfo(text);

    let caption =
      `🎵 *Spotify Download*\n\n` +
      `∘ *Title:* ${info.data.title}\n` +
      `∘ *Artist:* ${info.data.artist.name}\n` +
      `∘ *Artist ID:* ${info.data.artist.id}\n\n` +
      `${set.footer || ""}`;

    const spotifyCard = await new canvafy.Spotify()
      .setTitle(info.data.title)
      .setAuthor(htjava + " Spotify Downloader")
      .setTimestamp(40, 100)
      .setOverlayOpacity(0.8)
      .setBorder("#fff", 0.8)
      .setImage(info.data.thumbnail)
      .setBlur(3)
      .build();

    await conn.sendFile(m.chat, spotifyCard, "", caption, m);

    await conn.sendFile(
      m.chat,
      music.download,
      info.data.title + ".mp3",
      "",
      m,
      null,
      { asDocument: global.db.data.users[m.sender].useDocument }
    );
  } catch (e) {
    console.error(e);
    throw `An error occurred!\n\nError Code: ${e}`;
  }
};

handler.command = handler.help = ["spotify", "spotifydl"];
handler.tags = ["downloader"];

module.exports = handler;
