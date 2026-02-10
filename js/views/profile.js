import { request } from '../api.js';

export async function renderProfile(container) {
    container.innerHTML = `<p class="loading-text">Загрузка профиля...</p>`;

    // Берем ID текущего юзера из памяти
    const currentUserId = localStorage.getItem('userId');

    if (!currentUserId) {
        container.innerHTML = `<p class="error-text">Ошибка: ID пользователя не найден. Перезайдите в систему.</p>`;
        return;
    }

    try {
        // Твоя ручка GET /api/user/getById
        // Так как ты просил всё через POST/тело запроса, шлем так:
        const res = await request('/api/user/getById', 'POST', {
            id: parseInt(currentUserId)
        });

        // Предполагаю структуру ответа { data: { user: { id: 1, name: "admin" } } }
        const user = res && res.data && res.data.user;

        if (!user) {
            throw new Error("Пользователь не найден в базе");
        }

        container.innerHTML = `
            <div class="auth-card" style="max-width: 500px; text-align: left;">
                <h1 style="text-align: center; margin-bottom: 20px;">Мой профиль</h1>
                <form id="profile-form">
                    <label style="display:block; margin-bottom:5px; color:var(--text-muted);">Ваш уникальный ID</label>
                    <input type="text" value="${user.id}" disabled style="background: #07090d; opacity: 0.6;">
                    
                    <label style="display:block; margin-bottom:5px; margin-top:15px;">Имя пользователя (Логин)</label>
                    <input type="text" id="prof-name" value="${user.name}" required>
                    
                    <div style="margin-top: 20px; padding: 15px; background: rgba(47, 129, 247, 0.1); border-radius: 8px;">
                        <p style="font-size: 0.85rem; color: var(--accent);">
                            ℹ️ Это имя используется для входа в систему и отображения в задачах.
                        </p>
                    </div>

                    <button type="submit" class="btn-add" style="margin-top: 25px;">Обновить данные</button>
                </form>
            </div>
        `;

        // Логика обновления
        document.getElementById('profile-form').onsubmit = async (e) => {
            e.preventDefault();
            const newName = document.getElementById('prof-name').value;

            try {
                // Твоя ручка PATCH /api/user/update
                await request('/api/user/update', 'PATCH', {
                    id: user.id,
                    name: newName
                });
                alert("Имя успешно изменено!");
                // Обновляем экран, чтобы увидеть актуальные данные
                renderProfile(container);
            } catch (err) {
                alert("Ошибка при обновлении: " + err.message);
            }
        };

    } catch (err) {
        console.error(err);
        container.innerHTML = `
            <div class="error-text">
                <p>Не удалось загрузить данные профиля.</p>
                <small>${err.message}</small>
                <br><br>
                <button onclick="window.location.reload()" class="btn-cancel">Попробовать снова</button>
            </div>`;
    }
}