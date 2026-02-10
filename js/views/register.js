import { request } from '../api.js';

export function renderRegister(container) {
    container.innerHTML = `
        <div class="auth-wrapper">
            <div class="auth-card">
                <span class="auth-logo">🚀</span>
                <h1>Регистрация</h1>
                <p class="subtitle">Создайте свой профиль в TrackerPro</p>
                
                <form id="register-form" class="auth-form">
                    <label for="reg-name">Имя пользователя</label>
                    <input type="text" id="reg-name" placeholder="Придумайте логин" required autocomplete="username">
                    
                    <label for="reg-password">Пароль</label>
                    <input type="password" id="reg-password" placeholder="Минимум 6 символов" required autocomplete="new-password">
                    
                    <button type="submit" class="btn-login">Создать аккаунт</button>
                </form>

                <div class="auth-footer">
                    Уже есть аккаунт? <a href="#login">Войти в систему</a>
                </div>
            </div>
        </div>
    `;

    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('reg-name').value;
        const password = document.getElementById('reg-password').value;

        try {
            // Твой роут на бэке: POST /auth/sign-up
            await request('/auth/sign-up', 'POST', { name, password });

            alert("Регистрация прошла успешно! Теперь войдите под своими данными.");

            // После успешной реги кидаем на логин
            window.location.hash = '#login';

        } catch (err) {
            console.error("Ошибка регистрации:", err);
            alert("Не удалось зарегистрироваться: " + err.message);
        }
    });
}