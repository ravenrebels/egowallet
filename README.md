# Private wallet for Ravencoin
This is a graphical user interface facade on top of your own full blown Raven core node (Ravencoin wallet)

## Requirements
 - Setup a Google Firebase account/project. This will be used as middleware
 - Run a full Ravencoin node in server mode.
 - RVN Node should NOT allow inbound trafic from the internet

## Dev, getting started
* git clone
## Google Firebase config
You must create your own Google Firebase project.
Configure your Firebase project to use Authentication > Google
In firebase console, copy the web app config.
Create the file ./src/firebaseConfig.json and past in the web app config.

Should look something liks
```
{
  "apiKey": "AIasdfasdfuMYisRLJGUkxz4",
  "authDomain": "egoasdfasdff08.firebaseapp.com",
  "databaseURL": "https://egowalasdfasdfdefault-rtdb.europe-west1.firebasedatabase.app",
  "projectId": "egowalleasdfasdf",
  "storageBucket": "egowalleasdf.appspot.com",
  "messagingSenderId": "27110asdf",
  "appId": "1:271asdf7:web:3asdf72a8e"
```

* npm install
* npm start

## Capabilities
Log in using Google 

Display balance

Receive

Withdraw/SEND

Operations
transfer tokens to address
transfer RVN to address
Create a receive address.