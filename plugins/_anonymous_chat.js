let handler = (m) => m;

handler.before = async function (m, { conn, match }) {
  // If the match exists, do nothing
  // if (match) return !1

  // Only process private chats (not groups)
  if (!m.chat.endsWith("@s.whatsapp.net")) return true;

  // Initialize anonymous sessions if not already present
  this.anonymous = this.anonymous
    ? this.anonymous
    : db.data.sessions[this.user.jid].anonymous;

  // Find the room where the sender is chatting
  let room = Object.values(this.anonymous).find(
    (room) => [room.a, room.b].includes(m.sender) && room.state === "CHATTING"
  );

  if (room) {
    // Find the other participant
    let other = [room.a, room.b].find((user) => user !== m.sender);

    // Forward the message to the other participant
    m.copyNForward(
      other,
      true,
      m.quoted && m.quoted.fromMe
        ? {
            contextInfo: {
              ...m.msg.contextInfo,
              forwardingScore: 1,
              isForwarded: true,
              participant: other,
            },
          }
        : {}
    );

    // Save updated session
    db.data.sessions[this.user.jid].anonymous = this.anonymous;
  }

  return true;
};

module.exports = handler;
