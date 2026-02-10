import { request } from '../api.js';

export async function renderProjects(container) {
    container.innerHTML = `
        <div class="projects-header">
            <h1>Мои проекты</h1>
            <button id="add-project-btn" class="btn-add">+ Новый проект</button>
        </div>
        <div id="projects-list" class="projects-grid">
            <p class="loading-text">Загрузка проектов...</p>
        </div>

        <!-- Разметка модального окна (скрыта по умолчанию) -->
        <div id="modal-overlay" class="modal-overlay hidden">
            <div class="modal-content">
                <h2>Создать проект</h2>
                <form id="create-project-form">
                    <input type="text" id="p-name" placeholder="Название проекта" required>
                    <textarea id="p-desc" placeholder="Описание проекта (необязательно)"></textarea>
                    <div class="modal-actions">
                        <button type="button" id="close-modal" class="btn-cancel">Отмена</button>
                        <button type="submit" class="btn-add">Создать проект</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    const listContainer = document.getElementById('projects-list');
    const modal = document.getElementById('modal-overlay');

    // --- ЛОГИКА МОДАЛКИ ---
    document.getElementById('add-project-btn').onclick = () => modal.classList.remove('hidden');
    document.getElementById('close-modal').onclick = () => modal.classList.add('hidden');

    // Закрытие по клику вне окна
    modal.onclick = (e) => { if(e.target === modal) modal.classList.add('hidden'); };

    // --- ЗАГРУЗКА СПИСКА ---
    async function loadProjects() {
        try {
            const response = await request('/api/project/getByUserId');
            const projects = (response && response.data && response.data.projects_list) || [];

            if (projects.length === 0) {
                listContainer.innerHTML = `<div class="empty-state"><p>У вас пока нет проектов.</p></div>`;
                return;
            }

            listContainer.innerHTML = projects.map(p => `
                <div class="project-card" data-id="${p.id}">
                    <div class="card-content">
                        <h3>${escapeHtml(p.name)}</h3>
                        <p>${escapeHtml(p.description || '')}</p>
                    </div>
                    <div class="meta">ID: ${p.id}</div>
                </div>
            `).join('');

            // Переход на доски проекта
            document.querySelectorAll('.project-card').forEach(card => {
                card.onclick = () => window.location.hash = `#project-${card.dataset.id}`;
            });
        } catch (err) {
            listContainer.innerHTML = `<p class="error-text">Ошибка: ${err.message}</p>`;
        }
    }

    // --- СОЗДАНИЕ ПРОЕКТА ---
    document.getElementById('create-project-form').onsubmit = async (e) => {
        e.preventDefault();
        const name = document.getElementById('p-name').value;
        const description = document.getElementById('p-desc').value;

        try {
            await request('/api/project/create', 'POST', { name, description });
            modal.classList.add('hidden'); // Закрываем модалку
            e.target.reset(); // Очищаем форму
            loadProjects(); // Перезагружаем список проектов
        } catch (err) {
            alert("Не удалось создать проект: " + err.message);
        }
    };

    loadProjects(); // Запускаем первичную загрузку
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}