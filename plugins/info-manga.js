// Manga Information Search Handler
const fetch = require("node-fetch");

var handler = async (m, { conn, text }) => {
  if (!text) throw `*Please enter the manga title you want to search!*`;

  await conn.reply(m.chat, "Searching for manga... Please wait", m);

  try {
    let res = await fetch(
      "https://api.jikan.moe/v4/manga?q=" + encodeURIComponent(text)
    );
    if (!res.ok) throw "Manga not found";

    let json = await res.json();
    if (!json.data || json.data.length === 0) throw "No results found";

    let manga = json.data[0];
    let {
      chapters,
      url,
      type,
      score,
      scored,
      scored_by,
      rank,
      popularity,
      members,
      background,
      status,
      volumes,
      synopsis,
      favorites,
    } = manga;

    // Process multiple titles, authors, and genres
    let titles = manga.titles.map((t) => `${t.title} [${t.type}]`).join("\n");
    let authors = manga.authors.map((a) => `${a.name}`).join(", ");
    let genres = manga.genres.map((g) => `${g.name}`).join(", ");

    // Format the manga information
    let mangaInfo = `
📚 *Title(s):* 
${titles}

📑 *Chapters:* ${chapters || "Unknown"}
📖 *Volumes:* ${volumes || "Unknown"}
📝 *Type:* ${type}
📊 *Status:* ${status}

⭐ *Score:* ${score} (by ${scored_by} users)
🏆 *Rank:* ${rank}
📈 *Popularity:* #${popularity}
❤️ *Favorites:* ${favorites}
👥 *Members:* ${members}

✍️ *Author(s):* ${authors}
🗂️ *Genres:* ${genres}

🔗 *More Info:* ${url}

📖 *Synopsis:*
${synopsis || "No synopsis available"}

${background ? `\n📝 *Background:*\n${background}` : ""}
        `.trim();

    // Send manga cover image with info
    await conn.sendFile(
      m.chat,
      manga.images.jpg.image_url,
      "manga.jpg",
      `*MANGA INFORMATION*\n${mangaInfo}`,
      m
    );
  } catch (error) {
    console.error("Manga search error:", error);
    await conn.reply(m.chat, `Error: ${error.message || error}`, m);
  }
};

handler.help = ["mangainfo <title>", "manga <title>", "infomanga <title>"];
handler.tags = ["anime", "manga"];
handler.command = /^(mangainfo|manga|infomanga)$/i;

module.exports = handler;
