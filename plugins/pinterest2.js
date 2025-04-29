const axios = require("axios");
const https = require("https");
const {
  default: makeWASocket,
  proto,
  generateWAMessageFromContent,
  generateWAMessageContent,
} = require("@adiwajshing/baileys");

let handler = async (m, { conn, command, text }) => {
  if (!text)
    return conn.reply(m.chat, "What image do you want to search for?", m);

  await conn.reply(m.chat, "Hold on, fetching Pinterest images for you...", m);

  let botName = "Elaina-MD";
  let results = await pinterest(text);
  let images = results.map((res) => res.image);
  let limited = images.slice(0, Math.min(4, images.length));
  let i = 1;
  let cards = [];

  for (let url of limited) {
    cards.push({
      body: proto.Message.InteractiveMessage.Body.fromObject({
        text: `Image #${i++}`,
      }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({
        text: nameowner,
      }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        title: "</> Pinterest </>",
        hasMediaAttachment: true,
        imageMessage: await createImage(url, conn),
      }),
      nativeFlowMessage:
        proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          buttons: [
            {
              name: "cta_url",
              buttonParamsJson: JSON.stringify({
                display_text: "View Source",
                url: `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(
                  text
                )}`,
                merchant_url: `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(
                  text
                )}`,
              }),
            },
          ],
        }),
    });
  }

  const message = generateWAMessageFromContent(
    m.chat,
    {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
          },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: { text: null },
            footer: { text: botName },
            header: { hasMediaAttachment: false },
            carouselMessage: { cards },
          }),
        },
      },
    },
    {}
  );

  await conn.relayMessage(m.chat, message.message, {
    messageId: message.key.id,
  });
};

handler.help = ["pinterest2 <keyword>"];
handler.tags = ["downloader"];
handler.command = /^(pinterest2|pin2)$/i;
handler.limit = true;
handler.register = true;

module.exports = handler;

async function createImage(url, conn) {
  const { imageMessage } = await generateWAMessageContent(
    {
      image: { url },
    },
    { upload: conn.waUploadToServer }
  );
  return imageMessage;
}

const agent = new https.Agent({
  rejectUnauthorized: true,
  maxVersion: "TLSv1.3",
  minVersion: "TLSv1.2",
});

async function getCookies() {
  try {
    const response = await axios.get("https://www.pinterest.com/csrf_error/", {
      httpsAgent: agent,
    });
    const setCookieHeaders = response.headers["set-cookie"];
    if (setCookieHeaders) {
      return setCookieHeaders.map((cookie) => cookie.split(";")[0]).join("; ");
    }
    return null;
  } catch {
    return null;
  }
}

async function pinterest(query) {
  try {
    const cookies = await getCookies();
    if (!cookies) return [];

    const url = "https://www.pinterest.com/resource/BaseSearchResource/get/";
    const params = {
      source_url: `/search/pins/?q=${query}`,
      data: JSON.stringify({
        options: {
          isPrefetch: false,
          query,
          scope: "pins",
          no_fetch_context_on_resource: false,
        },
        context: {},
      }),
      _: Date.now(),
    };

    const headers = {
      accept: "application/json",
      cookie: cookies,
      referer: "https://www.pinterest.com/",
      "user-agent": "Mozilla/5.0",
      "x-requested-with": "XMLHttpRequest",
    };

    const { data } = await axios.get(url, {
      httpsAgent: agent,
      headers,
      params,
    });
    return data.resource_response.data.results
      .filter((v) => v.images?.orig)
      .map((result) => ({
        image: result.images.orig.url,
      }));
  } catch {
    return [];
  }
}
