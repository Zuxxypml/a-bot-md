let cheerio = require("cheerio");
let fetch = require("node-fetch");

let handler = async (m, { conn, args, usedPrefix, text, command }) => {
  const features = ["search", "read"];
  let [feature, input] = text.split("|").map((v) => v.trim());

  if (!features.includes(feature)) {
    return m.reply(
      `[ ! ] *Example usage:* ${usedPrefix}${command} search|kancil\n\n*Available Features:*\n` +
        features.map((v) => ` — ${v}`).join("\n")
    );
  }

  if (feature === "search") {
    if (!input)
      return m.reply(
        `[ ! ] *Example usage:* ${usedPrefix}${command} search|kancil`
      );
    await m.reply("_Searching, please wait..._");
    try {
      let res = await searchDongeng(input);
      let teks = res
        .map((item, index) => {
          return `🔍 *[ Result ${index + 1} ]*

📚 Title: ${item.entryTitle}
🔗 Link: ${item.link}
📝 Summary: ${item.entrySummary}`;
        })
        .filter(Boolean)
        .join("\n\n\n");
      await m.reply(teks || "No results found.");
    } catch (error) {
      console.error(error);
      m.reply(
        `Failed to process request. Please try again later.\n\nError: ${error}`
      );
    }
  }

  if (feature === "read") {
    if (!input)
      return m.reply(
        `[ ! ] *Example usage:* ${usedPrefix}${command} read|link`
      );
    await m.reply("_Reading story, please wait..._");
    try {
      let item = await readDongeng(input);
      let caption = `🔍 *[ Result ]*

📰 *Title:* ${item.title}
🖼️ *Thumbnail:* ${item.image}
📌 *Category:* ${item.cat}
🏷️ *Tag:* ${item.tag}
📝 *Content:* ${cleanText(item.content)}
👤 *Author:* ${item.author}
🗓️ *Date:* ${item.date}`;

      await conn.sendFile(m.chat, item.image, "", caption, m);
    } catch (error) {
      console.error(error);
      m.reply(
        `Failed to process request. Please try again later.\n\nError: ${error}`
      );
    }
  }
};

handler.help = ["dongeng search|<title>", "dongeng read|<link>"];
handler.tags = ["internet"];
handler.command = /^(dongeng)$/i;
handler.limit = true;

module.exports = handler;

/* Helper Functions */

function cleanText(html) {
  const regex = /<[^>]+>/g;
  return html.replace(regex, "").trim();
}

async function searchDongeng(query) {
  try {
    const url =
      "https://dongengceritarakyat.com/?s=" + encodeURIComponent(query);
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);
    const results = [];

    $("article").each((index, element) => {
      const article = $(element);
      results.push({
        entryTitle: article.find(".entry-title a").text().trim(),
        link: article.find(".entry-title a").attr("href"),
        imageSrc: article.find(".featured-image amp-img").attr("src"),
        entrySummary: article.find(".entry-summary").text().trim(),
        footerTag: article.find(".cat-links a").text().trim(),
        from: article.find(".tags-links a").text().trim(),
      });
    });

    return results;
  } catch (error) {
    console.error("Error during search:", error);
    return [];
  }
}

async function readDongeng(url) {
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  return {
    image: $("div.featured-image amp-img").attr("src"),
    title: $("h1.entry-title").text().trim(),
    date: $("span.posted-date").text().trim(),
    author: $("span.posted-author a").text().trim(),
    content: $("div.entry-content").html() || "",
    tag: $("span.tags-links a").text().trim(),
    cat: $("span.cat-links a").text().trim(),
  };
}
