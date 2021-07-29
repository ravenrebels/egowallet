const admin = require("firebase-admin");
const CONFIG = require("./_CONFIG.json");
const serviceAccount = require(CONFIG.firebaseServiceAccountFilePath);

const email = process.argv.length > 2 && process.argv[2];

if (!email) {
  console.error("Syntax: node addAdmin email@email.com");

  return;
}
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: CONFIG.databaseURL,
});

async function work() {
  let user = null;

  try {
    user = await admin.auth().getUserByEmail(email);
  } catch (e) {
    console.error(e.message);
    return;
  }

  if (!user) {
    console.error("user", email, " has not sign in to the app yet");
    return;
  }
  if (user.customClaims && user.customClaims.admin === true) {
    console.info(email, "is already an admin");
    return true;
  }
  console.log("Adding", email, "as admin");
  return admin.auth().setCustomUserClaims(user.uid, { admin: true });
}

work();
