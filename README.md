# discord-oauth2-nodejs
A Simple Discord OAUTH2 Nodejs Example.

### Install
- Download the source code
- Unzip the code
- Run `npm i` in the same folder as index.js
- In the file called `.env` do the following: 
```
CLIENT_ID=         // Here is your Discord Client ID gonna be.
CLIENT_SECRET=     // Here is your CLient Secret gonna be.
REDIRECT_URI=      // Here is your Redirect Url that you have added in the Discord Developer Panel.
```
- In the File called `index.js` do the following:
```
  const allowedUserIds = ["623148006195331092", "971919703637393458", "879301072605315092"];
  [This is a whilelist system. Type your Discord Id and other people who has allow to login to the dashboard.]
```
- Now run `node index.js` to start the app.
- The app will now be running on port `3000`.

## Made By WavaDev
