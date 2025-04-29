let handler = async (m, { conn, text, usedPrefix }) => {
  // Ensure a new group subject is provided
  if (!text) {
    throw `❗ Please provide a new group name.\n\nUsage: ${usedPrefix}setsubject <new name>`;
  }
  try {
    // Update the group subject
    await conn.groupUpdateSubject(m.chat, text);
    await conn.reply(m.chat, "✅ Group name updated successfully!", m);
  } catch (e) {
    console.error(e);
    throw "❌ Failed to update group name.";
  }
};

handler.help = ["setsubject <new subject>"];
handler.tags = ["owner"];
handler.command = /^((set)?(judul|subje(ct|k)))$/i;
handler.admin = true; // User must be group admin
handler.botAdmin = true; // Bot must be group admin

module.exports = handler;
