async function handler(m) {
  // Ensure the user replied to a message
  if (!m.quoted) throw "❗ Please reply to a message!";

  // Serialize the quoted message
  let q = this.serializeM(await m.getQuotedObj());

  // Ensure that the quoted message itself contains a reply
  if (!q.quoted)
    throw "❗ The message you replied to does not contain a nested reply!";

  // Copy and forward the nested quoted message
  await q.quoted.copyNForward(m.chat, true);
}

handler.command = /^q$/i;
module.exports = handler;
