// Updated By Xnuvers007

const fetch = require("node-fetch");

var handler = async (m, { conn, text }) => {
  if (!text) throw `*Please enter the anime title you want to search!*`;
  conn.reply(m.chat, "Searching for ANIME... Please wait", m);
  let res = await fetch("https://api.jikan.moe/v4/anime?q=" + text);
  if (!res.ok) throw "Not Found";
  let json = await res.json();
  let {
    episodes,
    url,
    type,
    score,
    rating,
    scored_by,
    popularity,
    rank,
    season,
    year,
    members,
    background,
    status,
    duration,
    synopsis,
    favorites,
  } = json.data[0];
  // let studio = json.data[0].authors[0].name
  // let studiomynimelist = json.data[0].authors[0].url
  let producers = json.data[0].producers
    .map((prod) => `${prod.name} (${prod.url})`)
    .join("\n");
  let studio = json.data[0].studios
    .map((stud) => `${stud.name} (${stud.url})`)
    .join("\n");
  let genre = json.data[0].genres
    .map((xnuvers007) => `${xnuvers007.name}`)
    .join("\n");
  let judul = json.data[0].titles
    .map((jud) => `${jud.title} [${jud.type}]`)
    .join("\n");
  let trailerUrl = json.data[0].trailer.url;

  let animeingfo = `📺 TITLE: ${judul}
    📺 Trailer: ${trailerUrl}
    🎬 EPISODES: ${episodes}
    ✉️ TYPE: ${type}
    👺 GENRE: ${genre}
    🗂 STATUS: ${status}
    ⌛ DURATION: ${duration}
    🌟 FAVORITES: ${favorites}
    � SCORE: ${score}
    😍 RATING: ${rating}
    😎 SCORED BY: ${scored_by}
    💥 POPULARITY: ${popularity}
    ⭐ RANK: ${rank}
    ✨ SEASON: ${season}
    🏁 YEAR (RELEASE): ${year} 
    🤗 PRODUCERS: ${producers}
    🤠 STUDIO: ${studio}
    👥 MEMBERS: ${members}
    ⛓️ URL: ${url}
    📝 BACKGROUND: ${background}
    💬 SYNOPSIS: ${synopsis}
    `;
  conn.sendFile(
    m.chat,
    json.data[0].images.jpg.image_url,
    "anime.jpg",
    `*ANIME INFO*\n` + animeingfo,
    m
  );

  /*conn.reply(m.chat, 'DON'T FORGET TO SUPPORT THE DEVELOPER\nXnuvers007\nhttps://saweria.co/xnuvers007', m)*/
};
handler.help = [
  "animeinfo <anime>",
  "anime <anime>",
  "infoanime <anime>",
  "nimeinfo <anime>",
  "nime <anime>",
];
handler.tags = ["info"];
handler.command = /^(animeinfo|anime|infoanime|nimeinfo|nime)$/i;
module.exports = handler;
