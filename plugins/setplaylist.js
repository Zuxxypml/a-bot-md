const fs = require("fs");
const fetch = require("node-fetch");

const FILE_PATH = "lib/playlist.json";

let handler = async (m, { conn, text, usedPrefix }) => {
  // Ensure the playlist file exists
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(
      FILE_PATH,
      JSON.stringify({ default: "3AaKHE9ZMMEdyRadsg8rcy", id: "" }, null, 2)
    );
  }

  // Load current playlist settings
  let file = JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));

  if (!text) {
    // Reset playlist if no ID provided
    file.id = "";
    m.reply(
      `✅ Playlist has been reset!\n\n` +
        `Use:\n` +
        `${usedPrefix}setplaylist <spotify_playlist_id> to change it.\n` +
        `Example:\n` +
        `${usedPrefix}setplaylist 37i9dQZF1DWTwnEm1IYyoj`
    );
  } else {
    // Validate the provided Spotify playlist ID
    const playlistId = text.trim();
    const res = await fetch(`https://open.spotify.com/playlist/${playlistId}`);
    if (!res.ok) {
      throw "❌ Spotify returned an error. Please check the playlist ID or report to the owner.";
    }
    // Update with the new ID
    file.id = playlistId;
    m.reply(`✅ Successfully updated the playlist to: ${playlistId}`);
  }

  // Save changes
  fs.writeFileSync(FILE_PATH, JSON.stringify(file, null, 2), "utf8");
};

handler.help = ["setplaylist <id>"];
handler.tags = ["owner"];
handler.command = /^setplaylist$/i;
handler.owner = true;

module.exports = handler;
