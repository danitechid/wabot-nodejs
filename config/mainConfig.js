/*
* Information
* Creator / Developer: Dani Ramdani (Dani Techno.) - FullStack Engineer
* Contact creator / developer: 0882 9633 9447 (WhatsApp), contact@danitechno.com (Email)
* Note: Mau beli script no enc? silahkan hubungi developer via WhatsApp/Email
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

module.exports = {
  session_folder_name: '.session',
  prefix: '.',
  image_url: 'https://telegra.ph/file/f0fa86144d97805672ec9.jpg',
  audio_url: 'https://cdn.danitechno.com/audio/dj-joanna-breakbeat.mp3',
  public_mode: true,
  auto_read: true,
  mongodb_uri: 'Your_MongoDb_URI', // Register here: https://mongodb.com/#sign-up
  api: {
    url: 'https://api.danitechno.com',
    key: 'Your_API_key' // Register here: https://daniapi.my.id/#sign-up
  },
  bot: {
    name: 'Bot Name'
  },
  owner: {
    name: ["Owner Name"],
    number: ["628xxxx"]
  },
  daily_limit: {
    free: 100,
    premium: Infinity
  },
  react: {
    process: '⏳',
    success: '✅',
    failed: '❌'
  },
  cron_jobs: {
    time: '0 0 * * *',
    timzone: 'Asia/Jakarta'
  }
}