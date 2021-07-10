# Private wallet for Ravencoin

This is a graphical user interface facade on top of your own full blown Raven core node (Ravencoin wallet)

## OVERVIEW

- Setup a Google Firebase account/project. This will be used as middleware
- Run a full Ravencoin node in server mode.
- RVN Node should NOT allow inbound trafic from the internet
- Host the web GUI (/client) wherever you like

## STEP 1: getting started

- git clone https://github.com/ravenrebels/egowallet.git

Now you have a local copy of the code

## STEP 2: Create a Google Firebase project

You must create your own Google Firebase project.
Configure your Firebase project to use Authentication > Google.

In firebase console, copy the web app config.
Create the file ./client/src/firebaseConfig.json and past in the web app config. (convert it from JavaScript to JSON syntax)

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

## STEP 3: Install client dependencies

Given that you are using your command line tool and that your current directory is egowallet.

- Change directory to /client
- run "npm install" to install dependencies
- run "npm start" to start the local web application.
  Open your web browser and navigate to http://localhost:1234

## STEP 4: Secure your Firebase database

- Log in once with your private Google Account in your local web app.
- Go to your Google Firebase project which should now contain a user. Check the user.uid, copy it.
- Realtime Database: update read/write rules,

```
{
  "rules": {
    ".read": "auth.uid === 'ro123_YOUR_USER_UID_123123zyUfADJA2'",
    ".write": "auth.uid === 'ro123_YOUR_USER_UID_123123zyUfADJA2'"
  }
}
```

## SERVER part

- npm install
- npm start

# THE SERVER PART

Configure your Raven core (Ravencoin QT wallet)

- walletnotify

## Capabilities

Log in using Google

Display balance

Receive

Withdraw/SEND

Operations
transfer tokens to address
transfer RVN to address
Create a receive address.
