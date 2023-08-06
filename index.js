const express = require("express")
const apiRoutes = express.Router();
const fetch = require('node-fetch')
const { URLSearchParams } = require('url')
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const crypto = require('crypto');
const path = require('path');
var fs = require('fs');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const session = require('express-session');

const app = express()
const listener = app.listen(3000, () => {
  console.log("APP | Application listening on port " + listener.address().port);
});

app.use((err, req, res, next) => {
  switch (err.message) {
    case 'NoCodeProvided':
      return res.status(400).send({
        status: 'ERROR',
        error: err.message,
      });
    default:
      return res.status(500).send({
        status: 'ERROR',
        error: err.message,
      });
  }
});

const allowedUserIds = ["623148006195331092", "971919703637393458", "879301072605315092"]; // Delete this line if you don't want have a whilelist system.

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URI,
      scope: ["identify"],
    },
    (accessToken, refreshToken, profile, done) => {
      // Check if the user's Discord ID is in the allowed list
      const userId = profile.id;
      if (allowedUserIds.includes(userId)) {
        // User is allowed to login
        return done(null, profile);
      } else {
        // User is not allowed to login
        return done(null, false, { message: "Unauthorized" });
      }
    }
  )
);

// Passport session setup
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Express middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'adwafegrerdfvbhytrdfghytrf', // Change This Secret To Whatever you want.
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
  res.send(`<html>
<head>
  <style>
    body {
      background-color: #f5f5f5;
      font-family: Arial, Poppins;
      text-align: center;
    }
    .container {
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    h1 {
      margin-bottom: 20px;
    }
    .login-btn {
      display: inline-block;
      padding: 10px 20px;
      background-color: #7289DA;
      color: #fff;
      text-decoration: none;
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    .login-btn:hover {
      background-color: #5a68a5;
    }
    .footer {
      margin-top: 40px;
      font-size: 14px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Example Discord Auth2 Login!</h1>
    <a href="/auth/discord" class="login-btn">Login with Discord</a>
  </div>
  <footer class="footer">Made By WavaDev</footer>
</body>
</html>`);
});

app.get('/auth/discord', passport.authenticate('discord'));

app.get(
  '/auth/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/admin');
  }
);

app.get('/admin', (req, res) => {
  if (req.isAuthenticated()) {
    const { username, avatar } = req.user;
    const avatarURL = `https://cdn.discordapp.com/avatars/${req.user.id}/${avatar}.png`;
    res.send(`
      <html>
      <div class="container">
            <h3>Welcome, ${username}!</h3>
                    <h4>This is an Example Page!</h4>
          </div>
          <footer>
            <p>Made By WavaDev</p>
          </footer>
      </html>
    `);
  } else {
    res.redirect('/auth/discord');
  }
});
