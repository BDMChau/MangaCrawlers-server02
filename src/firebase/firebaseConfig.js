const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKeys.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mangacrawlers-58f1e-default-rtdb.firebaseio.com/",
});

const firebaseDatabase = admin.database();

module.exports = firebaseDatabase;

