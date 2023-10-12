# WhatsApp BOT - NodeJs
## Fitur
1. Artificial Intelligence
2. Downloader
3. Searcher
4. Stalker
5. Maker
6. Random Image
7. URL Shortener
8. Converter
9. Islamic
10. Tools
11. Authentication
12. Owner/Admin

## Instalasi
### Instal/clone proyek
```bash
git clone https://github.com/danitechid/wabot-nodejs.git
```

### Pimdah Direktori (CD)
```bash
cd wabot-nodejs
```

### MongoDb
#### Buat akun dan database MongoDb
Daftar dan buat database dan dapatkan MongoDb URI: <a href="https://mongodb.com">https://mongodb.com</a>

#### Edit ./config/mainConfig.js > mongodb_uri
```javascript
mongodb_uri: 'Your_MongoDb_URI', // Register here: https://mongodb.com/#sign-up
```

### Application Programming Interface (API)
#### Dapatkan Kunci API
Daftar dan dapatkan kunci API: <a href="https://api.danitechno.com">https://api.danitechno.com</a>

#### Edit ./config/mainConfig.js > api
```javascript
api: {
  ...
  key: 'Your_API_key' // Register here: https://daniapi.my.id/#sign-up
}
```

### Instal dependensi
#### Npm
```bash
npm install
```
#### Yarn
```bash
yarn install
```

### Jalankan server
#### Npm
```bash
npm run start
```

#### Yarn
```bash
yarn run start
```

#### Node
```bash
node run start
```

#### Bun
```bash
bun run start
```
