const axios = require("axios");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const cheerio = require("cheerio");

class KomikcastScraper {
  async search(query) {
    try {
      const response = await axios.get(
        `https://komikcast.cz/?s=${encodeURIComponent(query)}`,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        }
      );
      const $ = cheerio.load(response.data);
      const results = [];

      $(".list-update_item").each((_, element) => {
        results.push({
          title: $(element).find(".title").text().trim(),
          url: $(element).find("a").attr("href"),
          thumbnail: $(element).find("img").attr("src"),
        });
      });

      return results.length > 0 ? results : null;
    } catch (error) {
      console.error("Search error:", error);
      throw new Error("Failed to search manga");
    }
  }

  async getChapters(url) {
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const chapters = [];

      $(".komik_info-chapters-item").each((_, element) => {
        chapters.push({
          number: $(element).find(".chapter-link-item").text().trim(),
          url: $(element).find(".chapter-link-item").attr("href"),
          date: $(element).find(".chapter-link-time").text().trim(),
        });
      });

      return chapters.reverse(); // Latest first
    } catch (error) {
      console.error("Chapter error:", error);
      throw new Error("Failed to fetch chapters");
    }
  }

  async getDetails(url) {
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      return {
        title: $(".komik_info-content h1").text().trim(),
        altTitle: $(".komik_info-content-native").text().trim(),
        cover: $(".komik_info-cover-image img").attr("src"),
        synopsis: $(".komik_info-description-sinopsis p").text().trim(),
        status: $(".komik_info-content-status").text().trim(),
        author: $(".komik_info-content-author").text().trim(),
        genres: $(".komik_info-content-genre a")
          .map((_, el) => $(el).text().trim())
          .get(),
        updated: $(".komik_info-content-update time").attr("datetime"),
      };
    } catch (error) {
      console.error("Detail error:", error);
      throw new Error("Failed to fetch details");
    }
  }

  async generatePDF(url, title) {
    try {
      if (!fs.existsSync("temp")) fs.mkdirSync("temp");
      const pdfPath = `temp/${title.replace(
        /[^a-z0-9]/gi,
        "_"
      )}_${Date.now()}.pdf`;
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(pdfPath);

      doc.pipe(stream);
      doc.fontSize(18).text(title, { align: "center" });
      doc.moveDown();

      // Add manga details
      const details = await this.getDetails(url);
      doc.fontSize(12).text(`Author: ${details.author}`);
      doc.text(`Status: ${details.status}`);
      doc.text(`Genres: ${details.genres.join(", ")}`);
      doc.moveDown();
      doc.text(details.synopsis);
      doc.addPage();

      // Add cover image if available
      if (details.cover) {
        try {
          const image = await axios.get(details.cover, {
            responseType: "arraybuffer",
          });
          doc.image(Buffer.from(image.data), {
            fit: [400, 600],
            align: "center",
            valign: "center",
          });
        } catch (imgError) {
          console.error("Image error:", imgError);
          doc.text("[Cover image unavailable]");
        }
      }

      doc.end();
      await new Promise((resolve) => stream.on("finish", resolve));
      return pdfPath;
    } catch (error) {
      console.error("PDF error:", error);
      throw new Error("Failed to generate PDF");
    }
  }
}

const komik = new KomikcastScraper();

let handler = async (m, { conn, usedPrefix, command, text }) => {
  const [action, ...params] = text.split(" ");
  const query = params.join(" ");

  try {
    await m.reply("🔄 Processing your request...");

    switch (action.toLowerCase()) {
      case "search":
        if (!query) throw "Please provide a manga title";
        const results = await komik.search(query);
        if (!results?.length) throw "No manga found";

        let searchMsg = "🔍 *Search Results*\n\n";
        results.slice(0, 5).forEach((res, i) => {
          searchMsg += `${i + 1}. ${res.title}\n${res.url}\n\n`;
        });
        searchMsg += `Use ${usedPrefix}${command} detail [url] for more info`;
        await m.reply(searchMsg);
        break;

      case "detail":
        if (!query) throw "Please provide a manga URL";
        const details = await komik.getDetails(query);

        await conn.sendMessage(
          m.chat,
          {
            image: { url: details.cover },
            caption:
              `📚 *${details.title}*\n\n` +
              `📌 Alternate: ${details.altTitle}\n` +
              `✍️ Author: ${details.author}\n` +
              `📊 Status: ${details.status}\n` +
              `🏷️ Genres: ${details.genres.join(", ")}\n\n` +
              `📖 Synopsis:\n${details.synopsis}\n\n` +
              `Use ${usedPrefix}${command} chapters [url] to see chapters`,
          },
          { quoted: m }
        );
        break;

      case "chapters":
        if (!query) throw "Please provide a manga URL";
        const chapters = await komik.getChapters(query);

        let chaptersMsg = `📖 *Available Chapters*\n\n`;
        chapters.slice(0, 10).forEach((ch) => {
          chaptersMsg += `• ${ch.number} (${ch.date})\n${ch.url}\n\n`;
        });
        if (chapters.length > 10)
          chaptersMsg += `+ ${chapters.length - 10} more chapters...`;
        await m.reply(chaptersMsg);
        break;

      case "pdf":
        if (!query) throw "Please provide a manga URL";
        const pdfPath = await komik.generatePDF(query, "Manga_Info");
        await conn.sendFile(
          m.chat,
          pdfPath,
          "manga_info.pdf",
          "Here is your manga info PDF",
          m
        );
        fs.unlinkSync(pdfPath);
        break;

      default:
        throw (
          `Invalid action. Usage:\n` +
          `${usedPrefix}${command} search [title]\n` +
          `${usedPrefix}${command} detail [url]\n` +
          `${usedPrefix}${command} chapters [url]\n` +
          `${usedPrefix}${command} pdf [url]`
        );
    }
  } catch (error) {
    console.error("Handler error:", error);
    await m.reply(`❌ Error: ${error.message || error}`);
  }
};

handler.help = [
  "komik search <title>",
  "komik detail <url>",
  "komik chapters <url>",
  "komik pdf <url>",
];
handler.tags = ["manga"];
handler.command = /^(komik|manga)$/i;

module.exports = handler;
