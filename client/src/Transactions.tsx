import React from "react"; 

export function Transactions({ transactions }) {
  if (!transactions) {
    return null;
  }

  const keys = Object.keys(transactions);

  //Sort transactions by date
  keys.sort(function (t1, t2) {
    const time1 = transactions[t1].time;
    const time2 = transactions[t2].time;

    if (time1 > time2) {
      return -1;
    }
    if (time1 < time2) {
      return 1;
    }

    return 0;
  });
  return (
    <div className="raven-rebels-ego-wallet__pay padding-default">
      <div className="padding-default glass">
        <h1>Transactions</h1>
        <div  style={{ marginTop: "40px" }}>
          {keys.map(function (key) {
            const trans = transactions[key];

            const details = {
              amount: 0,
              assetName: "RVN",
              category: "",
              destination: "",
            };
            const isRVN = !!trans.details;
            if (isRVN === true) {
              details.amount = trans.amount;
              details.category = trans.details[0].category;
              details.destination = trans.details[0].address;
             
            } else if (isRVN === false) {
              details.amount = trans.asset_details[0].amount;
              details.assetName = trans.asset_details[0].asset_name;
              details.category = trans.asset_details[0].category;
              details.destination = trans.asset_details[0].destination;
            }

            //const details =  trans.details || trans.asset_details[0];

            const date = new Date(trans.time * 1000);

            const send = details.category === "send";
            const amount = details.amount;
            const href = "https://explorer.ravenland.org/tx/" + key;

            return (
              <div className="glass" key={key} style={{padding: "10px", marginBottom: "22px" }}>
                <div style={{ fontWeight: "bold" }}>{date.toLocaleString()}</div>
                {send === true ? "Sent" : "Received"} {amount}{" "}
                {details.assetName}
                <br />
                <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
                  To: {details.destination}
                </div>
                <a
                  href={href}
                  style={{
                    overflow: "hidden",
                    display: "inline-block",
                    maxWidth: "100%",
                  }}
                  target="transaction"
                >
                  {key}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
