var admin = require("firebase-admin");

var serviceAccount = require("./service.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://news-scraper-5203c.firebaseio.com'
});

const db = admin.firestore();

module.exports = db;