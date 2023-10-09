/*
* Information
* Creator / Developer: Dani Ramdani (Dani Techno.) - FullStack Engineer
* Contact creator / developer: 0882 9633 9447 (WhatsApp), contact@danitechno.com (Email)
*/

/* Thanks
* Dani Techno. - FullStack Engineer (Creator / Developer)
* daniapi.my.id / api.danitechno.com (API provider)
* @danitech/scraper (Scraper provider)
* @whiskeysockets/baileys (Library "Baileys" provider)
* @adiwajshing/keyed-db
* @hapi/boom
* pino
* qrcode-terminal
* chalk
* mongoose
* node-cron
* nodemon
*/

exports.sendText = async (sock, jid, text, quoted) => {
  const main = await sock.sendMessage(jid, { text: text }, { quoted: quoted });
  return main;
};

exports.sendImage = async (sock, jid, url, caption, quoted) => {
  const main = await sock.sendMessage(jid, { images: { url: url }, caption: caption }, { quoted: quoted });
  return main;
};

exports.sendVideo = async (sock, jid, url, caption, quoted) => {
  const main = await sock.sendMessage(jid, { video: { url: url }, caption: caption, mimetype: 'video/mp4' }, { quoted: quoted });
  return main;
};

exports.sendAudio = async (sock, jid, url, quoted) => {
  const main = await sock.sendMessage(jid, { audio: { url: url }, mimetype: 'audio/mp4', ptt: false }, { quoted: quoted });
  return main;
};

exports.sendVn = async (sock, jid, url, quoted) => {
  const main = await sock.sendMessage(jid, { audio: { url: url }, mimetype: 'audio/mp4', ptt: true }, { quoted: quoted });
  return main;
};

exports.sendDocument = async (sock, jid, url, fileName, caption, quoted) => {
  let mimetype;

  const fileExtension = fileName.split('.').pop().toLowerCase();
  switch (fileExtension) {
    case 'apk':
      mimetype = 'application/apk';
      break;
    case 'xapk':
      mimetype = 'application/xapk';
      break;
    case 'zip':
      mimetype = 'application/zip';
      break;
    case '7z':
      mimetype = 'application/7z';
      break;
    case 'tar':
      mimetype = 'application/x-tar';
      break;
    case 'gz':
      mimetype = 'application/gzip';
      break;
    case 'pdf':
      mimetype = 'application/pdf';
      break;
    case 'doc':
      mimetype = 'application/msword';
      break;
    case 'docx':
      mimetype = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      break;
    case 'xls':
      mimetype = 'application/vnd.ms-excel';
      break;
    case 'xlsx':
      mimetype = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      break;
    default:
      mimetype = 'application/octet-stream';
  }

  const message = {
    document: { url: url, fileName: fileName },
    caption: caption,
    mimetype: mimetype
  };

  const main = await sock.sendMessage(jid, message, { quoted: quoted });
  return main;
};