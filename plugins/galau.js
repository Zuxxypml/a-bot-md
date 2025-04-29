const fs = require("fs");

let handler = async (m, { conn }) => {
  conn.reply(m.chat, `“${pickSadQuote()}”`, m);
  conn.sendFile(m.chat, "./src/vn/galau.mp3", "sad_voice.opus", null, m, true);
};

handler.help = ["sadquote"];
handler.tags = ["quotes"];
handler.command = /^(sadquote|galau)$/i;

module.exports = handler;

// Random pick function
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Sad quotes function
function pickSadQuote() {
  return pickRandom([
    "You can't force someone to prioritize you. Needs are different from wants.",
    "It felt like yesterday you cared. Now you don't even ask how I am.",
    "What's the point of us being close yesterday if today we are strangers?",
    "Ending doesn't mean I didn't fight. I just refused to keep hurting.",
    "You gave promises, but forgot the heart you hurt.",
    "It's not easy forgetting someone you imagined your future with.",
    "Stay happy, even if you're no longer a chapter in my life.",
    "Sorry, I wasn't strong enough to hold on anymore.",
    "He plays around. You love sincerely. Life's unfair sometimes.",
    "Crying silently isn't weakness, it's survival.",
    "Your smile was my favorite. Your lies were my downfall.",
    "Thanks for teaching me that not everyone who promises stays.",
    "Sometimes loving you was like loving someone who was never mine.",
    "Some lessons come wrapped in heartbreak.",
    "I fought battles you never even knew about, for us.",
    "You left like I was nothing after making me feel like everything.",
    "The one who truly cares stays without needing to be asked.",
    "They say time heals. Why does it still hurt?",
    "Maybe I was too much, or maybe you were too little.",
    "Funny how someone can break your heart, yet you still love them.",
    "I hope the next person you love won't be left wondering.",
    "You are still my favorite 'what if'.",
    "Some wounds heal, but the scars still whisper.",
    "If I mattered, you wouldn't have left so easily.",
    "Goodbye isn't the hardest part. It's the memories that stay.",
    "Being alone hurts less than being with someone who makes you feel alone.",
    "They only notice when you're gone, not when you needed them most.",
    "I loved you silently, maybe that's why you didn't hear.",
    "The saddest goodbyes are the ones that are never said.",
    "Maybe someday you'll understand what you lost.",
    "Sometimes we have to give up, not because we don't care, but because they don't.",
    "Trying to forget someone you love is like trying to remember someone you never met.",
    "A broken heart still beats, just slower and sadder.",
    "Not all scars are visible. Some are in the heart.",
    "Love can heal, but it can also destroy.",
    "One day you'll realize I was rare, and you let me go.",
    "You were my home and my hurricane.",
    "Ghosts don't haunt me. Memories of you do.",
    "It's not the goodbye that hurts. It's the flashbacks that follow.",
    "Maybe we were meant to meet, but not meant to stay.",
    "Better lonely than losing myself loving the wrong person.",
    "Smiling outside, crumbling inside. That's strength.",
    "And when they ask, I'll say I'm fine — even if I'm dying inside.",
    "Having history doesn't mean having a future.",
    "Missing you is like breathing — automatic but painful.",
    "Being ignored is worse than being hated.",
    "Maybe in another lifetime, we'd get it right.",
    "Thank you for teaching me how to survive heartbreak.",
    "I gave you my heart, you played with it like a toy.",
    "Some hearts are too tired to fall in love again.",
    "Broken, but still beating.",
    "Love without trust is just pain in disguise.",
    "Some days, pretending is the only survival.",
    "Smile. Even if it hurts. Even if it's fake.",
    "One day you’ll miss my annoying texts and stubborn love.",
    "Trust is like paper. Once crumpled, it can’t be perfect again.",
    "Don't ask me why I changed. Ask yourself what you did.",
    "One apology can't fix a broken soul.",
    "Forgiving is easy. Forgetting is not.",
    "You taught me pain I never knew existed.",
    "Better to be alone than to be lied to again.",
    "You can miss someone who was never yours.",
    "You promised forever but gave up in seconds.",
    "Sadness feels permanent when your soul still loves.",
    "My mistake was believing you meant forever.",
    "Not all battles are fought on the battlefield. Some happen in the heart.",
    "Would you cry if you knew how much it hurt when you left?",
    "The saddest tears are the silent ones.",
    "Proud of myself for surviving what should've destroyed me.",
    "Healing is messy. It takes time. It's okay.",
    "Heartbreak builds stronger souls.",
    "If I'm silent, it’s because I’m tired of explaining my pain.",
    "Hope is dangerous when you love someone who doesn't love you back.",
    "I loved you with all I had. You loved me when it was convenient.",
    "You don’t realize you hurt me because you never cared.",
    "Loving you broke me. Leaving you saved me.",
    "You were the storm I kept running back into.",
    "If only loyalty was enough for love.",
    "Fake smiles hide the deepest scars.",
    "You lost me when you treated me like I was replaceable.",
    "I'm not mad you left. I'm mad you made me love you first.",
    "Maybe my heart is tired because my soul gave too much.",
    "Trust dies faster than love grows.",
    "Missing you is my mind’s way of punishing my heart.",
    "Some people are lessons. Not soulmates.",
    "At least now I know what love is not.",
    "One day, you’ll wish you had stayed.",
    "Pain changes people. Sometimes for the better.",
    "I'm not bitter. I'm broken — and healing.",
    "Love carefully. Not everyone values a genuine heart.",
    "If loving you was a mistake, it’s the only mistake I'd repeat.",
  ]);
}
