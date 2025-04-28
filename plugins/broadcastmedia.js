const fs = require("fs");
const { readFileSync: read, unlinkSync: remove } = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { tmpdir } = require("os");

let handler = async (m, { conn, usedPrefix, command, text }) => {
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || q.mediaType || "";
  const pesan = m.quoted && m.quoted.text ? m.quoted.text : text;

  if (!mime || !/image/.test(mime)) {
    return conn.reply(
      m.chat,
      `Example: Reply/send an image with a caption *${usedPrefix + command}*`,
      m
    );
  }

  try {
    // Temporary file paths
    const timestamp = Date.now();
    const webpFile = path.join(tmpdir(), `${timestamp}.webp`);
    const pngFile = path.join(tmpdir(), `${timestamp}.png`);

    const media = await conn.downloadAndSaveMediaMessage(q, webpFile);

    // Convert webp to png
    exec(`ffmpeg -i ${media} ${pngFile}`, async (err) => {
      if (err) {
        console.error("Conversion error:", err);
        return m.reply("Failed to convert image.");
      }

      remove(media); // Remove the original webp

      const buffer = read(pngFile);

      let getGroups = await conn.groupFetchAllParticipating();
      let groups = Object.values(getGroups);
      let groupIds = groups.map((group) => group.id);

      conn.reply(
        m.chat,
        `_Sending broadcast to ${groupIds.length} groups..._`,
        m
      );

      for (let id of groupIds) {
        await delay(500);
        await conn
          .sendFile(id, buffer, `${timestamp}.png`, pesan, m)
          .catch(console.error);
      }

      m.reply(`✅ Successfully sent broadcast to ${groupIds.length} groups.`);

      remove(pngFile); // Cleanup converted png
    });
  } catch (e) {
    console.error(e);
    m.reply(`❌ An error occurred!\n\nError: ${e}`);
  }
};

handler.help = ["broadcastimg", "bcimg"].map((v) => v + " <text>");
handler.tags = ["owner"];
handler.command = /^(broadcastimg|bcimg)$/i;
handler.owner = true;

module.exports = handler;
