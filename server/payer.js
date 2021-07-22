const axios = require("axios");
const admin = require("firebase-admin");

const CONFIG = require("./_CONFIG.json");
const serviceAccount = require(CONFIG.firebaseServiceAccountFilePath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: CONFIG.databaseURL,
});

//Execute the actual code in an async function so we can use await
async function work() {
  const db = admin.database();
  var requestsRef = db.ref("requests");

  requestsRef.on("value", async (data) => {
    const keys = Object.keys(data.val());

    for (const key of keys) {
      const o = data.val()[key];

      //Payment already transfered?
      if (o.transactionId) {
        console.log("Skip", key, "already paid", o.transactionId);
        continue;
      }

      //Validate to
      const validateAddress = await rpc("validateaddress", [o.to]);
      const amount = parseFloat(o.amount);
      const amountIsNegative = !(amount > 0);

      if (amountIsNegative === true) {
        await requestsRef.child(key).update({
          error: "amount is negative",
        });
        continue;
      }

      //
      if (validateAddress.isvalid === false) {
        await requestsRef.child(key).update({
          error: "to address is not valid ",
        });
        continue;
      }

      const comment = key;
      let error = null;
      try {
        let transactionId = null;

        if (o.asset === "RVN") {
          transactionId = await rpc("sendtoaddress", [o.to, amount, comment]);
        }
        //Send asset instead of RVN?
        else if (o.asset !== "RVN") {
          //syntax
          //transfer "asset_name" qty "to_address" "message" expire_time "change_address" "asset_change_address"
          const args = [o.asset, o.amount, o.to];
          try {
            transactionId = await rpc("transfer", args);
            transactionId = transactionId[0];
            console.log("Got", transactionId, "when sending asset");
          } catch (e) {}
        } else {
          await requestsRef.child(key).update({
            error: "No asset specified",
          });
          continue;
        }

        //Command wallet to send to address

        //Store the transaction id
        await requestsRef.child(key).update({
          transactionId,
        });
      } catch (e) {
        //TODO is it possible to get better error explanation from RPC call?
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
        rejectionFunc(e);
      });
    } catch (e) {
      rejectionFunc(e);
    }
  });
  return promise;
}
