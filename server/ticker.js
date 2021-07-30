const axios = require("axios");
const admin = require("firebase-admin");
const fs = require("fs");

const CONFIG = require("./_CONFIG.json");
const serviceAccount = require(CONFIG.firebaseServiceAccountFilePath);
const lockFilePath = "./ticker.lock";

//Check for txid (transaction id) argument
let txidArgument = null;
if (process.argv.length > 2) {
  txidArgument = process.argv[2];
}

//Check lock file
fs.writeFileSync("log.txt", "txidArgument " + txidArgument);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: CONFIG.databaseURL,
});

//Create lock file to avoid multiple simultaneous requests
//At restart of wallet, this script might get called hundreds of times at once
try {
  if (fs.existsSync(lockFilePath) === true) {
    const data = fs.readFileSync(lockFilePath, { encoding: "utf8", flag: "r" });
    const time = parseInt(data);
    const isLockOneSecondOld = time + 1000 > Date.now();
    if (isLockOneSecondOld === true) {
      console.error("Exit because of lock file");
      process.exit(0);
      return;
    }
  }
} catch (e) {}

fs.writeFileSync(lockFilePath, Date.now() + "");
async function work() {
  const db = admin.database();

  //Set balance
  const balance = await rpc("getbalance", []);
  const balanceRef = db.ref("balance");
  console.log("BALANCE", balance);
  await balanceRef.set(balance);

  console.log("transaction id", txidArgument);

  async function updateTransactionById(id) {
    const transaction = await rpc("gettransaction", [id, true]);
    const transactionRef = db.ref("transactions/" + id);
    transaction.hex = null;
    await transactionRef.set(transaction);
  }
  //Set transactions
  if (txidArgument) {
    updateTransactionById(txidArgument);
  }

  //Set all transactions
  if (!txidArgument) {
    //listtransactions ( "account" count skip include_watchonly)
    const account = "*";
    const count = 200;
    const args = [account, count]
    const transactions = await rpc("listtransactions", args);
    for (const transaction of transactions) {
      updateTransactionById(transaction.txid);
    }
    console.log("Fetched", transactions.length, "transactions");
  }

  //Set unconfirmed balance
  const unconfirmedBalance = await rpc("getunconfirmedbalance", []);
  await db.ref("unconfirmedBalance").set(unconfirmedBalance);

  //Set assets
  const listmyassets = await rpc("listmyassets", []);
  const assets = [];
  const assetNames = Object.keys(listmyassets);

  for (const assetName of assetNames) {
    //Fetch meta data about the asset

    const data = await rpc("getassetdata", [assetName]);
    assets.push({
      name: assetName,
      balance: listmyassets[assetName],
      ipfs_hash: data.ipfs_hash || null,
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
