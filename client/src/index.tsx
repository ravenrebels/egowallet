import React from "react";
import ReactDOM from "react-dom";
import { Routes } from "./Routes";
import { Home } from "./Home";
import { Pay } from "./Pay";

import { hasPendingTransactions, Transactions } from "./Transactions";
import firebase from "firebase";
import firebaseConfig from "./firebaseConfig.json";
export type User = firebase.User;
import { default as StyledFirebaseAuth } from "react-firebaseui/StyledFirebaseAuth";
const app = firebase.initializeApp(firebaseConfig);
const database = app.database();

const logOut = () => {
  if (confirm("Do you want to log out?")) {
    firebase.auth().signOut();
  }
};

function Cosmos() {
  const user = useUser();

  const uiConfig = {
    signInFlow: "popup",
    callbacks: {
      /* signInSuccessWithAuthResult: (authResult, _) => {
        // setUser(authResult.user);
        return true;
      },*/
      uiShown: function () {},
    },
    signInOptions: [
      // List of OAuth providers supported.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
  };
  if (user) {
    return <App user={user} logOut={logOut} />;
  } else {
    return (
      <div style={{ marginTop: "50px", padding: "44px" }}>
        <h1>RVN</h1>
        <h5>Ravencoin Private Wallet</h5>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </div>
    );
  }
}
function useUser() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(async function (user: User) {
      setUser(user);
    });
  }, []);
  return user;
}
function App({ user, logOut }) {
  const [route, setRoute] = React.useState(Routes.OVERVIEW);

  const [assets, setAssets] = React.useState([]);
  const [balance, setBalance] = React.useState("0.0");
  const [unconfirmedBalance, setUnconfirmedBalance] = React.useState("0");
  const [receiveAddress, setReceiveAddress] = React.useState("");

  const [transactions, setTransactions] = React.useState(null);
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

    //Listen to balance
    firebase
      .database()
      .ref("receiveaddress")
      .on("value", (snapshot) => {
        setReceiveAddress(snapshot.val());
      });

    //Listen to unconfirmed balance
    firebase
      .database()
      .ref("unconfirmedBalance")
      .on("value", (snapshot) => {
        setUnconfirmedBalance(snapshot.val());
      });

    //Listen to transactions
    firebase
      .database()
      .ref("transactions")
      .on("value", (snapshot) => {
        setTransactions(snapshot.val());
      });
  }, []);
  const style = {
    width: "200px",
    height: "200px",
    padding: "20px",
  };

  return (
    <div>
      <ul className="padding-default raven-rebels-ego-wallet__nav">
        <li className="raven-rebels-ego-wallet__nav-item">
          <button
            className="unstyled-button"
            onClick={() => setRoute(Routes.OVERVIEW)}
          >
            <i className="fa fa-home fa-2x" title="Home"></i>
          </button>
        </li>
        <li className="raven-rebels-ego-wallet__nav-item">
          <button
            className="unstyled-button"
            onClick={() => setRoute(Routes.PAY)}
          >
            <i className="fa fa-exchange-alt fa-2x" title="Pay"></i>
          </button>
        </li>
        <li className="raven-rebels-ego-wallet__nav-item">
          <button
            className="unstyled-button"
            onClick={() => setRoute(Routes.TRANSACTIONS)}
          >
            <i className="fas fa-list fa-2x" title="Transactions"></i>
          </button>

          {hasPendingTransactions(transactions) && (
            <div className="blink_me" style={{position: "absolute", fontSize: "50%"}}>PENDING</div>
          )}
        </li>

        <li className="raven-rebels-ego-wallet__nav-item">
          <button className="unstyled-button" onClick={logOut}>
            <i className="fas fa-sign-out-alt fa-2x" title="Sign out"></i>
          </button>
        </li>
      </ul>
      {route === Routes.TRANSACTIONS && (
        <Transactions transactions={transactions}></Transactions>
      )}
      {route === Routes.OVERVIEW && (
        <Home
          assets={assets}
          balance={balance}
          unconfirmedBalance={unconfirmedBalance}
        />
      )}
      {route === Routes.PAY && (
        <Pay
          assets={assets}
          balance={balance}
          database={database}
          receiveAddress={receiveAddress}
          okCallback={(transactionData) => {
            setRoute(Routes.TRANSACTIONS);
          }}
        />
      )}
    </div>
  );
}

ReactDOM.render(<Cosmos />, document.getElementById("app"));
