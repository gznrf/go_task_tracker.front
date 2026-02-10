import { request } from '../api.js';

export async function renderBoards(container, projectId) {
    // Чистим контейнер и рисуем скелет
    container.innerHTML = `
        <div class="projects-header">
            <div class="breadcrumb">
                <a href="#projects">← Проекты</a> / <span>Проект #${projectId}</span>
            </div>
            <h1>Доски проекта</h1>
            <button id="add-board-btn" class="btn-add">+ Новая доска</button>
        </div>
        
        <div id="boards-list" class="projects-grid">
            <p class="loading-text">Загрузка досок...</p>
        </div>

        <!-- Модалка создания доски -->
        <div id="board-modal" class="modal-overlay hidden">
            <div class="modal-content">
                <h2>Создать доску</h2>
                <form id="create-board-form">
                    <input type="text" id="b-name" placeholder="Название доски (например: В разработке)" required>
                    <div class="modal-actions">
                        <button type="button" id="close-board-modal" class="btn-cancel">Отмена</button>
                        <button type="submit" class="btn-add">Создать</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    const listContainer = document.getElementById('boards-list');
    const modal = document.getElementById('board-modal');

    // Логика модалки
    document.getElementById('add-board-btn').onclick = () => modal.classList.remove('hidden');
    document.getElementById('close-board-modal').onclick = () => modal.classList.add('hidden');

    // ФУНКЦИЯ ЗАГРУЗКИ ДОСОК
    async function loadBoards() {
        try {
            // Твоя ручка GET /api/project/board/getByProjectId
            // Передаем ProjectId в теле, как ты и просил
            const response = await request('/api/project/board/getByProjectId', 'POST', {
                project_id: parseInt(projectId)
            });

            const boards = (response && response.data && response.data.boards_list) || [];

            if (boards.length === 0) {
                listContainer.innerHTML = `<div class="empty-state"><p>В этом проекте еще нет досок.</p></div>`;
                return;
            }

            listContainer.innerHTML = boards.map(board => `
                <div class="project-card board-card" data-id="${board.id}">
                    <div class="card-content">
                        <div class="board-icon">📋</div>
                        <h3>${escapeHtml(board.name)}</h3>
                    </div>
                    <div class="meta">ID: ${board.id}</div>
                </div>
            `).join('');

            // При клике на доску — переходим на Канбан (это будет следующий этап)
            document.querySelectorAll('.board-card').forEach(card => {
                card.onclick = () => {
                    window.location.hash = `#board-${card.dataset.id}`;
                };
            });

        } catch (err) {
            listContainer.innerHTML = `<p class="error-text">Ошибка: ${err.message}</p>`;
        }
    }

    // ФУНКЦИЯ СОЗДАНИЯ ДОСКИ
    document.getElementById('create-board-form').onsubmit = async (e) => {
        e.preventDefault();
        const name = document.getElementById('b-name').value;

        try {
            await request('/api/project/board/create', 'POST', {
                project_id: parseInt(projectId),
                name: name
            });
            modal.classList.add('hidden');
            e.target.reset();
            loadBoards();
        } catch (err) {
            alert("Не удалось создать доску: " + err.message);
        }
    };

    loadBoards();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}