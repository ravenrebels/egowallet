import React from "react";
import ReactDOM from "react-dom";
import { Routes } from "./Routes";
import { Home } from "./Home";
import { Pay } from "./Pay";
import { Button, Card } from "ui-neumorphism";
import firebase from "firebase";
import  firebaseConfig  from "./firebaseConfig.json";
 
const app = firebase.initializeApp(firebaseConfig);
import "ui-neumorphism/dist/index.css";
const database = app.database();

function App() {
  const [route, setRoute] = React.useState(Routes.OVERVIEW);

  const [assets, setAssets] = React.useState([]);
  const [balance, setBalance] = React.useState("0.0");
  const [unconfirmedBalance, setUnconfirmedBalance] = React.useState("0");
  React.useEffect(() => {
    //Listen to assets
    firebase
      .database()
      .ref("assets")
      .on("value", (snapshot) => {
        setAssets(snapshot.val());
      });

    //Listen to balance
    firebase
      .database()
      .ref("balance")
      .on("value", (snapshot) => {
        setBalance(snapshot.val());
      });

    //Listen to unconfirmed balance
    firebase
      .database()
      .ref("unconfirmedBalance")
      .on("value", (snapshot) => {
        setUnconfirmedBalance(snapshot.val());
      });
  }, []);
  const style = {
    width: "200px",
    height: "200px",
    padding: "20px",
  };

  return (
    <Card >
      <ul className="raven-rebels-ego-wallet__nav">
        <li className="raven-rebels-ego-wallet__nav-item">
          <Button onClick={() => setRoute(Routes.OVERVIEW)}>
            Home
          </Button>
        </li>
        <li className="raven-rebels-ego-wallet__nav-item">
          <Button onClick={() => setRoute(Routes.PAY)}>
            Pay
          </Button>
        </li>
      </ul>
      {route === Routes.OVERVIEW && (
        <Home
          assets={assets}
          balance={balance}
          unconfirmedBalance={unconfirmedBalance}
        />
      )}
      {route === Routes.PAY && <Pay database={database} balance={balance} />}
    </Card>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
