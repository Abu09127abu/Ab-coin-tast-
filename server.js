const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

// In-memory database
const users = {};

// Helper function to validate Telegram data
function validateTelegramAuth(initData) {
  const initDataObj = Object.fromEntries(new URLSearchParams(initData));
  const hash = initDataObj.hash;
  delete initDataObj.hash;

  const secretKey = crypto
    .createHash("sha256")
    .update("7670487383:AAHahkQTB4XVCwD8oQoWL_GC4tg5FP40IAg", "utf8")
    .digest();

  const checkString = Object.keys(initDataObj)
    .sort()
    .map((key) => `${key}=${initDataObj[key]}`)
    .join("\n");

  const hmac = crypto.createHmac("sha256", secretKey).update(checkString).digest("hex");

  return hmac === hash ? initDataObj : null;
}

// Endpoint to authenticate user
app.get("/get-user", (req, res) => {
  const ref = req.query.ref || null;
  const authData = validateTelegramAuth(req.query.initData);

  if (!authData) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id: telegramId, first_name: firstName, username } = authData;

  // Create or update user
  if (!users[telegramId]) {
    users[telegramId] = { telegramId, firstName, username, referrals: [] };
    if (ref && users[ref]) {
      users[ref].referrals.push(telegramId); // Add referral
    }
  }

  res.json({ user: users[telegramId] });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
