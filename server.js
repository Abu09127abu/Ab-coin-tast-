// server.js (Node.js Backend)
const express = require('express');
const path = require('path');
const app = express();

// Serve the index.html file
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
