const form = document.getElementById('loginForm');
const responseBox = document.getElementById('responseMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const password = document.getElementById('password').value.trim();

    // 👉 Подставь свой API URL
    const API_URL = "http://localhost:2002/auth/sign-in";

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, password }),
        });

        let data = {};
        try { data = await res.json(); } catch {}

        responseBox.style.display = "block";
        console.log(data)

        if (res.ok) {
            // Попробуем найти токен во всех возможных местах
            const token = data.token;

            if (!token) {
                console.warn("⚠️ Токен не найден в ответе:", data);
                responseBox.className = "alert alert-danger";
                responseBox.textContent = "Ошибка: токен не пришёл от сервера.";
                return;
            }

            // Сохраняем токен в cookie
            document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;

            responseBox.className = "alert alert-success";
            responseBox.textContent = "Успешный вход! Перенаправляем...";

            setTimeout(() => {
                window.location.href = "profile.html";
            }, 1000);
        } else {
            responseBox.className = "alert alert-danger";
            responseBox.textContent = data.message || "Неверные данные для входа";
        }
    } catch (err) {
        console.error(err);
        responseBox.style.display = "block";
        responseBox.className = "alert alert-danger";
        responseBox.textContent = "Ошибка подключения к серверу.";
    }
});