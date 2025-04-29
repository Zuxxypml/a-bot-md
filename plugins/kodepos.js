const fetch = require("node-fetch");

const handler = async (m, { conn, text, usedPrefix, command }) => {
  // Nigerian state mapping
  const nigerianStates = {
    abia: "AB",
    adamawa: "AD",
    "akwa ibom": "AK",
    anambra: "AN",
    bauchi: "BA",
    bayelsa: "BY",
    benue: "BE",
    borno: "BO",
    "cross river": "CR",
    delta: "DE",
    ebonyi: "EB",
    edo: "ED",
    ekiti: "EK",
    enugu: "EN",
    gombe: "GO",
    imo: "IM",
    jigawa: "JI",
    kaduna: "KD",
    kano: "KN",
    katsina: "KT",
    kebbi: "KE",
    kogi: "KO",
    kwara: "KW",
    lagos: "LA",
    nasarawa: "NA",
    niger: "NI",
    ogun: "OG",
    ondo: "ON",
    osun: "OS",
    oyo: "OY",
    plateau: "PL",
    rivers: "RI",
    sokoto: "SO",
    taraba: "TA",
    yobe: "YO",
    zamfara: "ZA",
    abuja: "FC",
  };

  // If no location specified
  if (!text) {
    const exampleLocations = ["lagos", "abuja", "kano", "port harcourt"];
    const example =
      exampleLocations[Math.floor(Math.random() * exampleLocations.length)];
    return m.reply(
      `📮 *Nigerian Postal Code Finder*\n\n` +
        `Enter a Nigerian state or city\n\n` +
        `Example: *${usedPrefix}${command} ${example}*\n` +
        `Usage: *${usedPrefix}${command} [location]*\n\n` +
        `Supported locations:\n` +
        `${Object.keys(nigerianStates)
          .map((s) => `• ${s.charAt(0).toUpperCase() + s.slice(1)}`)
          .join("\n")}`
    );
  }

  try {
    const location = text.toLowerCase();
    let stateCode = nigerianStates[location];

    if (!stateCode) {
      // Check if input matches a state code
      const matchedState = Object.entries(nigerianStates).find(
        ([name, code]) => code.toLowerCase() === location
      );
      stateCode = matchedState?.[1];
    }

    if (!stateCode) {
      throw `Location "${text}" not found. Please enter a valid Nigerian state or city.`;
    }

    // Mock API response - replace with actual API call
    const mockPostalRanges = {
      LA: "100001-102361", // Lagos
      FC: "900001-900291", // Abuja
      KN: "700001-700281", // Kano
      RI: "500001-500272", // Rivers
      // Add more states as needed
    };

    const postalRange = mockPostalRanges[stateCode] || "Not specified";

    await m.reply(
      `📌 *Postal Information for ${location.toUpperCase()}*\n\n` +
        `State: ${Object.entries(nigerianStates)
          .find(([_, code]) => code === stateCode)[0]
          .toUpperCase()}\n` +
        `State Code: ${stateCode}\n` +
        `Postal Code Range: ${postalRange}\n\n` +
        `ℹ️ Note: Nigerian postal codes are assigned to areas, not streets`
    );
  } catch (error) {
    console.error("Postal code error:", error);
    m.reply(
      `❌ Error: ${error}\n\n` +
        `Please try again with a valid Nigerian location.`
    );
  }
};

handler.help = ["postalcode <state/city>"];
handler.tags = ["tools", "nigeria"];
handler.command = /^(postalcode|zipcode|nigpost)$/i;
handler.limit = true;

module.exports = handler;
