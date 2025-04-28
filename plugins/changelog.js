let handler = async (m, { conn, usedPrefix: p }) => {
  let teks = `  
  *Changes on December 29, 2021:*
_*New:*_
Leaderboard:
leaderboardgroup
topskata
topskatagroup
topcmd

_*Update:*_
Leaderboard anti-tag
Claim leveling

_*Fix:*_
skata
semoji
Doubling game
Absence without tag

  *Changes on November 19, 2021:*
_*New:*_
Image: PPCouple
Game: Word chain

_*Update:*_
Jadibot: Set Owner, Settings
Group: Initialize on every chat

_*Fix:*_
Download: Facebook

_*Deleted:*_
Download: APK downloader

*Changes on October 22, 2021:*
_*New:*_
Settings: Game

_*Update:*_
Sticker: Trigger tag

_*Fix:*_
layarkaca, animeinfo

*Changes on October 19, 2021:*
_*New:*_
Maker: Custom throne wealth => *${p}customtahta*
Tools: Bible => *${p}alkitab*
      Hadith => *${p}hadis*
      Spam call => *${p}spamcall*
Search: Free Fire ID check => *${p}epep*
        Anime info => *${p}animeinfo*
        Layarkaca => *${p}layarkaca*
Sticker: Dice => *${p}dadu*
Fun: Ancient name => *${p}purba*
Media downloader: Joox Music => *${p}joox*

_*Update:*_
Sticker: Emoji sticker => *${p}semoji*
Register & unregister
Group antilink
Auto-kick for sending group bugs

_*Fix:*_
Fun: Simi chat => *${p}simi*
Game: delttt, suit, bisakah, apakah, kapankah
Search: *${p}tiktokstalk*

*Changes on October 17, 2021:*

_*New:*_
Tools: Postal code => *${p}kodepos*
       Info => *${p}setting*

_*Update:*_
Downloader: TikTok caption, IG caption, server
Maker: Write => *${p}nulis*
Tools: TTS, translation can directly reply to messages => *${p}tts*, *${p}tr*

_*Fix:*_
Game: Chemical guess => *${p}tebakkimia*
      Fixed help

${conn.readmore}
*Changes on October 15, 2021:*

_*Update:*_
Sticker: smeme, snobg, wasted, trigger, etc., can directly reply to stickers

_*Fix:*_
Sticker: attp => *${p}attp*
        ttp => *${p}ttp*
Game: Riddle => *${p}tekateki*

*Changes on October 6, 2021:*

_*Fix:*_
Sticker: wasted, trigger => *${p}wasted, ${p}trigger*

*Changes on September 28, 2021:*

_*New:*_
Game: Suit PvP => *${p}suit*
Buttons in games, absence
Menu style

_*Fix:*_
Quotes: Wise => *${p}bijak*
Maker: Japan => *${p}japan*
Sticker: Meme => *${p}smeme*
Optimized text for each feature
Cleaned up menu

*Changes on July 22, 2021:*
● Added voice notes to some features
● Updated *${p}enable*
● Fixed bug in level-up & role
● Fixed some bugs

*Changes on July 18, 2021:*
● Fixed *${p}pinterest*

*Changes on July 16, 2021:*
● In *${p}Menu Game*
  => New *${p}tekateki*
     Fixed *${p}tebaklagu*
● Maximum 3 calls
● Updated *${p}enable*

*Changes on July 14, 2021:*
● Added *${p}Menu Class*
  => Added vote, absence
● Added *${p}wikipedia*
● Added *${p}kbbi*
● Added *${p}scan*

*Changes on July 8, 2021:*
● Added Role in profile (beta)
● Added level limit
● Added *${p}role*
● Added *${p}groupinfo*
● Added *${p}togif*
● Added *${p}toimg2*
● Added *${p}stickerline*
● Updated GIF in *${p}sticker*
● Added some features in owner menu

*Changes on July 5, 2021:*
● Fixed welcome: send photo
● Fixed *${p}igstory*
● Changed, updated => *${p}daftarulang*
  Can change name :v

● Updated auto *${p}steal*
● Added *${p}menu editor*
● Added *${p}menu storage*
● In Premium => Auto steal in sticker (get name)

*Changes on July 4, 2021:*
● Updated *${p}stickerwa*

*Changes on July 3, 2021:*
● Added in group *${p}setpp*
● Updated pricing for *${p}sewabot/premium*
● Updated *${p}ytmp4*
● Fixed *${p}bctime*

*Changes on July 2, 2021:*
● In Menu game =>
  Added *${p}tebakkimia*
  Added *${p}tebakanime*

*Changes on July 1, 2021:*
● Updated *${p}ytmp4* =>
 Custom resolution
● Updated Welcome
● Restored *${p}menu owner*
● *${p}setcmd* only for Premium
● Fixed *${p}play*

*Changes on June 30, 2021:*
● New referral code bot => *${p}ref*
● Added *${p}Revoke* (reset link)
● Added *${p}tomp3*
● Added Group Description in welcome
   *${p}setwelcome*
● Updated YouTube story URL in *${p}yt*
● Updated *${p}semoji*
● Fixed *${p}ttp*
● Fixed *${p}delcmd*
● Fixed *${p}caklontong*
● In Menu game =>
  Added *${p}tebaklirik*
  Moved to group only
● Auto block for call/video call

*Changes on June 16, 2021:*
● New: Commands with media
● Fixed *${p}stickerwa* <search>
● In Menu image => Added
   *${p}bts*
   *${p}exo*
● Fixed *${p}tebakgambar*
● Detailed AFK status
● Custom bot for group admins, can toggle bot on/off (*${p}bot* [on/off])

*Changes on June 13, 2021:*
● Updated Style
● In Menu image => Added
   ${p}waifu
   ${p}husbu
   ${p}loli
   ${p}neko
● Fixed ${p}smeme
● Fixed ${p}wallpaperanime
● Added ${p}ytcomment
● Added ${p}broadcasttime
● Added ${p}rules

*Changes on June 5, 2021:*
● Added New Games
  ${p}asahotak
  ${p}tebakkata
  ${p}susunkata
  (${p}menu game)
● Feature ${p}join can now join directly without owner confirmation (for premium users)
● Increased ${p}claim amount for premium users

*Changes on May 26, 2021:*
● Added ${p}save name
● Fixed Anonymous Chat

*Changes on May 21, 2021:*
● Added ${p}anony chat (check in menu)
● Added ${p}setbotpp (owner/jadibot)
● Added ${p}listpremium
● Added ${p}getsider (group)
● Added ${p}upload
● Added XP for winning (Tictactoe game)
● Custom Tictactoe room
● Added & optimized ${p}ping
● Attempted fix for ${p}tiktok, ig
● Other

*Changes on May 16, 2021:*
● Added game ${p}tictactoe
● Optimized ${p}translate
● Added maker ${p}shaunthesheep

*Changes on May 11, 2021:*
● Added & Updated ${p}attp, ttp, ttp2-ttp6
● Added game ${p}caklontong
● Added game ${p}siapaaku
● Added feature ${p}request
● Fixed ${p}enable welcome, setwelcome, setbye
● Fixed ${p}play & some errors
● Updated ${p}inspect
● Optimized ${p}jadibot

*Changes on May 10, 2021:*
● Fixed ${p}tebakgambar + HD
● Fixed ${p}chord
● Added ${p}info
● Optimized AFK

*Changes on May 5, 2021:*
● Added ${p}tebaklagu (beta)
● Added ${p}tebakjenaka (beta)
● Ytmp4 quality 720p

*Changes on May 3, 2021:*
● Added ${p}trigger
● Added ${p}semoji
● Added ${p}ytsearch
● Added ${p}attp2
● Updated ${p}attp
● Updated welcome, bye group

*Changes on May 1, 2021:*
● Updated feature ${p}lirik
● Added ${p}downloadfilm
● Fixed ${p}enable
● Fixed some errors

*Changes on April 25, 2021:*
● Added feature ${p}ttp3
● Added ${p}enable autolevelup
● Added ${p}inspect linkgroup chat.whatsapp.com
● Added ${p}info
● Added ${p}rules
● Optimized ${p}limit

*Changes on April 22, 2021:*
● Updated ${p}snobg
● Added Feature ${p}tiktokstalk
● Fixed errors in IG, TikTok

*Changes on April 20, 2021:*
● Updated & optimized Menu
● Added Feature ${p}wait
  Search anime title based on image
● Added alternative ${p}ig2

*Changes on April 17, 2021:*
● Updated feature ${p}getvn

*Changes on April 15, 2021:*
● Updated features ${p}ttp, ${p}ttp2
● Added feature ${p}sgay
● Optimized Menu

*Changes on April 14, 2021:*
● Feature ${p}sc
  Circular sticker
● Feature ${p}tovideo
  GIF sticker to video

*Changes on April 12, 2021:*
● Feature ${p}translate

*Changes on April 11, 2021:*
● Feature ${p}meme (improved)
● Feature ${p}darkjoke
● Feature ${p}twitter
● Feature ${p}cuaca

*Changes on April 10, 2021:*
● Feature ${p}chord
● Feature ${p}wiki
● Feature ${p}ramaljodoh
● Feature ${p}Jadwalsholat
● Feature ${p}quotes
● TikTok without watermark (${p}tiktok)
● Anime download (${p}anime)
`.trim();
  conn.fakeReply(
    m.chat,
    teks,
    "0@s.whatsapp.net",
    "*Changes/Changelog/Update Levi BOT*",
    "status@broadcast"
  );
};

handler.command = /^baru$/i;

module.exports = handler;
