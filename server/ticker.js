const axios = require("axios");
const admin = require("firebase-admin");
const ravenConfig = require("./ravenConfig.json"); 

const serviceAccount = require("./firebaseServiceAccount.json");
const config = require("./firebaseConfig.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.databaseURL,
});

async function work() {
  const db = admin.database();

  //Set balance
  const balance = await rpc("getbalance", []);
  const balanceRef = db.ref("balance");
  await balanceRef.set(balance);

  //Set unconfirmed balance
  const unconfirmedBalance = await rpc("getunconfirmedbalance", []);
  await db.ref("unconfirmedBalance").set(unconfirmedBalance);

  //Set assets
  const listmyassets = await rpc("listmyassets", []);
  const assets = [];
  const assetNames = Object.keys(listmyassets);

  for (const assetName of assetNames) {
    assets.push({
      name: assetName,
      balance: listmyassets[assetName],
    });
  }
  const ref = db.ref("assets");
  await ref.set(assets);

  process.exit(0);
}
work();

async function rpc(method, params) {
  const promise = new Promise((resolutionFunc, rejectionFunc) => {
    const options = {
      auth: {
        username: ravenConfig.rpcUsername,
        password: ravenConfig.rpcPassword,
      },
    };
    const data = {
      jsonrpc: "1.0",
      id: "n/a",
      method,
      params,
    };

    try {
      const rpcResponse = axios.post("http://127.0.0.1:8766", data, options);

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
