/**
 * Update the bot’s profile picture.
 * Usage: Reply to an image with the command.
 */

let handler = async (m, { conn }) => {
  const botJid = conn.user.jid;
  const msg = m.quoted || m;
  const mime = (msg.msg || msg).mimetype || "";

  // Ensure the user replied to an image
  if (!/image\/(jpe?g|png)/.test(mime)) {
    throw "❗️ Please reply to a JPEG or PNG image.";
  }

  // Download the image buffer
  const imgBuffer = await msg.download();
  if (!imgBuffer) {
    throw "❗️ Failed to download the image.";
  }

  // Update the bot's profile picture
  await conn.updateProfilePicture(botJid, imgBuffer);
  await conn.reply(m.chat, "✅ Bot profile picture updated successfully!", m);
};

handler.help = ["setbotpp"];
handler.tags = ["owner"];
handler.command = /^(setbotpp)$/i;
handler.owner = true;

module.exports = handler;
