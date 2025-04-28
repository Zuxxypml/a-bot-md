let handler = async (m, { conn, isROwner, text }) => {
  const delay = (time) => new Promise((res) => setTimeout(res, time));
  let getGroups = await conn.groupFetchAllParticipating();
  let groups = Object.entries(getGroups).map((entry) => entry[1]);
  let groupIds = groups.map((v) => v.id);

  let pesan = m.quoted && m.quoted.text ? m.quoted.text : text;
  if (!pesan) throw "Where is the broadcast text?";

  m.reply(
    `📢 Sending Broadcast to ${groupIds.length} Groups...\nEstimated Time: ${
      groupIds.length * 0.5
    } seconds`
  );

  for (let id of groupIds) {
    await delay(500); // 0.5 second per group (safe delay)
    conn
      .relayMessage(
        id,
        {
          extendedTextMessage: {
            text: pesan,
            contextInfo: {
              externalAdReply: {
                title: wm,
                mediaType: 1,
                previewType: 0,
                renderLargerThumbnail: true,
                thumbnailUrl:
                  "https://telegra.ph/file/aa76cce9a61dc6f91f55a.jpg",
                sourceUrl: "",
              },
            },
            mentions: [m.sender],
          },
        },
        {}
      )
      .catch((_) => _); // skip errors silently
  }

  m.reply(`✅ Successfully sent broadcast to ${groupIds.length} Groups.`);
};

handler.help = ["bcgcbot <text>"];
handler.tags = ["owner"];
handler.command = /^((broadcastgc|bcgc)bot)$/i;
handler.owner = true;

module.exports = handler;
