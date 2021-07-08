import React from "react";
import { Button, Card } from "ui-neumorphism";
import { TextField } from "ui-neumorphism";

export function Pay({ balance, database }) {
  const [to, setTo] = React.useState("");
  const [amount, setAmount] = React.useState("");

  let _setTo = setTo;
  let _setAmount = setAmount;
  const submit = (_) => {

    if(isNaN(parseFloat(amount)) === true){
      alert("Amount is not valid");
      return;
    }

    if(!to || to.length < 10){
        alert("To field does not seem like a valid Ravencoin address");
    };
    const str = `Are you sure you want to send\n${amount} RVN \nto ${to}?`;
    if (confirm(str)) {
      const requests = database.ref("requests");
      const newReq = requests.push();

      

      newReq.set({
        action: "send",
        to,
        amount,
      });
      setTo("");
      setAmount("");
    }
  };

  return (
    <div className="raven-rebels-ego-wallet__pay padding-default">
      <Card className="padding-default">
        <h1>Pay Transfer</h1>
        <div>
          <p className="padding-default">
            <label>Available balance: {balance} </label>
          </p>
          <label>
            To
            <TextField
              uncontrolled
              value={to}
              onChange={(event) => {
                setTo(event.value.trim());
              }}
            ></TextField>
          </label>
        </div>
        <div>
          <label>
            Amount
            <TextField
              uncontrolled
              value={amount}
              onChange={(event) => {
                setAmount(event.value.trim());
              }}
            ></TextField>
          </label>
        </div>
        <div 
          style={{
            marginTop: "22px",
            display: "flex",
            "justifyContent": "space-between",
          }}
        >
          <Button onClick={submit}>Submit</Button>
          <Button
            onClick={() => {
              setTo("");
              setAmount("");
            }}
          >
            Clear
          </Button>
        </div>
      </Card>
    </div>
  );
}
