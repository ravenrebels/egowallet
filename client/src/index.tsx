import React from "react";
import ReactDOM from "react-dom";
import { Routes } from "./Routes";
import { Home } from "./Home";
import { Pay } from "./Pay";
import { Button, Card } from "ui-neumorphism";
import firebase from "firebase";
import firebaseConfig from "./firebaseConfig.json";
export type User = firebase.User;
import { default as StyledFirebaseAuth } from "react-firebaseui/StyledFirebaseAuth";
const app = firebase.initializeApp(firebaseConfig);
import "ui-neumorphism/dist/index.css";
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
      //Check that the user has a user profile

      setUser(user);

      if (user === null) {
        return;
      }
      /*  const data =
        user.providerData &&
        user.providerData.length > 0 &&
        user.providerData[0];

      firebase
        .database()
        .ref("users/" + user.uid + "/profile_data")
        .update(data);*/
    });
  }, []);
  return user;
}
function App({user}) {
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
    <Card flat>
      {user.displayName} - {user.email}
      <ul className="raven-rebels-ego-wallet__nav">
        <li className="raven-rebels-ego-wallet__nav-item">
          <Button onClick={() => setRoute(Routes.OVERVIEW)}>Home</Button>
        </li>
        <li className="raven-rebels-ego-wallet__nav-item">
          <Button onClick={() => setRoute(Routes.PAY)}>Pay</Button>
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

ReactDOM.render(<Cosmos />, document.getElementById("app"));
