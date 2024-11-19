const express = require('express');
const app = express();
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, get, update } = require('firebase/database');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaj_RVUSP_NFhtwJociWhJ5WRqgJ_SbTk",
  authDomain: "ab-coin-admin.firebaseapp.com",
  databaseURL: "https://ab-coin-admin-default-rtdb.firebaseio.com",
  projectId: "ab-coin-admin",
  storageBucket: "ab-coin-admin.appspot.com",
  messagingSenderId: "411970573696",
  appId: "1:411970573696:web:a0a678f8b9a6ae0e601d65",
  measurementId: "G-79XKRNMV7H",
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
const db = getDatabase(appFirebase);

app.use(express.static('public'));
app.use(express.json());

// Route for User to login with Telegram info
app.get("/login", (req, res) => {
  const chatId = req.query.chatId;
  const name = req.query.name;

  if (chatId && name) {
    const userRef = ref(db, 'users/' + chatId);
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        // User exists, update their information
        update(userRef, { name: name });
        res.json({ message: 'User updated', name: snapshot.val().name, coins: snapshot.val().coins });
      } else {
        // Create a new user if doesn't exist
        set(userRef, {
          name: name,
          chatId: chatId,
          coins: 0
        }).then(() => {
          res.json({ message: 'User created', name, coins: 0 });
        }).catch((error) => {
          res.status(500).send('Error creating user: ' + error);
        });
      }
    }).catch((error) => {
      res.status(500).send('Error reading from Firebase: ' + error);
    });
  } else {
    res.status(400).send('Chat ID and Name are required');
  }
});

// Route for Admin to get all users
app.get("/admin/users", (req, res) => {
  const usersRef = ref(db, 'users');
  get(usersRef).then((snapshot) => {
    if (snapshot.exists()) {
      res.json(snapshot.val());
    } else {
      res.json({ message: "No users found" });
    }
  }).catch((error) => {
    res.status(500).send('Error fetching users: ' + error);
  });
});

// Route to update coins for a user
app.post("/admin/updateCoins", (req, res) => {
  const { chatId, coins } = req.body;
  if (chatId && coins !== undefined) {
    const userRef = ref(db, 'users/' + chatId);
    update(userRef, { coins: coins }).then(() => {
      res.json({ message: 'Coins updated successfully' });
    }).catch((error) => {
      res.status(500).send('Error updating coins: ' + error);
    });
  } else {
    res.status(400).send('Chat ID and coins are required');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
