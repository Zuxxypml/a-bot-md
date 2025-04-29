/*
 * [Genshin Impact Character Guide Plugin] (CJS)
 * By Fruatre (improved)
 * Contact: wa.me/6285817597752
 * Channel: https://whatsapp.com/channel/0029VaNR2B6BadmioY6mar3N
 */

const axios = require("axios");
const cheerio = require("cheerio");

class GenshinCharacter {
  constructor() {
    this.baseUrl = "https://genshin.gg/characters";
  }

  async getCharacter(name) {
    try {
      const url = `${this.baseUrl}/${name.toLowerCase()}`;
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      return {
        title: $("title").text().replace(" - Genshin GG", ""),
        description: $('meta[name="description"]').attr("content"),
        element: $(".character-element").attr("alt") || "Unknown",
        weapon: $(".character-path-icon").attr("alt") || "Unknown",
        role: $(".character-role").text().trim() || "Unknown",
        upgradeMaterials: this.extractMaterials($),
        bestWeapons: this.extractWeapons($),
        bestArtifacts: this.extractArtifacts($),
        stats: this.extractStats($),
        bestTeams: this.extractTeams($),
        talents: this.extractSkills($, ".character-skills .character-skill"),
        passives: this.extractSkills(
          $,
          ".character-skills#passives .character-skill"
        ),
        constellations: this.extractSkills(
          $,
          ".character-skills#constellations .character-skill"
        ),
      };
    } catch (error) {
      console.error("Error fetching character data:", error);
      throw new Error("Failed to fetch character data");
    }
  }

  extractMaterials($) {
    return $(".character-materials-item")
      .map((_, el) => ({
        name: $(el).find(".character-materials-name").text().trim(),
        icon: $(el).find(".character-materials-icon").attr("src"),
      }))
      .get();
  }

  extractWeapons($) {
    return $(".character-build-weapon")
      .map((_, el) => ({
        rank: $(el).find(".character-build-weapon-rank").text().trim(),
        name: $(el).find(".character-build-weapon-name").text().trim(),
        icon: $(el).find(".character-build-weapon-icon").attr("src"),
      }))
      .get();
  }

  extractArtifacts($) {
    return $(".character-build-weapon-content.full")
      .map((_, el) => ({
        name: $(el).find(".character-build-weapon-name").text().trim(),
        icon: $(el).find(".character-build-weapon-icon").attr("src"),
        pieces: $(el).find(".character-build-weapon-count").text().trim(),
      }))
      .get();
  }

  extractStats($) {
    return $(".character-stats-item")
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean);
  }

  extractTeams($) {
    return $(".character-team")
      .map((_, el) => ({
        name: $(el).find(".character-team-name").text().trim(),
        characters: $(el)
          .find(".character-team-characters img")
          .map((_, img) => $(img).attr("alt"))
          .get(),
      }))
      .get();
  }

  extractSkills($, selector) {
    return $(selector)
      .map((_, el) => ({
        title: $(el).find(".character-skill-title").text().trim(),
        name: $(el).find(".character-skill-name").text().trim(),
        description: $(el).find(".character-skill-description").text().trim(),
      }))
      .get();
  }
}

let handler = async (m, { conn, args }) => {
  const genshin = new GenshinCharacter();
  const name = args[0];

  if (!name)
    return m.reply(
      "Please enter a character name!\nExample: .genshinchar diluc"
    );

  try {
    const data = await genshin.getCharacter(name);

    const formatList = (items, prefix = "-") =>
      items.map((item) => `${prefix} ${item.name}`).join("\n") ||
      "Not available";

    const response = `
🌟 *${data.title}* 🌟
${data.description || "No description available"}

⚡ *Element:* ${data.element}
⚔️ *Weapon:* ${data.weapon}
🎯 *Role:* ${data.role}

📦 *Upgrade Materials:*
${formatList(data.upgradeMaterials)}

💎 *Best Weapons:*
${data.bestWeapons.map((w, i) => `${i + 1}. ${w.name} (${w.rank})`).join("\n")}

🏺 *Best Artifacts:*
${data.bestArtifacts.map((a) => `- ${a.name} (${a.pieces})`).join("\n")}

📊 *Recommended Stats:*
${data.stats.join("\n") || "Not specified"}

👥 *Team Compositions:*
${data.bestTeams
  .map((t, i) => `${i + 1}. ${t.name}: ${t.characters.join(", ")}`)
  .join("\n")}

🎭 *Talents:*
${data.talents
  .map((t) => `*${t.title}:* ${t.name}\n${t.description}`)
  .join("\n\n")}

✨ *Constellations:*
${data.constellations
  .map((c) => `*${c.title}:* ${c.name}\n${c.description}`)
  .join("\n\n")}
    `.trim();

    await conn.reply(m.chat, response, m);
  } catch (e) {
    console.error(e);
    m.reply(
      "Character not found or there was an error. Please check the spelling and try again."
    );
  }
};

handler.help = [
  "genshinchar <character>",
  "genshinimpactcharacter <character>",
];
handler.tags = ["games", "tools"];
handler.command = /^(genshin(char|impactcharacter)?$/i;

module.exports = handler;
