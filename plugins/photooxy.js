const fetch = require("node-fetch");

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let [t1, t2] = text.split("|");
  if (!t1)
    throw `Usage: ${usedPrefix + command} text\nor ${
      usedPrefix + command
    } text1 | text2`;

  let url;

  // Try photooxy1 (single text)
  url = await fetch(
    global.API("lolhuman", `/api/photooxy1/${command}`, { text: t1 }, "apikey")
  );

  if (!url.ok) {
    // If it fails, try photooxy2 (requires second text)
    if (!t2)
      throw `You need to provide a second text.\n\nExample:\n${
        usedPrefix + command
      } First Line | Second Line`;

    url = await fetch(
      global.API(
        "lolhuman",
        `/api/photooxy2/${command}`,
        { text1: t1, text2: t2 },
        "apikey"
      )
    );
    if (!url.ok) throw `Server Error: Failed to generate image.`;
  }

  // Send generated image to chat
  await conn.sendFile(
    m.chat,
    await url.buffer(),
    "photooxy.jpg",
    `*Effect:* ${command}`,
    m
  );
};

// List of supported commands
handler.command = handler.help = [
  "shadow",
  "cup",
  "cup2",
  "romance",
  "smoke",
  "burnpaper",
  "lovemessage",
  "undergrass",
  "love",
  "coffe",
  "woodheart",
  "woodenboard",
  "summer3d",
  "wolfmetal",
  "nature3d",
  "underwater",
  "goldenrose",
  "summernature",
  "fallleaves",
  "flamming",
  "harrypotter",
  "carvedwood",
  "arcade8bit",
  "battlefield4",
  "pubg",
  "bannerlol",
];

handler.tags = ["photooxy"];
handler.limit = true;

module.exports = handler;
