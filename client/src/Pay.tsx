import React from "react";

export function Pay({ balance, database, assets, receiveAddress, okCallback }) {
  const [to, setTo] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [asset, setAsset] = React.useState("RVN");

  const submit = async (_) => {
    if (isNaN(parseFloat(amount)) === true) {
      alert("Amount is not valid");
      return;
    }

    if (parseFloat(amount) > 0 === false) {
      alert("Amount must be more than zero");
      return;
    }

    if (!to || to.length < 10) {
      alert("To field does not seem like a valid Ravencoin address");
    }
    const str = `Are you sure you want to send\n${amount} ${asset} \nto\n ${to}?`;
    if (confirm(str)) {
      const requests = database.ref("requests");
      const newReq = requests.push();

      newReq.set({
        action: "send",
        to,
        amount,
        asset,
      });

      newReq.on("value", (snapshot) => {
        const data = snapshot.val();

        if (data.error) {
          const text = `
          ${data.error}. 
          Could not send ${data.amount} 
          of ${data.asset} 
          to ${data.to}`;
          alert(text);
        } else {
          //Only redirect when the request has gotten a txid

          if (data.transactionId && okCallback) {
            okCallback(data);
          }
        }
      });
      setTo("");
      setAmount("");
    }
  };

  return (
    <div className="raven-rebels-ego-wallet__pay padding-default">
      <div className="padding-default glass">
        <h1>Pay / Transfer</h1>
        <div style={{ overflow: "hidden" }}>
         
          <div style={{ marginBottom: "22px" }}>
            <label>
              Token/Asset
              <br />
              <select
                className="padding-modest"
                style={{ fontSize: "16px", borderRadius: "5px" }}
                onChange={(event) => {
                  setAsset(event.target.value);
                }}
              >
                <option value="RVN">RVN - {balance}</option>
                {assets &&
                  assets.map((asset) => {
                    return (
                      <option key={asset.name} value={asset.name}>
                        {asset.name} - {asset.balance}
                      </option>
                    );
                  })}
              </select>
            </label>
          </div>
          <label>
            To address
            <input
              className="padding-modest"
              style={{
                borderRadius: "5px",
                display: "block",
                fontSize: "20px",
                width: "100%",
              }}
              value={to}
              onChange={(event) => {
                setTo(event.target.value.trim());
              }}
            ></input>
          </label>
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>
            Amount
            <input
              className="padding-modest"
              style={{
                borderRadius: "5px",
                fontSize: "20px",
                display: "block",
              }}
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value.trim());
              }}
            ></input>
          </label>
        </div>
        <div
          style={{
            marginTop: "22px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button
            className="unstyled-button glass"
            style={{ padding: "10px" }}
            onClick={submit}
          >
            Submit
          </button>
          <button
            className="unstyled-button glass"
            style={{ padding: "10px" }}
            onClick={() => {
              setTo("");
              setAmount("");
            }}
          >
            Clear
          </button>
        </div>
      </div>
      <div style={{ marginTop: "22px" }}>
        <div className="padding-default glass" style={{ marginBottom: "22px" }}>
          <h3>Receive address</h3>
          <div style={{ wordWrap: "break-word" }}>{receiveAddress}</div>
          <img
            style={{
              background: "white",
              borderRadius: "10px",
              marginTop: "10px",
            }}
            className="padding-modest"
            src={`http://api.qrserver.com/v1/create-qr-code/?color=000000&bgcolor=FFFFFF&data=${receiveAddress}&qzone=1&margin=0&size=150x150&ecc=L`}
          />
        </div>
      </div>
    </div>
  );
}
