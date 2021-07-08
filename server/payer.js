const axios = require("axios");
const admin = require("firebase-admin");

const CONFIG = require("./_CONFIG.json");
const serviceAccount = require(CONFIG.firebaseServiceAccountFilePath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: CONFIG.databaseURL,
});

async function work() {
  const db = admin.database();
  var requestsRef = db.ref("requests");

  requestsRef.on("value", async (data) => {
    console.log("data", data);
    console.log("data.val", data.val());

    const keys = Object.keys(data.val());

    for (const key of keys) {
      const o = data.val()[key];

      //Payment already transfered?
      if (o.transactionId) {
        console.log("Skip", key, "already paid", o.transactionId);
        continue;
      }
      const amount = parseFloat(o.amount);
      const comment = key;
      const transactionId = await rpc("sendtoaddress", [o.to, amount, comment]);

      await requestsRef.child(key).update({
        transactionId,
      });
    }
  });
}

work();

async function rpc(method, params) {
  const promise = new Promise((resolutionFunc, rejectionFunc) => {
    const options = {
      auth: {
        username: CONFIG.rpcUsername,
        password: CONFIG.rpcPassword,
      },
    };
    const data = {
      jsonrpc: "1.0",
      id: "n/a",
      method,
      params,
    };

    try {
      const rpcResponse = axios.post(CONFIG.rpcURL, data, options);

      rpcResponse.then((re) => {
        const result = re.data.result;
        resolutionFunc(result);
      });
      rpcResponse.catch((e) => {
        rejectionFunc(e);
      });
    } catch (e) {
      rejectionFunc(e);
    }
  });
  return promise;
}
