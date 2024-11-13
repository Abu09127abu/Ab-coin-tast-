const express = require('express');
const path = require('path');
const app = express();

// Serve the index.html file
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
window.Telegram.WebApp.ready();
        const user = window.Telegram.WebApp.initDataUnsafe.user;
        if (user) {
            document.getElementById('user-photo').src = user.photo_url;
            document.getElementById('user-name').textContent = user.first_name;
        }

        function showPage(pageId) {
            const pages = document.querySelectorAll('.page');
            pages.forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(pageId).classList.add('active');
        }
    </script>

</body>
</html>
