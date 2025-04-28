const fs = require("fs");
const { exec } = require("child_process");
const cp = require("child_process");
const { promisify } = require("util");

let exec_ = promisify(exec).bind(cp);

let handler = async (m, { conn, isROwner }) => {
  try {
    let zipFileName = `BackupScript.zip`;

    m.reply("Starting backup process. Please wait...");

    setTimeout(() => {
      if (fs.existsSync("node_modules")) {
        m.reply("Note: 'node_modules' folder is excluded from the backup.");
      }

      const file = fs.readFileSync("./BackupScript.zip");
      conn.sendMessage(
        m.chat,
        {
          document: file,
          mimetype: "application/zip",
          fileName: zipFileName,
          caption: "Backup complete. Please download the backup file.",
        },
        { quoted: m }
      );

      setTimeout(() => {
        fs.unlinkSync(zipFileName);
        m.reply("Temporary backup file has been deleted.");
      }, 5000);
    }, 3000);

    setTimeout(() => {
      let zipCommand = `zip -r ${zipFileName} * -x "node_modules/*"`;
      exec_(zipCommand, (err, stdout) => {
        if (err) console.error("Error while zipping:", err);
      });
    }, 1000);
  } catch (error) {
    m.reply("An error occurred during the backup process.");
    console.error(error);
  }
};

handler.help = ["backupsc"];
handler.tags = ["owner"];
handler.command = ["backupsc"];
handler.owner = true;

module.exports = handler;
