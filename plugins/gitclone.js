const fetch = require("node-fetch");
const githubRegex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;

const handler = async (m, { args, usedPrefix, command }) => {
  // Validate input
  if (!args[0]) {
    const example = `${usedPrefix}gitclone https://github.com/username/repository`;
    return m.reply(
      `Please provide a GitHub repository URL!\nExample: *${example}*`
    );
  }

  // Check URL format
  if (!githubRegex.test(args[0])) {
    return m.reply(
      "⚠️ Invalid GitHub URL format!\nPlease use: https://github.com/username/repository"
    );
  }

  try {
    // Extract user and repo from URL
    const [, user, repo] = args[0].match(githubRegex);
    const cleanRepo = repo.replace(/.git$/, "");
    const apiUrl = `https://api.github.com/repos/${user}/${cleanRepo}/zipball`;

    // Show wait message
    const waitMsg = await m.reply(
      "⏳ Downloading repository... Please wait..."
    );

    // Get file info
    const headResponse = await fetch(apiUrl, { method: "HEAD" });

    if (!headResponse.ok) {
      throw new Error(`GitHub API responded with ${headResponse.status}`);
    }

    const contentDisposition = headResponse.headers.get("content-disposition");
    if (!contentDisposition) {
      throw new Error("Could not get download information from GitHub");
    }

    // Extract filename and clean it up
    let filename = contentDisposition.match(/attachment; filename=(.*)/)[1];
    filename = filename.replace(/(\.zip)+$/, ".zip"); // Ensure single .zip extension

    // Send the file
    await conn.sendMessage(
      m.chat,
      {
        document: {
          url: apiUrl,
          mimetype: "application/zip",
          fileName: filename,
        },
        caption: `📦 Repository: ${user}/${cleanRepo}\n🔗 Source: ${args[0]}`,
      },
      { quoted: m }
    );

    // Delete wait message
    await conn.sendMessage(m.chat, { delete: waitMsg.key });
  } catch (error) {
    console.error("GitHub Clone Error:", error);

    let errorMessage = "Failed to download repository. ";
    if (error.message.includes("API rate limit exceeded")) {
      errorMessage += "GitHub API rate limit exceeded. Try again later.";
    } else if (error.message.includes("Not Found")) {
      errorMessage += "Repository not found or private.";
    } else {
      errorMessage += "Please check the URL and try again.";
    }

    m.reply(errorMessage);
  }
};

// Command configuration
handler.help = ["gitclone <url> - Download a GitHub repository"];
handler.tags = ["github", "tools"];
handler.command = /^gitclone$/i;
handler.limit = true;

module.exports = handler;
