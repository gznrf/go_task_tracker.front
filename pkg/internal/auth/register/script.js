const form = document.getElementById('registerForm');
const responseBox = document.getElementById('responseMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // 👉 Подставь свой API URL
    const API_URL = "http://localhost:2002/auth/sign-up";

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        // Попробуем безопасно прочитать JSON
        let data = {};
        try { data = await res.json(); } catch {}

        responseBox.style.display = "block";

        if (res.ok) {
            // Если пришёл токен — сохраняем
            if (data.token || data.access_token) {
                const token = data.token || data.access_token;
                document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
            }

            // Если есть имя — сохраняем, иначе используем введённое
            const username = data.name || name;
            localStorage.setItem("username", username);

            responseBox.className = "alert alert-success";
            responseBox.textContent = "Регистрация успешна! Перенаправляем...";

            // 🔁 Надёжный редирект
            setTimeout(() => {
                window.location.href = "profile.html";
            }, 1000);

        } else {
            responseBox.className = "alert alert-danger";
            responseBox.textContent = data.message || "Ошибка регистрации.";
        }

    } catch (error) {
        responseBox.style.display = "block";
        responseBox.className = "alert alert-danger";
        responseBox.textContent = "Ошибка подключения к серверу.";
    }
});