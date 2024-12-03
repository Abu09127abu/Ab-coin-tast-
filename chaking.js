import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGxD2leu_pY8_t_-3rvAwaEXPK1mbsTvQ",
  authDomain: "ab-work-d4c33.firebaseapp.com",
  databaseURL: "https://ab-work-d4c33-default-rtdb.firebaseio.com",
  projectId: "ab-work-d4c33",
  storageBucket: "ab-work-d4c33.appspot.com",
  messagingSenderId: "1069052496926",
  appId: "1:1069052496926:web:ba38604086232f092bb20f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Check if Telegram Web App context is available
if (window.Telegram.WebApp.initDataUnsafe) {
  const user = window.Telegram.WebApp.initDataUnsafe.user;

  if (user) {
    const { id: chatId, first_name: name, username, photo_url: profilePic } = user;

    // Display user data
    document.getElementById('profile-pic').src = profilePic || 'default-avatar.png';
    document.getElementById('user-name').innerText = `${name} (@${username})`;

    // Save user data in Firebase
    const userRef = ref(database, `users/${chatId}`);
    set(userRef, { chatId, name, username, profilePic, abcoin: 0, tonAddress: '', tonTransactionComplete: 0 });

    // Load user's AB coins and tasks
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        document.getElementById('abcoin-counter').innerText = data.abcoin || 0;
        // Display tasks or other data as needed
      }
    });
  } else {
    alert('Telegram WebApp data not available!');
  }
} else {
  alert('Please open this page through Telegram!');
}
