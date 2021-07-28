# Private wallet for Ravencoin

This is a graphical user interface facade on top of your own full blown Raven core node (Ravencoin wallet).


Egowallet has the following capabilities
* Show wallet RVN balance
* List all assets/tokens in the wallet
* Transfer/send RVN from wallet
* You can send/receive assets/tokens

## Disclaimer

Use this software at your own risk. It is highly experimental at this stage.


## OVERVIEW
- You need Node.js installed, https://nodejs.org/en/
- Setup a Google Firebase account/project. This will be used as middleware
- Run a full Ravencoin node in server mode.
- RVN Node should NOT allow inbound trafic from the internet
- Host the web GUI (/client) wherever you like

## NOTE

This guide is incomplete.
Please follow this Youtube guide for a full instructions
https://youtu.be/FJC2VhW2edg


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
- Configure your Firebase project to use Authentication > Google.
- Log in once with your private Google Account in your local web app.
- Go to your Google Firebase project, check Authentication/users, it should now contain a user. Check the user.uid, copy it.
- Go to Realtime Database > Rules. Update the read/write rules so that only your user is allowed access.

```
{
  "rules": {
    ".read": "auth.uid === 'ro123_YOUR_USER_UID_123123zyUfADJA2'",
    ".write": "auth.uid === 'ro123_YOUR_USER_UID_123123zyUfADJA2'"
  }
}
```

## STEP 5: SERVER part, install dependencies

Start by installing dependencies
In your command line tool, change directory to ./server.

- Run command "npm install"

Your ./server directory contains the file ticker.js.

ticker.js should be invoked everytime something happens in your Raven Core wallet.


## STEP 6: ./server/_CONFIG:json

Create a file called _CONFIG.json

More info here: https://youtu.be/FJC2VhW2edg?t=953
```
{
  "databaseURL": "https://YOUR PATH b.europe-west1.firebasedatabase.app",
  "firebaseServiceAccountFilePath": "./asdf.json",
  "rpcUsername": "SOOOSecret123_mylord",
  "rpcPassword": "SOOOSecret123_mylord",
  "rpcURL": "http://127.0.0.1:8766"
}


```
## STEP 6: Configure service account for Firebase 

Export your service account (as json file) from Firebase.
Name the file firebaseServiceAccount.json (must match the firebaseServiceAccountFilePath in _CONFIG.json above).
Check out this part of our video guide for exact instructions.
https://youtu.be/FJC2VhW2edg?t=1097


## STEP 7: Configure Raven Core wallet to update Firebase.
Everytime something "happens" in your wallet. You want the changes to be  written to your Firebase project.

How can we do that? Well Raven Core wallet has a configuration feature called "walletnotify". "walletnotify" will run a script everytime something happens in your wallet.

tricker.js is the script/file that is keeping your Firebase project in sync.

Create a script, if you are on Windows you can create a .bat file, that will tricker ./server/ticker
Example of ticker.bat
```
cd c:\temp\egowallet\server
node c:\temp\egowallet\server\ticker

```
Check out this part of the video for full instructions
https://youtu.be/FJC2VhW2edg?t=759


## STEP 8: Activate payments capability

Your ./server folder has a file called payer.js

If you run this file, your app starts making payments of RVN.

Start it by
```
node payer
```

## STEP 9: Deploy your web app

Change directory to ./client

Run command ``` npm run build ```

The result is now in the ./dist folder

Copy/transfer/deploy the files in ./dist to your web hosting service.

 

## Example of Raven wallet config (raven.conf)
```
# Accept command line and JSON-RPC commands.
server=1
whitelist=127.0.0.1
txindex=1
addressindex=1
assetindex=1
timestampindex=1
spentindex=1

# Username for JSON-RPC connections
rpcuser=megasecret

# Password for JSON-RPC connections
rpcpassword=megasecret
walletnotify=c:/temp/egowallet/server/ticker.bat
```
