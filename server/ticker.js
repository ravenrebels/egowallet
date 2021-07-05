const axios = require("axios");
var admin = require("firebase-admin");

const CONFIG = {
  rpcUsername: "rpcasdfUserasdfname",
  rpcPassword: "rpcPassswasdford",
  asset: "not applicable",
};

var admin = require("firebase-admin");

var serviceAccount = require("./firebaseServiceAccount.json");
var config = require("./config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:config.databaseURL,
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
        username: CONFIG.rpcUsername,
        password: CONFIG.rpcPassword,
      },
    };
    const data = {
      jsonrpc: "1.0",
      id: CONFIG.asset,
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
