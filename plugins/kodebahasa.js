const handler = async (m, { usedPrefix, command }) => {
  const languages = [
    { code: "af", name: "Afrikaans" },
    { code: "sq", name: "Albanian" },
    { code: "ar", name: "Arabic" },
    { code: "hy", name: "Armenian" },
    { code: "ca", name: "Catalan" },
    { code: "zh", name: "Chinese" },
    { code: "zh-cn", name: "Chinese (Mandarin/China)" },
    { code: "zh-tw", name: "Chinese (Mandarin/Taiwan)" },
    { code: "zh-yue", name: "Chinese (Cantonese)" },
    { code: "hr", name: "Croatian" },
    { code: "cs", name: "Czech" },
    { code: "da", name: "Danish" },
    { code: "nl", name: "Dutch" },
    { code: "en", name: "English" },
    { code: "en-au", name: "English (Australia)" },
    { code: "en-uk", name: "English (UK)" },
    { code: "en-us", name: "English (US)" },
    { code: "eo", name: "Esperanto" },
    { code: "fi", name: "Finnish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "el", name: "Greek" },
    { code: "ht", name: "Haitian Creole" },
    { code: "hi", name: "Hindi" },
    { code: "hu", name: "Hungarian" },
    { code: "is", name: "Icelandic" },
    { code: "id", name: "Indonesian" },
    { code: "it", name: "Italian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "la", name: "Latin" },
    { code: "lv", name: "Latvian" },
    { code: "mk", name: "Macedonian" },
    { code: "no", name: "Norwegian" },
    { code: "pl", name: "Polish" },
    { code: "pt", name: "Portuguese" },
    { code: "pt-br", name: "Portuguese (Brazil)" },
    { code: "ro", name: "Romanian" },
    { code: "ru", name: "Russian" },
    { code: "sr", name: "Serbian" },
    { code: "sk", name: "Slovak" },
    { code: "es", name: "Spanish" },
    { code: "es-es", name: "Spanish (Spain)" },
    { code: "es-us", name: "Spanish (US)" },
    { code: "sw", name: "Swahili" },
    { code: "sv", name: "Swedish" },
    { code: "ta", name: "Tamil" },
    { code: "th", name: "Thai" },
    { code: "tr", name: "Turkish" },
    { code: "vi", name: "Vietnamese" },
    { code: "cy", name: "Welsh" },
  ];

  let message =
    `🌐 *Google Language Codes*\n\n` +
    `Use these codes for translation services:\n\n` +
    languages
      .map((lang) => `• ${lang.code.padEnd(8)} : ${lang.name}`)
      .join("\n") +
    `\n\nExample: ${usedPrefix}translate en-es Hello`;

  await m.reply(message);
};

handler.help = ["langcodes", "languagecodes"];
handler.tags = ["tools", "translation"];
handler.command = /^(lang(?:uage)?codes|kodebahasa)$/i;

module.exports = handler;
