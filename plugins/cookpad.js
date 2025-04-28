/*
Don't Remove WM Bang

*Cookpad Plugins CJS*

Basically for finding recipes.

*[Source]* 
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Scrape Source]* 
https://whatsapp.com/channel/0029Vb3ejRu2v1IvxWSPml0q/160
*/

const axios = require("axios");
const cheerio = require("cheerio");

class CookpadScraper {
  constructor(searchTerm) {
    this.searchTerm = searchTerm;
    this.baseUrl = "https://cookpad.com/id/cari/";
  }

  async fetchSearchResults(page = 1) {
    const url = `${this.baseUrl}${this.searchTerm}?page=${page}`;
    const response = await axios.get(url);
    return cheerio.load(response.data);
  }

  async extractRecipeLinks($) {
    const links = [];
    $("a.block-link__main").each((i, el) => {
      const href = $(el).attr("href");
      if (href) {
        links.push(`https://cookpad.com${href}`);
      }
    });
    if (
      links.length === 0 &&
      $(".text-cookpad-14.xs\\:text-cookpad-20.font-semibold")
        .text()
        .includes("Cannot find any recipes?")
    ) {
      throw new Error("No recipes found for this search.");
    }
    return links;
  }

  async fetchRecipePage(url) {
    const response = await axios.get(url);
    return cheerio.load(response.data);
  }

  async extractRecipeDetails($) {
    const title = $("h1").text().trim();
    const mainImage = $('img[alt^="Foto resep"]').attr("src");
    const cookingTime = $(".flex.flex-wrap .mise-icon-text")
      .first()
      .text()
      .trim();
    const serving = $(".flex.flex-wrap .mise-icon-text").last().text().trim();

    const ingredients = [];
    $("#ingredients .ingredient-list ol li").each((i, el) => {
      if ($(el).hasClass("font-semibold")) {
        const subheading = $(el).find("span").text().trim();
        ingredients.push(`*${subheading}*`);
      } else {
        const quantity = $(el).find("bdi").text().trim();
        const ingredient = $(el).find("span").text().trim();
        ingredients.push(`- ${quantity} ${ingredient}`);
      }
    });

    const steps = [];
    $("ol.list-none li.step").each((i, el) => {
      const stepNumber = $(el)
        .find(".flex-shrink-0 .text-cookpad-14")
        .text()
        .trim();
      const description = $(el).find('div[dir="auto"] p').text().trim();
      steps.push(`${stepNumber}. ${description}`);
    });

    return {
      title,
      mainImage,
      cookingTime,
      serving,
      ingredients: ingredients.join("\n"),
      steps: steps.join("\n"),
    };
  }

  async scrapeRecipes() {
    try {
      const $ = await this.fetchSearchResults();
      const links = await this.extractRecipeLinks($);

      if (links.length === 0) {
        throw new Error("No recipes found for this search.");
      }

      const recipePage = await this.fetchRecipePage(links[0]);
      return await this.extractRecipeDetails(recipePage);
    } catch (error) {
      return { error: error.message };
    }
  }
}

let handler = async (m, { text, conn }) => {
  if (!text)
    return m.reply(
      "Please enter the name of the recipe you want to search for.\nExample: .cookpad fried chicken"
    );

  let scraper = new CookpadScraper(text);
  let recipe = await scraper.scrapeRecipes();

  if (recipe.error) return m.reply(recipe.error);

  let caption =
    `*${recipe.title}*\n\n` +
    `*Cooking Time:* ${recipe.cookingTime}\n` +
    `*Servings:* ${recipe.serving}\n\n` +
    `*Ingredients:*\n${recipe.ingredients}\n\n` +
    `*Steps:*\n${recipe.steps}`;

  if (recipe.mainImage) {
    conn.sendMessage(
      m.chat,
      { image: { url: recipe.mainImage }, caption },
      { quoted: m }
    );
  } else {
    m.reply(caption);
  }
};

handler.help = ["cookpad"];
handler.command = ["cookpad"];
handler.tags = ["internet", "search"];
handler.limit = false;

module.exports = handler;
