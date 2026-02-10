import { request } from '../api.js';

export function renderLogin(container) {
    container.innerHTML = `
        <div class="auth-wrapper">
            <div class="auth-card">
                <span class="auth-logo">🎯</span>
                <h1>С возвращением</h1>
                <p class="subtitle">Войдите в свой аккаунт TrackerPro</p>
                
                <form id="login-form" class="auth-form">
                    <label for="name">Имя пользователя</label>
                    <input type="text" id="name" placeholder="Введите имя" required autocomplete="username">
                    
                    <label for="password">Пароль</label>
                    <input type="password" id="password" placeholder="••••••••" required autocomplete="current-password">
                    
                    <button type="submit" class="btn-login">Войти в систему</button>
                </form>

                <div class="auth-footer">
                    Нет аккаунта? <a href="#register">Создать профиль</a>
                </div>
            </div>
        </div>
    `;

    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const password = document.getElementById('password').value;

        try {
            // Твой запрос на бэк
            const res = await request('/auth/sign-in', 'POST', { name, password });

            // Сохраняем ID и идем дальше (как мы и делали)
            const userRes = await request('/api/user/get', 'GET');
            if (userRes && userRes.data && userRes.data.user) {
                localStorage.setItem('userId', userRes.data.user.id);
            }

            window.location.hash = '#projects';
        } catch (err) {
            alert("Ошибка входа: " + err.message);
        }
    });
}