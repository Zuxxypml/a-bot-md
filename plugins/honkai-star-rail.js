const axios = require("axios");
const cheerio = require("cheerio");

class HonkaiStarRailScraper {
  constructor() {
    this.baseUrl = "https://genshin.gg/star-rail/character-stats/";
    this.timeout = 10000; // 10 seconds timeout
  }

  async fetchCharacterData() {
    try {
      const { data } = await axios.get(this.baseUrl, {
        timeout: this.timeout,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        },
      });
      return cheerio.load(data);
    } catch (error) {
      console.error("Fetch Error:", error);
      throw new Error("Failed to fetch character data");
    }
  }

  async searchCharacter(name) {
    try {
      const $ = await this.fetchCharacterData();
      const characterData = {};

      $(".rt-tr").each((index, element) => {
        const characterName = $(element).find(".character-name").text().trim();
        if (characterName.toLowerCase().includes(name.toLowerCase())) {
          characterData.name = characterName;
          characterData.hp = $(element).find("div").eq(1).text().trim();
          characterData.atk = $(element).find("div").eq(2).text().trim();
          characterData.def = $(element).find("div").eq(3).text().trim();
          characterData.speed = $(element).find("div").eq(4).text().trim();
          characterData.taunt = $(element).find("div").eq(5).text().trim();
          characterData.image =
            $(element).find("img.character-icon").attr("src") || "";
          characterData.element =
            $(element).find(".character-element").attr("alt") || "Unknown";
          return false; // Break loop after finding match
        }
      });

      if (!characterData.name) throw new Error("Character not found");
      return characterData;
    } catch (error) {
      console.error("Search Error:", error);
      throw error;
    }
  }

  async listCharacters() {
    try {
      const $ = await this.fetchCharacterData();
      const characters = [];

      $(".rt-tr").each((index, element) => {
        const name = $(element).find(".character-name").text().trim();
        if (name) characters.push(name);
      });

      return characters.sort();
    } catch (error) {
      console.error("List Error:", error);
      throw new Error("Failed to fetch character list");
    }
  }
}

const handler = async (m, { conn, text }) => {
  const scraper = new HonkaiStarRailScraper();

  try {
    if (!text) {
      // Show character list if no query provided
      const characters = await scraper.listCharacters();
      const characterList = characters
        .map((name, i) => `${i + 1}. ${name}`)
        .join("\n");

      return conn.sendMessage(
        m.chat,
        {
          text:
            `🌟 *Honkai: Star Rail Characters*\n\n${characterList}\n\n` +
            `Use: *.honkai <name>* to get details`,
          contextInfo: {
            externalAdReply: {
              title: "Character List",
              body: "Honkai: Star Rail",
              thumbnailUrl: "https://i.imgur.com/JiZ2QyQ.png",
              mediaType: 1,
            },
          },
        },
        { quoted: m }
      );
    }

    // Search for specific character
    const character = await scraper.searchCharacter(text);
    const message = `
🎭 *${character.name}*
⚡ *Element:* ${character.element}
❤️ *HP:* ${character.hp}
⚔️ *ATK:* ${character.atk}
🛡️ *DEF:* ${character.def}
🏃 *Speed:* ${character.speed}
🎯 *Taunt:* ${character.taunt}
        `.trim();

    await conn.sendMessage(
      m.chat,
      {
        text: message,
        ...(character.image && {
          contextInfo: {
            externalAdReply: {
              title: character.name,
              body: "Character Details",
              thumbnailUrl: character.image,
              mediaType: 1,
            },
          },
        }),
      },
      { quoted: m }
    );
  } catch (error) {
    console.error("Handler Error:", error);
    const errorMessage = error.message.includes("not found")
      ? `Character "${text}" not found. Use *.honkai* to see available characters.`
      : "⚠️ An error occurred. Please try again later.";

    conn.reply(m.chat, errorMessage, m);
  }
};

// Command configuration
handler.help = ["honkai <name> - Get Honkai: Star Rail character info"];
handler.tags = ["games", "anime"];
handler.command = /^(honkai|starrail|hsr)$/i;
handler.limit = true;

module.exports = handler;
