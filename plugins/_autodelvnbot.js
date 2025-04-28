module.exports = {
  async all(m) {
    let chat = global.db.data.chats[m.chat];

    // If autodelete voice notes is active in this chat
    if (
      chat.autodelvn &&
      !m.fromMe &&
      m.isBaileys &&
      m.mtype === "audioMessage" &&
      m.msg.ptt &&
      m.quoted
    ) {
      // Attempt to reply with a dummy delete message
      let { key } = await m
        .reply(".delete", null, {
          messageId: "3EB0" + require("crypto").randomBytes(12).toString("hex"),
        })
        .catch((_) => {});

      // If successfully created, immediately delete that message
      if (key) this.sendMessage(m.chat, { delete: key });
    }
  },
};
