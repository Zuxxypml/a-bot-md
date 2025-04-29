const axios = require("axios");

// Configuration
const API_ENDPOINTS = [
  "https://status.pnggilajacn.my.id",
  "https://api-backup.pnggilajacn.my.id", // Optional backup endpoint
];

// Track API visits with retry logic
const apivisit = async function () {
  try {
    const results = await Promise.allSettled(
      API_ENDPOINTS.map((url) =>
        axios.get(url, {
          timeout: 5000, // 5 second timeout
          headers: {
            "User-Agent": "ChandraBot/1.0 (+https://github.com/Chandra-XD)",
          },
        })
      )
    );

    // Log results for monitoring
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        console.log(`✅ Successfully pinged ${API_ENDPOINTS[index]}`);
      } else {
        console.error(
          `❌ Failed to ping ${API_ENDPOINTS[index]}:`,
          result.reason.message
        );
      }
    });

    return {
      success: results.filter((r) => r.status === "fulfilled").length,
      failed: results.filter((r) => r.status === "rejected").length,
    };
  } catch (error) {
    console.error("Error in apivisit:", error);
    throw error;
  }
};

// Add scheduled tracking as a method
apivisit.schedule = function (interval = 30 * 60 * 1000) {
  try {
    // Initial ping
    this();

    // Schedule regular pings
    setInterval(async () => {
      await this();
    }, interval);
  } catch (error) {
    console.error("Error in scheduled apivisit:", error);
  }
};

// Add metadata as properties
apivisit.meta = {
  author: {
    name: "Chandra XD",
    github: "https://github.com/Chandra-XD",
    tiktok: "@pnggilajacn",
  },
  version: "1.0.1",
  description: "API monitoring service for tracking endpoint availability",
};

module.exports = apivisit;
