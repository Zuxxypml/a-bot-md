let handler = async (m, { conn }) => {
  conn.sendFile(
    m.chat,
    "https://telegra.ph/file/60ee2273e7e571239a1ad.jpg",
    "payment.jpg",
    `
╔══「 *Payment Information* 」 
╟
╟ *Amount:* ₦5,000
╟
╟ *GTBank (Guaranty Trust Bank)*  
╟ Account Number: *0457395640*  
╟ Account Name: *Adebisi Basit*
╟
╟ *Opay Wallet*  
╟ Account Number: *9075341378*  
╟ Account Name: *Adebisi Basit*
╟
╚══════════════════════ 

_Once you have made your payment of ₦5,000, please contact the Owner immediately to confirm._

━━━━━━━━━━━━━━━━━━━━
`,
    m
  );
};
handler.command = /^payment$/i;

module.exports = handler;
