import React from "react";
import { Button, Card } from "ui-neumorphism";
import { TextField } from "ui-neumorphism";

export function Pay({ balance, database }) {
  const [to, setTo] = React.useState("to default value");
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
    <div className="raven-rebels-ego-wallet__pay padding-default">
      <Card className="padding-default">
        <h1>Pay Transfer</h1>
        <form>
          <div>
            <label>Available balance: {balance} </label>
            <br />
            <label>
              To
              <TextField
                onChange={(event) => {
                  setTo(event.value);
                }}
              ></TextField>
            </label>
          </div>
          <div>
            <label>
              Amount
              <TextField
                onChange={(event) => {
                  setAmount(event.value);
                }}
              ></TextField>
            </label>
          </div>
          <Button onClick={null}>
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
}
