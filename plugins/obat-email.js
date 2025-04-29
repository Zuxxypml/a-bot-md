/*
⚠️ WARNING:
Do not remove the credits.
You’ll be cursed with 20 generations of boils if you do 😈

URL Updated:
Old: tr.deployers.repl.co
New: https://0e87ad76-6c4e-40ff-bb5a-6bbdab145ae2-00-39qk1kw7vab6l.worf.replit.dev
*/

const fetch = require("node-fetch");

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const sender = m.sender.split("@")[0];

  // Handle medicine search
  if (["cariobat", "obat", "sakit", "penyakit"].includes(command)) {
    if (!args[0])
      return conn.reply(
        m.chat,
        `Please enter the name of the medicine you want to search for.\nExample: ${
          usedPrefix + command
        } demam`,
        m
      );

    try {
      const medicineName = args.join(" ");
      const response = await fetch(
        `https://0e87ad76-6c4e-40ff-bb5a-6bbdab145ae2-00-39qk1kw7vab6l.worf.replit.dev/cariobat?obat=${encodeURIComponent(
          medicineName
        )}`
      );

      if (response.ok) {
        await conn.reply(
          m.chat,
          "Searching for medicine info, please wait...",
          m
        );
      } else {
        return conn.reply(
          m.chat,
          `${response.status} ${response.statusText}`,
          m
        );
      }

      const data = await response.json();

      if (data && Array.isArray(data)) {
        const result = data
          .map(
            (item) =>
              `*Name:* ${item.alt}\n*Price:* ${item.harga}\n*Source:* ${item.sumber}\n*Image:* ${item.fallback_url}\n\n_NOTE: Powered by Xnuvers007 server_`
          )
          .join("\n\n");

        conn.reply(m.chat, result, m);
      } else {
        conn.reply(m.chat, "No medicine data found.", m);
      }
    } catch (error) {
      console.error("Error fetching medicine data:", error);
      conn.reply(
        m.chat,
        "Sorry, an error occurred while searching for the medicine data.",
        m
      );
    }
    await conn.reply(m.chat, "Powered by Xnuvers007 server", m);

    // Handle detailed medicine explanation
  } else if (
    [
      "keteranganobat",
      "penjelasanobat",
      "ktobat",
      "indikasiobat",
      "komposisiobat",
      "dosisobat",
      "ketobat",
    ].includes(command)
  ) {
    if (!args[0])
      return conn.reply(
        m.chat,
        `Please paste the link from the previous medicine search (source link).\nExample: ${
          usedPrefix + command
        } https://www.halodoc.com/obat-dan-vitamin/rebamipide-100-mg-10-tablet`,
        m
      );

    const sourceLink = args[0];
    const response = await fetch(
      `https://0e87ad76-6c4e-40ff-bb5a-6bbdab145ae2-00-39qk1kw7vab6l.worf.replit.dev/keterangan?obat=${encodeURIComponent(
        sourceLink
      )}`
    );

    if (response.ok) {
      await conn.reply(
        m.chat,
        "Getting detailed information, please wait...",
        m
      );
    } else {
      return conn.reply(m.chat, `${response.status} ${response.statusText}`, m);
    }

    const info = await response.json();

    if (info) {
      const details = `*Usage:* ${info["Aturan Pakai"]}\n\n*Description:* ${info.Deskripsi}\n\n*Dosage:* ${info.Dosis}\n\n*Side Effects:* ${info["Efek Samping"]}\n\n*Product Category:* ${info["Golongan Produk"]}\n\n*Indications:* ${info["Indikasi Umum"]}\n\n*Packaging:* ${info.Kemasan}\n\n*Composition:* ${info.Komposisi}\n\n*Contraindications:* ${info["Kontra Indikasi"]}\n\n*Manufacturer:* ${info.Manufaktur}\n\n*Registration No.:* ${info["No. Registrasi"]}\n\n*Caution:* ${info.Perhatian}\n\n_NOTE: Powered by Xnuvers007 server_`;

      conn.reply(m.chat, details, m);
    } else {
      conn.reply(m.chat, "No explanation data found for this medicine.", m);
    }

    // Handle email leak check
  } else if (
    ["checkdata", "cekimel", "cekemail", "checkemail", "cekdata"].includes(
      command
    )
  ) {
    if (!args[0]) {
      return m.reply(
        `Please provide an email address.\nExample: ${
          usedPrefix + command
        } example@email.com`
      );
    }

    const email = args[0].toLowerCase();
    const apiUrl = `https://0e87ad76-6c4e-40ff-bb5a-6bbdab145ae2-00-39qk1kw7vab6l.worf.replit.dev/checkdata?email=${encodeURIComponent(
      email
    )}`;

    const res = await fetch(apiUrl);
    if (res.status !== 200) {
      return m.reply("Error fetching data. Please try again later.");
    }

    const json = await res.json();
    let output = "";

    if (json.Data?.results?.length > 0) {
      output += `Data Breaches Detected:\n\n`;

      for (const result of json.Data.results) {
        for (const data of result.data) {
          output += `*Title:* ${result.title}\n`;
          output += `*Description:* ${result.description}\n`;
          output += `*Leaked Data:* ${data["Data yang bocor"]}\n`;
          output += `*Date:* ${data["Tanggal Kejadian"]}\n`;
          output += `*Total Leaked:* ${data["Total keseluruhan data yang bocor"]}\n`;
          output += `*Link:* ${result.link}\n\n`;
        }
      }
    } else {
      output += `✅ Your email is secure. No data found on dark web leaks.\n`;
    }

    m.reply("```" + output + "```");
  }
};

handler.help = [
  "cariobat <Medicine Name>",
  "penjelasanobat <Link from cariobat>",
  "cekemail <Email>",
];
handler.tags = ["tools", "health", "security"];
handler.command = /^(cariobat|penjelasanobat|cekemail)$/i;

module.exports = handler;
