require('dotenv').config();
const express = require("express");
const app = express();
const OpenTok = require("opentok");
const cors = require('cors');
const OT = new OpenTok(process.env.key, process.env.secret);
const User = require('./server/models/user.model');
const Room = require('./server/models/room.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const atob = require('atob');
const path = require('path');
const saltRounds = 10;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// DB connection
require('./server/db');




// Routes
app.get("/", (req, res) => {
  OT.createSession(function (err, session) {
    if(err) {
      return console.log(err)
    }
    let sessionId = session.sessionId;
    let token = generateToken(sessionId);
    return res.send({ apiKey: process.env.key, sessionId, token });
  })
});

app.post('/register', async (req, res) => {
  console.log(req.body)
  let { email, username, password } = req.body;
  if(!email || !username || !password) {
    return res.status(400).json({ success: false, message: 'Invalid request parameters' });
  }
  try {
    let user = await User.findOne({ email: email });
    if(user) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }
    let hash = await bcrypt.hash(password, saltRounds)
    let newUser = new User({ email, username, password: hash });
    await newUser.save();
    return res.status(201).json({ success: true, message: 'User created successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/login', async (req, res) => {
  let { email, password } = req.body;
  if(!email || !password) {
    return res.status(400).json({ success: false, message: 'Invalid request parameters' });
  }
  try {
    let user = await User.findOne({ email: email });
    if(!user) {
      return res.status(404).json({ success: false, message: 'User does not exists' });
    }
    let result = await bcrypt.compare(password, user.password);
    if(result) {
      let token = await generateJWTToken({ email: user.email, username: user.username });
      let loggedInUser = { email: user.email, username: user.username, _id: user._id};
      delete loggedInUser.password;
      return res.status(200).json({ success: true, message: 'Login successful', token, user: loggedInUser });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: error.message });
  }
});


app.get('/room/:id', async (req, res) => {
  try {
    let encoded = req.params.id;
    let encodedStr = atob(encoded)
    let credentials = await Room.findOne({email: encodedStr});
    console.log(credentials);
    res.status(200).json({ success: true, credentials })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/room', async (req, res) => {
  try {
    let credentials = req.body;
    let data = { email: credentials.email, sessionId: credentials.sessionId, token: credentials.token, apiKey: credentials.apiKey};
    let room = await Room.findOne({ email: credentials.email });
    if(room) {
      await Room.updateOne({ email: credentials.email }, data);
      return res.status(200).json({ success: true, message: 'credentials updated successfully' });
    } else {
      let newRoom = new Room(data);
      await newRoom.save();
      return res.status(201).json({ success: true, message: 'credentials saved successfully' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/logout', async (req, res) => {
  try {
    // as of now get the email and logout
    // remove the room
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

function generateToken(sessionId) {
  return OT.generateToken(sessionId);
}

async function generateJWTToken(payload) {
  return await jwt.sign(payload, 'afdc7800c334ea2b0db8687cf17d1b4ef49e3e62');
}
const listener = app.listen(4000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});