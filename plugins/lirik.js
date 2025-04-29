const { lyrics } = require("../lib/lyrics");

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0])
    throw `Please enter a song and artist name!\n*Example:*\n*${usedPrefix}${command} Wizkid Essence*\n*${usedPrefix}${command} Burna Boy Last Last*`;

  try {
    const artistAndSong = args.join(" ");
    let searchResults = await lyrics.search(artistAndSong);

    if (!searchResults || searchResults.length === 0) {
      throw "Song not found. Try a different search term.";
    }

    const selectedResult = searchResults[0]; // Take the first result
    const songDetails = await lyrics.getLyrics(selectedResult.link);

    conn.reply(
      m.chat,
      `
🎶 *Title*: ${selectedResult.title}  
🎤 *Artist*: ${selectedResult.artist}  
💿 *Album*: ${selectedResult.album}  
📅 *Year*: ${songDetails.year}  
🔗 *URL*: ${selectedResult.link}  

📜 *LYRICS*:  
${songDetails.lyrics}  
    `.trim(),
      m
    );
  } catch (error) {
    console.error("Error:", error);
    conn.reply(
      m.chat,
      `Failed to fetch lyrics. Error: ${error.message || "Try again later."}`,
      m
    );
  }
};

// Command & Help Text
handler.help = ["lyrics"].map((v) => v + " <song>");
handler.tags = ["music"];
handler.command = /^(lyrics|songlyrics|lyric|findlyrics)$/i;

module.exports = handler;
