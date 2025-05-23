module.exports = Object.assign(
  async function handler(m, { command }) {
    if (!m.quoted) throw "Reply to a message!";
    if (!m.quoted.fileSha256) throw "SHA256 Hash missing";
    let sticker = global.db.data.sticker;
    let hash = Buffer.from(m.quoted.fileSha256).toString("hex");
    if (!(hash in sticker)) throw "Hash not found in database";
    sticker[hash].locked = !/^un/i.test(command);
    m.reply("Done!");
  },
  {
    rowner: true,
    help: ["un", ""].map((v) => v + "lockcmd"),
    tags: ["cmd"],
    command: /^(un)?lockcmd$/i,
  }
);
