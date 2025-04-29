let handler = async (m, { conn, isOwner, mentionedJid }) => {
  // Get the target user (mentioned user or sender)
  const targetUser = mentionedJid?.[0] || m.sender;
  const isTargetOwner = isOwner && targetUser === m.sender;

  // Generate IQ score with realistic distribution
  const generateIQScore = () => {
    // Base score (50-150 normal range)
    let score = Math.floor(Math.random() * 101) + 50;

    // 5% chance for genius (>140)
    if (Math.random() < 0.05) score += Math.floor(Math.random() * 60) + 40;
    // 5% chance for below average (<70)
    else if (Math.random() < 0.05) score -= Math.floor(Math.random() * 30) + 30;

    return Math.max(40, Math.min(200, score)); // Keep within 40-200 range
  };

  // Prepare the result message
  let result;
  if (isTargetOwner) {
    result = `🧠 *IQ Test Result*: \n@${
      targetUser.split("@")[0]
    } has UNLIMITED IQ! (Owner Privilege)`;
  } else {
    const score = generateIQScore();
    let assessment = "";

    if (score >= 140) assessment = "Genius! 🤯";
    else if (score >= 120) assessment = "Highly Intelligent! 🧠✨";
    else if (score >= 110) assessment = "Above Average! 👍";
    else if (score >= 90) assessment = "Average Intelligence 😐";
    else if (score >= 70) assessment = "Below Average 🤔";
    else assessment = "...interesting result 🤨";

    result = `🧠 *IQ Test Result*: \n@${
      targetUser.split("@")[0]
    } scored ${score} (${assessment})`;
  }

  // Send the result with mention
  await conn.sendMessage(
    m.chat,
    {
      text: result,
      mentions: [targetUser],
    },
    { quoted: m }
  );
};

handler.help = ["iqtest @user"];
handler.tags = ["fun", "game"];
handler.command = /^(iqtest|intelligence)$/i;

module.exports = handler;
