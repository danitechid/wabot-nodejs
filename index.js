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

const config = require('./config/mainConfig.js');
const smsg = require('./utils/smsgUtils.js');

const {
  default: connectToWhatsApp,
  useMultiFileAuthState,
  makeInMemoryStore,
  jidDecode,
  proto,
  getContentType,
  delay,
  DisconnectReason
} = require("@whiskeysockets/baileys");
const {
  Boom
} = require('@hapi/boom');
const pino = require('pino');
const qrCodeTerminal = require('qrcode-terminal');
const chalk = require('chalk');
const fs = require('fs');
const mongoose = require('mongoose');
const cron = require('node-cron');

let db = mongoose.connection;

const userSchema = new mongoose.Schema({
  username: String,
  phoneNumber: String,
  accountType: String,
  dailyLimit: Number,
  isPremium: Boolean,
});

const User = mongoose.model('User', userSchema);

try {
  const store = makeInMemoryStore({
    logger: pino().child({
      level: 'silent',
      stream: 'store'
    })
  });

  async function startServer() {
    mongoose.connect(config.mongodb_uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    process.on('unhandledRejection', (error) => console.error(error.message));

    const {
      state,
      saveCreds
    } = await useMultiFileAuthState(`./${config.session_folder_name}`);
    const sock = connectToWhatsApp({
      logger: pino({
        level: 'silent'
      }),
      printQRInTerminal: true,
      browser: ["WhatsApp Bot", "Chrome", "1.0.0"],
      auth: state
    });
    store.bind(sock.ev);

    sock.ev.on('creds.update', await saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const {
        connection,
        lastDisconnect
      } = update;
      if (connection === 'close') {
        let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
        if (reason === DisconnectReason.badSession) {
          console.log("Bad Session File, Please Delete Session and Scan Again");
          sock.logout();
        } else if (reason === DisconnectReason.connectionClosed || reason === DisconnectReason.connectionLost) {
          console.log("Connection closed or lost, reconnecting...");
          startServer();
        } else if (reason === DisconnectReason.connectionReplaced) {
          console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
          sock.logout();
        } else if (reason === DisconnectReason.loggedOut) {
          console.log("Device Logged Out, Please Scan Again And Run.");
          sock.logout();
        } else if (reason === DisconnectReason.restartRequired || reason === DisconnectReason.timedOut) {
          console.log("Restart Required, Restarting...");
          startServer();
        } else if (reason === DisconnectReason.Multidevicemismatch) {
          console.log("Multi device mismatch, please scan again");
          sock.logout();
        } else {
          sock.end(`Unknown DisconnectReason: ${reason}|${connection}`);
        }
      } else if (connection === "open") {
        console.log(chalk.bold(chalk.cyan.blue('• User Info')));
        console.log(chalk.cyan(`- Name     : ${sock.user.name}`));
        console.log(chalk.cyan(`- Number   : ${sock.user.id.split(':')[0]}`));
        console.log(chalk.cyan(`- Status   : Connected`));

        db.once('connected', () => {
          console.log(chalk.greenBright('Connected to MongoDB'));
        });

        cron.schedule(config.cron_jobs.time, async () => {
          try {
            await User.updateMany({
              accountType: 'Free'
            }, {
              dailyLimit: config.daily_limit.free
            });
            console.log('Limit harian telah direset untuk pengguna tipe "Free".');
          } catch (error) {
            console.error('Gagal mereset limit harian:', error.message);
          }
        }, {
          timezone: config.cron_jobs.timezone
        });
      }
    });

    sock.ev.on('messages.upsert', async (chatUpdate) => {
      try {
        const mek = chatUpdate.messages[0];
        if (!mek.message) return;
        mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
        if (mek.key && mek.key.remoteJid === 'status@broadcast') return;
        if (!sock.public && !mek.key.fromMe && chatUpdate.type === 'notify') return;
        if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return;
        const m = smsg(sock, mek, store);
        require('./includes/client.js')({
          client: sock,
          messages: m,
          db: User
        });
      } catch (error) {
        console.error(error.message);
      }
    });

    sock.ev.on('contacts.update', (update) => {
      for (let contact of update) {
        let id = sock.decodeJid(contact.id)
        if (store && store.contacts) store.contacts[id] = {
          id,
          name: contact.notify
        }
      }
    });

    sock.decodeJid = (jid) => {
      if (!jid) return jid;
      if (/:\d+@/gi.test(jid)) {
        let decode = jidDecode(jid) || {};
        return decode.user && decode.server && decode.user + '@' + decode.server || jid;
      } else return jid;
    };

    sock.public = config.public_mode;
    sock.serializeM = (m) => smsg(sock, m, store);

    sock.sendText = (jid, text, quoted = '', options) => {
      return sock.sendMessage(jid, {
        text: text,
        ...options,
        /*contextInfo: {
        mentionedJid: [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net'),
        externalAdReply: {
          title: config.bot.name,
          body: config.owner.name[0],
          mediaType: 1,
          thumbnailUrl: 'https://telegra.ph/file/371343e9b6274c45aab2d.jpg',
          sourceUrl: 'https://instagram.com/jbrjbraza',
          renderLargerThumbnail: false,
          showAdAttribution: true
        }
      }*/
      }, {
        quoted,
        ...options
      })
    }

    return sock;
  };

  startServer();
} catch (error) {
  console.error(error.messages)
};