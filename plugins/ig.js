const axios = require("axios");
const cheerio = require("cheerio");
const FormData = require("form-data");

class InstagramDownloader {
  constructor() {
    this.baseUrl = "https://snapinst.app/";
    this.apiUrl = "https://snapinst.app/action2.php";
    this.timeout = 30000; // 30 seconds timeout
  }

  async getToken() {
    try {
      const { data } = await axios.get(this.baseUrl, { timeout: this.timeout });
      const $ = cheerio.load(data);
      return $("input[name=token]").attr("value");
    } catch (error) {
      console.error("Token Error:", error);
      throw new Error("Failed to get token");
    }
  }

  async extractMedia(scriptResult) {
    try {
      const extractedHTML = scriptResult
        .split(".innerHTML = ")[1]
        .split("; document.")[0];
      return eval(extractedHTML);
    } catch (error) {
      console.error("Extraction Error:", error);
      throw new Error("Failed to extract media");
    }
  }

  async download(url) {
    try {
      const token = await this.getToken();
      const form = new FormData();

      form.append("url", url);
      form.append("action", "post");
      form.append("token", token);

      const headers = {
        ...form.getHeaders(),
        Referer: this.baseUrl,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      };

      const { data } = await axios.post(this.apiUrl, form, {
        headers,
        timeout: this.timeout,
      });

      const executeJS = new Function(
        "callback",
        data.replace("eval", "callback")
      );
      const html = await new Promise((resolve, reject) => {
        try {
          executeJS(async (scriptResult) => {
            try {
              resolve(await this.extractMedia(scriptResult));
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });

      const $ = cheerio.load(html);
      const result = {
        username: $(".row div.left:eq(0)").text().trim() || "Unknown",
        avatar: $(".row img:eq(0)").attr("src") || "",
        urls: [],
      };

      $(".row .download-item").each((i, e) => {
        const url = $(e).find(".download-bottom a").attr("href");
        if (url) result.urls.push(url);
      });

      if (!result.urls.length) throw new Error("No downloadable media found");
      return result;
    } catch (error) {
      console.error("Download Error:", error);
      throw error;
    }
  }
}

const handler = async (m, { conn, args, usedPrefix, command, text }) => {
  const inputMessage = `❌ Invalid URL\n\nExample: ${
    usedPrefix + command
  } https://www.instagram.com/reel/CsC2PQCNgM1/`;

  if (!text) return m.reply(inputMessage);
  if (!text.match(/instagram\.com\//i)) return m.reply(inputMessage);

  const igdl = new InstagramDownloader();

  try {
    // Show processing indicator
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    const { urls, username, avatar } = await igdl.download(text);
    let sentCount = 0;

    // Send media with progress
    for (const url of urls) {
      try {
        await conn.sendMessage(
          m.chat,
          {
            [url.match(/\.(mp4|mov)$/i) ? "video" : "image"]: { url },
            caption:
              `📥 *Instagram Download*\n\n` +
              `👤 *Username*: ${username}\n` +
              `🔗 *Source*: ${text}\n` +
              `🔄 *Progress*: ${++sentCount}/${urls.length}`,
          },
          { quoted: m }
        );
      } catch (mediaError) {
        console.error("Media Send Error:", mediaError);
        await conn.sendMessage(
          m.chat,
          { text: `⚠️ Failed to send media ${sentCount + 1}\nURL: ${url}` },
          { quoted: m }
        );
      }
    }

    // Send success reaction
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  } catch (error) {
    console.error("Handler Error:", error);

    // Send error reaction
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });

    const errorMessage = error.message.includes("No downloadable media")
      ? "No media found in this Instagram post"
      : "Failed to download. The post may be private or unavailable.";

    await m.reply(`⚠️ ${errorMessage}\n\nTry another link or try again later.`);
  }
};

// Command configuration
handler.help = ["ig <url> - Download Instagram posts/reels"];
handler.tags = ["downloader", "social"];
handler.command = /^(ig|instagram|igdl)$/i;
handler.limit = true;

module.exports = handler;
