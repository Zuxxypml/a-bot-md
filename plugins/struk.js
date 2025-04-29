const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

const handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply(
      "Invalid format!\n" +
        "Use: .receipt store|transaction_id|admin_fee|destination_number|item1-price1,item2-price2,...\n\n" +
        "*Example:* .receipt Abella|1635182|4500|3|Rinso-4000,Royco-2000"
    );
  }

  let [store, transactionId, adminFee, destinationNumber, items] =
    text.split("|");
  if (!store || !transactionId || !adminFee || !destinationNumber || !items) {
    return m.reply("*Incomplete format!*");
  }

  let itemList = items.split(",").map((item, idx) => {
    let [name, price] = item.split("-");
    return { no: idx + 1, name, price };
  });

  const canvasWidth = 400;
  const canvasHeight = 500 + itemList.length * 30;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Store name header
  ctx.fillStyle = "#000";
  ctx.font = "bold 20px monospace";
  ctx.textAlign = "center";
  ctx.fillText(store.toUpperCase(), canvasWidth / 2, 40);

  // Date/time
  ctx.font = "14px monospace";
  ctx.fillText(new Date().toLocaleString("en-US"), canvasWidth / 2, 65);

  // Transaction details
  ctx.textAlign = "left";
  ctx.fillText(`Transaction ID: ${transactionId}`, 20, 100);
  ctx.fillText(`To: ${destinationNumber}`, 20, 125);

  // Separator
  ctx.beginPath();
  ctx.moveTo(20, 150);
  ctx.lineTo(canvasWidth - 20, 150);
  ctx.stroke();

  // Item lines
  let startY = 175;
  itemList.forEach((item, i) => {
    ctx.fillText(
      `${item.no}. ${item.name} - $${parseInt(item.price).toLocaleString()}`,
      20,
      startY + i * 30
    );
  });

  // Separator before totals
  let lastItemY = startY + itemList.length * 30 + 10;
  ctx.beginPath();
  ctx.moveTo(20, lastItemY);
  ctx.lineTo(canvasWidth - 20, lastItemY);
  ctx.stroke();

  // Calculate totals
  let totalItems = itemList.reduce(
    (sum, item) => sum + parseInt(item.price),
    0
  );
  let grandTotal = totalItems + parseInt(adminFee);

  ctx.fillText(
    `Items Total: $${totalItems.toLocaleString()}`,
    20,
    lastItemY + 25
  );
  ctx.fillText(
    `Admin Fee: $${parseInt(adminFee).toLocaleString()}`,
    20,
    lastItemY + 50
  );
  ctx.fillText(
    `Grand Total: $${grandTotal.toLocaleString()}`,
    20,
    lastItemY + 75
  );

  // Footer
  ctx.font = "bold 14px monospace";
  ctx.textAlign = "center";
  ctx.fillText("THANK YOU FOR SHOPPING AT", canvasWidth / 2, lastItemY + 120);
  ctx.fillText(store.toUpperCase(), canvasWidth / 2, lastItemY + 140);

  // Save to temporary file
  const buffer = canvas.toBuffer("image/png");
  const filePath = path.join(__dirname, "../tmp/receipt.png");
  fs.writeFileSync(filePath, buffer);

  // Send the receipt image
  await conn.sendMessage(
    m.chat,
    { image: { url: filePath }, caption: "🧾 *Receipt*" },
    { quoted: m }
  );

  // Clean up
  fs.unlinkSync(filePath);
};

handler.help = ["receipt <store|txn_id|admin_fee|to_number|item-price,...>"];
handler.tags = ["tools"];
handler.command = /^(receipt)$/i;

module.exports = handler;
