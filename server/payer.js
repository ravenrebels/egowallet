const axios = require("axios");
const admin = require("firebase-admin");

const CONFIG = require("./_CONFIG.json");
const serviceAccount = require(CONFIG.firebaseServiceAccountFilePath);

const CustomErrors = {
  INSUFFICIENT_FUNDS: "INSUFFICIENT_FUNDS",
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: CONFIG.databaseURL,
});

//Execute the actual code in an async function so we can use await
async function work() {
  const db = admin.database();
  console.log("Starting work");
  //Every time we start payer, make sure we have a receive address
  db.ref("receiveaddress").once("value", (snapshot) => {
    if (snapshot.exists() == false) {
      generateReceiveAddress(db);
    }
  });
  const requestsRef = db.ref("requests");
  requestsRef.on("value", async (data) => {
    const keys = Object.keys(data.val());

    for (const key of keys) {
      const o = data.val()[key];

      //Payment already transfered?
      if (o.transactionId) {
        console.log("Skip", key, "already paid", o.transactionId);
        continue;
      }

      //Payment has error? skip it
      if (o.error) {
        continue;
      }

      const amount = parseFloat(o.amount);

      const comment = key;
      let error = null;
      try {
        let transactionId = null;
        if (o.asset === "RVN") {
          try {
            transactionId = await rpc("sendtoaddress", [o.to, amount, comment]);
            await requestsRef.child(key).update({
              transactionId,
            });
          } catch (e) {
            await requestsRef.child(key).update({
              error: e.error.message,
            });
            continue;
          }
        }
        //Send asset instead of RVN?
        else if (o.asset !== "RVN") {
          try {
            //syntax
            //transfer "asset_name" qty "to_address" "message" expire_time "change_address" "asset_change_address"
            const args = [o.asset, o.amount, o.to];
            transactionId = await rpc("transfer", args);
            transactionId = transactionId[0];
            await requestsRef.child(key).update({
              transactionId,
            });
          } catch (e) {
            
            await requestsRef.child(key).update({
              error: e.error.message,
            });

            continue;
          }
        } else {
          await requestsRef.child(key).update({
            error: "No asset specified",
          });
          continue;
        }
      } catch (e) { 
         error = "sendtoaddress failed";
        await requestsRef.child(key).update({
          error,
        });
        continue;
      }
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
        rejectionFunc(e.response.data);
      });
    } catch (e) {
      rejectionFunc(e);
    }
  });
  return promise;
}

async function generateReceiveAddress(db) {
  const newAddress = await rpc("getnewaddress", []);
  await db.ref("receiveaddress").set(newAddress);
  console.info("Receive address: set to " + newAddress);
}
