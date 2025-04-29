const axios = require("axios");

let handler = async (m, { conn, command, usedPrefix }) => {
  try {
    // Normalize the command to lowercase (this will be our search query)
    const query = command.toLowerCase();

    // Inform the user that the search has started
    await conn.reply(m.chat, "_Searching..._", m);

    // Request to the Pinterest API
    const response = await axios.get(
      "https://www.pinterest.com/resource/BaseSearchResource/get/",
      {
        params: {
          source_url: `/search/pins/?q=${encodeURIComponent(query)}`,
          data: JSON.stringify({
            options: {
              isPrefetch: false,
              query,
              scope: "pins",
              no_fetch_context_on_resource: false,
            },
            context: {},
          }),
          _: Date.now(),
        },
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      }
    );

    // Extract search results
    const results = response.data.resource_response?.data?.results || [];
    if (results.length === 0) {
      throw `No images found for "${query}".`;
    }

    // Extract image URLs
    const imageUrls = results
      .map((v) => v.images?.orig?.url)
      .filter((url) => url);
    if (imageUrls.length === 0) {
      throw `No valid image URLs found for "${query}".`;
    }

    // Pick one image at random
    const chosenImage = conn.pickRandom(imageUrls);

    // Send the image
    await conn.sendFile(m.chat, chosenImage, "image.jpg", "", m);
  } catch (error) {
    // Handle any errors
    await conn.reply(m.chat, `An error occurred: ${error.message || error}`, m);
  }
};

handler.help = handler.command = ["bts", "exo", "husbu", "loli"];
handler.tags = ["imagerandom"];
handler.limit = true;

module.exports = handler;
