const handler = async (m, { conn, usedPrefix, command, text }) => {
  // Available traits to check
  const traits = {
    gay: "🏳️‍🌈 Gay",
    smart: "🧠 Smart",
    beautiful: "🌸 Beautiful",
    handsome: "💎 Handsome",
    bored: "🥱 Bored",
    crazy: "🤪 Crazy",
    lesbian: "🏳️‍🌈 Lesbian",
    stressed: "😫 Stressed",
    simp: "😍 Simp",
    lonely: "😔 Lonely",
    sad: "😢 Sad",
  };

  // Get the trait from command (remove 'check')
  const trait = command.replace(/check/i, "").toLowerCase();
  const traitName = traits[trait] || trait.toUpperCase();

  // Generate random percentage with realistic distribution
  const percentage = Math.floor(Math.random() * 101);
  let rating;

  if (percentage < 20) rating = "Very Low";
  else if (percentage < 40) rating = "Low";
  else if (percentage < 60) rating = "Moderate";
  else if (percentage < 80) rating = "High";
  else rating = "Very High";

  // Create the result message
  const resultMsg =
    `✨ *${traitName} Check* ✨\n\n` +
    `🔮 *Your ${traitName} Level:*\n` +
    `📊 ${percentage}% (${rating})\n\n` +
    `No matter your result,\n` +
    `Always *love yourself* ❤️\n\n` +
    `Try checking other traits:\n` +
    `${Object.keys(traits)
      .map((t) => `• ${usedPrefix}${t}check`)
      .join("\n")}`;

  // Send with cool thumbnail
  await conn.sendFile(
    m.chat,
    "https://telegra.ph/file/1aa347ff346c2bf5ee181.jpg",
    "trait.jpg",
    resultMsg,
    m
  );
};

// Generate help and commands dynamically
const allTraits = [
  "gay",
  "smart",
  "beautiful",
  "handsome",
  "bored",
  "crazy",
  "lesbian",
  "stressed",
  "simp",
  "lonely",
  "sad",
];

handler.help = allTraits.map((v) => v + "check");
handler.tags = ["fun", "game"];
handler.command = new RegExp(`^(${allTraits.join("|")})check$`, "i");

module.exports = handler;
