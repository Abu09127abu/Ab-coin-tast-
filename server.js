// Node.js server (server.js)
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files
app.use(express.static('public'));

// Endpoint to get user info from Telegram
app.get('/user-info', async (req, res) => {
    try {
        // Replace with actual Telegram Bot integration logic
        // Sample response structure (mock data)
        const userInfo = {
            name: 'John Doe',
            photo_url: 'https://via.placeholder.com/150' // Replace with actual photo URL from Telegram
        };
        res.json(userInfo);
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).send('Error fetching user info');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
