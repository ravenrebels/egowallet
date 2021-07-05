import React from "react";
import { Card } from "ui-neumorphism";
export function Pay({ balance, database }) {
  const [to, setTo] = React.useState("");
  const [amount, setAmount] = React.useState("0");

  const submit = (event) => {
    const str = `Are you sure you want to send\n${amount} RVN \nto ${to}?`;
    if (confirm(str)) {
      var requests = database.ref("requests");

      var newReq = requests.push();
      newReq.set({
        action: "send",
        to: to,
        amount: amount,
      });
    }

    event.preventDefaults();
    return false;
  };
  return (
    <div className="pay padding-default">
      <Card className="padding-default">
        <h1>Pay Transfer</h1>
        <form>
          <div>
            <label>Available balance: {balance} </label>
            <br />
            <label for="to" className="form-label">
              To
              <input
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                className="form-control"
                id="to"
                type="text"
                name="to"
                value={to}
                onChange={(event) => {
                  setTo(event.target.value);
                }}
              ></input>
            </label>
          </div>
          <div>
            <label for="amount" className="form-label">
              Amount
              <input
                className="form-control"
                id="amount"
                name="amount"
                type="text"
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                }}
              ></input>
            </label>
          </div>
          <button className="btn btn-dark" onClick={submit}>
            Submit
          </button>
        </form>
      </Card>
    </div>
  );
}
