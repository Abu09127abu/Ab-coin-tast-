const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Simulated Database (Replace with Firebase/actual DB)
let users = {
    // Example user data
    '12345': { abCoins: 500, refCount: 2 },
    '67890': { abCoins: 0, refCount: 0 },
};

app.use(express.static('public'));
app.use(express.json());

// Fetch user stats
app.get('/user-stats', (req, res) => {
    const { user_id } = req.query;

    if (!user_id || !users[user_id]) {
        return res.json({ refCount: 0, abCoins: 0 });
    }

    res.json(users[user_id]);
});

// Add new referral
app.post('/add-referral', (req, res) => {
    const { ref, newUserId } = req.body;

    if (!ref || !newUserId) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    // Check if referrer exists
    if (!users[ref]) {
        users[ref] = { abCoins: 0, refCount: 0 };
    }

    // Add coins and increment referral count
    users[ref].abCoins += 1000;
    users[ref].refCount += 1;

    // Add new user to the database
    if (!users[newUserId]) {
        users[newUserId] = { abCoins: 0, refCount: 0 };
    }

    res.json({ message: 'Referral added successfully', stats: users[ref] });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
