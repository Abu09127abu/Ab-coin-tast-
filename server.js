const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// In-memory database simulation
const users = {};
const coins = {};

app.use(bodyParser.json());
app.use(express.static('public')); // Serve HTML and assets

// Sign up route
app.post('/signup', (req, res) => {
    const { username, referrerId } = req.body;

    // Check if username already exists
    if (users[username]) {
        return res.status(400).json({ message: 'Username already exists!' });
    }

    // Add new user
    users[username] = { referrerId, refCount: 0 };
    coins[username] = 0;

    // If referred by someone, reward the referrer
    if (referrerId && users[referrerId]) {
        coins[referrerId] = (coins[referrerId] || 0) + 1000;
        users[referrerId].refCount += 1;
    }

    res.json({ message: `Welcome, ${username}!` });
});

// Get user info route (optional)
app.get('/user/:username', (req, res) => {
    const { username } = req.params;
    if (!users[username]) {
        return res.status(404).json({ message: 'User not found!' });
    }
    res.json({ user: users[username], coins: coins[username] });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
