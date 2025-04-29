let handler = async (m, { conn, usedPrefix, command }) => {
  // Determine the target message (quoted image or the message itself)
  let q = m.quoted || m;
  let mime = (q.msg || q).mimetype || "";

  // Validate that it's an image
  if (!/image\/(jpe?g|png)/.test(mime)) {
    throw `❗ Please send or reply to a JPEG/PNG image.\n\nExample:\n${
      usedPrefix + command
    }`;
  }

  // Download the image buffer
  let imgBuffer = await q.download();
  if (!imgBuffer) {
    throw "❌ Image not found.";
  }

  try {
    // Update the group's profile picture
    await conn.updateProfilePicture(m.chat, imgBuffer);
    await conn.reply(
      m.chat,
      "✅ Group profile picture updated successfully!",
      m
    );
  } catch (e) {
    console.error(e);
    throw "❌ Failed to update group picture.";
  }
};

handler.help = ["setpp", "setgroupp"];
handler.tags = ["admin"];
handler.command = /^set(group)?pp$/i;

handler.group = true; // Must be in a group
handler.admin = true; // User must be an admin
handler.botAdmin = true; // Bot must be an admin

module.exports = handler;
