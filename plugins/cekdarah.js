const fetch = require("node-fetch");

const translateResult = async (result) => {
  const fromLang = "en";
  const toLang = "id";
  const url = `https://tr.deployers.repl.co/translate?from=${fromLang}&to=${toLang}&text=${encodeURIComponent(
    result
  )}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.translated_text;
  } catch (e) {
    console.error(e);
    throw "⚠️ Error while translating the result.";
  }
};

const handler = async (m, { conn, args }) => {
  if (args.length < 1) {
    throw "⚠️ Please enter your blood pressure and hemoglobin in the format:\n\n.cekdarah blood_pressure|hb";
  }

  const [tensi, hb] = args[0].split("|");
  const url = `https://tr.deployers.repl.co/bp?tensi=${tensi}&hb=${hb}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const author = data.Author;
    const hasil = data.Hasil;
    const hbValue = data.Hb;
    const tensiValue = data.Tensi;
    const parameter = data.parameter;

    const translatedResult = await translateResult(hasil);

    const yourNumber = "YOUR-NUMBER-HERE"; // <- Replace with your actual donation number

    const caption = `
*🩸 Blood Check Result 🩸*

👤 Author: ${author}

📋 Result: _${hasil}_
🌎 Translation: *${translatedResult}*

🧪 Hb Level: ${hbValue}
🩺 Blood Pressure: ${tensiValue}

📈 Parameter: ${parameter}

---

☕ Support us:
- Donate: https://tr.deployers.repl.co/images
- Dana: ${yourNumber}
        `.trim();

    conn.reply(m.chat, caption, m);
  } catch (e) {
    console.error(e);
    throw "⚠️ Error while retrieving data from server.";
  }
};

handler.help = ["cekdarah <blood_pressure>|<hb>"];
handler.tags = ["tools"];
handler.command = /^cekdarah$/i;

module.exports = handler;
