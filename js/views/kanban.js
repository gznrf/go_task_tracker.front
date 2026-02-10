import { request } from '../api.js';

// Глобальная переменная внутри модуля для хранения списка юзеров
let projectUsers = [];

export async function renderKanban(container, boardId) {
    container.innerHTML = `
        <div class="projects-header">
            <div class="breadcrumb">
                <a href="#projects">Проекты</a> / <span>Доска #${boardId}</span>
            </div>
            <button id="add-column-btn" class="btn-add">+ Колонку</button>
        </div>
        
        <div id="kanban-board" class="kanban-board"></div>

        <!-- Модалка задачи -->
        <div id="task-modal" class="modal-overlay hidden">
            <div class="modal-content">
                <h2 id="modal-title">Задача</h2>
                <form id="task-form">
                    <input type="hidden" id="t-id">
                    <input type="hidden" id="t-col-id">
                    
                    <label>Название</label>
                    <input type="text" id="t-name" placeholder="Название задачи" required>
                    
                    <label>Описание</label>
                    <textarea id="t-desc" placeholder="Что именно нужно сделать?"></textarea>
                    
                    <label>Исполнитель</label>
                    <select id="t-executor" required>
                        <!-- Сюда JS подставит список юзеров -->
                    </select>

                    <div class="modal-actions">
                        <button type="button" id="delete-task-btn" class="btn-cancel" style="color:var(--error); border-color:var(--error); display:none;">Удалить</button>
                        <div style="flex-grow:1"></div>
                        <button type="button" id="close-task-modal" class="btn-cancel">Отмена</button>
                        <button type="submit" class="btn-add">Сохранить</button>
                    </div>
                </form>
            </div>
        </div>
        
        <!-- Модалка колонки (без изменений) -->
        <div id="col-modal" class="modal-overlay hidden">
            <div class="modal-content">
                <h2>Новая колонка</h2>
                <form id="col-form">
                    <input type="text" id="col-name" placeholder="Название" required>
                    <div class="modal-actions">
                        <button type="button" id="close-col-modal" class="btn-cancel">Отмена</button>
                        <button type="submit" class="btn-add">Создать</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    const boardElement = document.getElementById('kanban-board');
    const taskModal = document.getElementById('task-modal');
    const executorSelect = document.getElementById('t-executor');
    // --- ФУНКЦИИ УДАЛЕНИЯ ---

    // --- 1. ЗАГРУЗКА ВСЕХ ПОЛЬЗОВАТЕЛЕЙ ---
    // 1. Загрузка юзеров в выпадающий список
    async function loadUsers() {
        try {
            const res = await request('/api/user/get', 'GET');
            // Проверь структуру! Если бэк отдает { data: { users_list: [...] } }
            const users = (res && res.data && res.data.users_list) || [];

            const executorSelect = document.getElementById('t-executor');

            // Очищаем и заполняем
            executorSelect.innerHTML = users.map(u => `
            <option value="${u.id}">${u.name}</option>
        `).join('');

            // Устанавливаем текущего юзера как исполнителя по умолчанию
            const myId = localStorage.getItem('userId');
            if (myId) {
                executorSelect.value = myId;
            }
        } catch (err) {
            console.error("Юзеры не загрузились:", err);
        }
    }


    async function deleteTask(taskId, columnId) {
        if (!confirm("Удалить задачу?")) return;
        try {
            await request('/api/project/board/column/task/delete', 'DELETE', { id: parseInt(taskId) });
            taskModal.classList.add('hidden');
            fetchTasks(columnId);
        } catch (err) { alert(err.message); }
    }

    async function deleteColumn(columnId) {
        if (!confirm("Удалить колонку со всеми задачами?")) return;
        try {
            await request('/api/project/board/column/delete', 'DELETE', { id: parseInt(columnId) });
            loadBoard();
        } catch (err) { alert(err.message); }
    }

    // --- DRAG AND DROP ЛОГИКА ---

    function initDragAndDrop(taskElement, taskData) {
        taskElement.draggable = true;
        taskElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', JSON.stringify(taskData));
            taskElement.classList.add('dragging');
        });
        taskElement.addEventListener('dragend', () => taskElement.classList.remove('dragging'));
    }

    function initColumnDropZone(columnElement, columnId) {
        columnElement.addEventListener('dragover', (e) => e.preventDefault());
        columnElement.addEventListener('drop', async (e) => {
            e.preventDefault();
            const taskData = JSON.parse(e.dataTransfer.getData('text/plain'));

            if (taskData.column_id === columnId) return; // Не переносим в ту же колонку

            try {
                // Обновляем задачу через UpdateRequest, меняя только ColumnId
                await request('/api/project/board/column/task/update', 'PATCH', {
                    ...taskData,
                    column_id: parseInt(columnId)
                });
                loadBoard(); // Перерисовываем всё для простоты
            } catch (err) { alert("Ошибка переноса: " + err.message); }
        });
    }

    // --- РЕНДЕРИНГ ---

    async function fetchTasks(columnId) {
        const taskList = document.getElementById(`tasks-col-${columnId}`);
        try {
            const res = await request('/api/project/board/column/task/getByColumnId', 'POST', { column_id: parseInt(columnId) });
            const tasks = (res && res.data && res.data.tasks_list) || [];

            taskList.innerHTML = tasks.length === 0 ? '<div class="empty-tasks">Пусто</div>' : '';

            tasks.forEach(task => {
                const card = document.createElement('div');
                card.className = 'task-card';
                card.innerHTML = `
                    <div class="task-num">#${task.number}</div>
                    <h4>${escapeHtml(task.name)}</h4>
                    <p>${escapeHtml(task.description || '')}</p>
                `;

                // Клик для редактирования
                card.onclick = () => openTaskModal(task);

                // Инициализация Drag-n-Drop для карточки
                initDragAndDrop(card, task);

                taskList.appendChild(card);
            });
        } catch (err) { taskList.innerHTML = 'error'; }
    }

    async function loadBoard() {
        boardElement.innerHTML = '<p class="loading-text">Загрузка...</p>';
        try {
            const res = await request('/api/project/board/column/getByBoardId', 'POST', { board_id: parseInt(boardId) });
            const columns = (res && res.data && res.data.columns_list) || [];
            boardElement.innerHTML = '';

            columns.forEach(col => {
                const colDiv = document.createElement('div');
                colDiv.className = 'kanban-column';
                colDiv.innerHTML = `
                    <div class="column-header">
                        <h3>${escapeHtml(col.name)}</h3>
                        <div class="col-actions">
                            <button class="add-task-inline" data-id="${col.id}">+</button>
                            <button class="del-col-btn" data-id="${col.id}">×</button>
                        </div>
                    </div>
                    <div class="task-list" id="tasks-col-${col.id}"></div>
                `;
                boardElement.appendChild(colDiv);
                initColumnDropZone(colDiv, col.id);
                fetchTasks(col.id);
            });

            // Кнопки в колонках
            document.querySelectorAll('.add-task-inline').forEach(btn => {
                btn.onclick = (e) => { e.stopPropagation(); openTaskModal({ column_id: btn.dataset.id }); };
            });
            document.querySelectorAll('.del-col-btn').forEach(btn => {
                btn.onclick = (e) => { e.stopPropagation(); deleteColumn(btn.dataset.id); };
            });

        } catch (err) { boardElement.innerHTML = err.message; }
    }

    // --- МОДАЛКИ ---

    function openTaskModal(task = {}) {
        const isEdit = !!task.id;
        const currentUserId = parseInt(localStorage.getItem('userId')) || 1;

        document.getElementById('modal-title').innerText = isEdit ? 'Редактировать задачу' : 'Новая задача';
        document.getElementById('t-id').value = task.id || '';
        document.getElementById('t-col-id').value = task.column_id || '';
        document.getElementById('t-name').value = task.name || '';
        document.getElementById('t-desc').value = task.description || '';

        // Выбираем текущего исполнителя в списке
        executorSelect.value = task.executor_id || currentUserId;

        const delBtn = document.getElementById('delete-task-btn');
        delBtn.style.display = isEdit ? 'block' : 'none';
        if (isEdit) delBtn.onclick = () => deleteTask(task.id, task.column_id);

        taskModal.classList.remove('hidden');
    }

    // 2. Сабмит формы
    document.getElementById('task-form').onsubmit = async (e) => {
        e.preventDefault();

        // Получаем ID создателя из памяти
        const creatorId = parseInt(localStorage.getItem('userId'));

        // Получаем ID исполнителя из селекта
        const executorId = parseInt(document.getElementById('t-executor').value);

        // ВАЖНО: Если вдруг они NaN или 0, стопаем и ругаемся
        if (!creatorId || !executorId) {
            alert("Ошибка: Не определен ID создателя или исполнителя! Перезайдите в аккаунт.");
            return;
        }

        const taskData = {
            column_id: parseInt(document.getElementById('t-col-id').value),
            creator_id: creatorId,    // Твой ID
            executor_id: executorId,  // ID из списка
            number: 1,                // Заглушка
            name: document.getElementById('t-name').value,
            description: document.getElementById('t-desc').value
        };

        console.log("Финальный объект перед отправкой:", taskData);

        try {
            const id = document.getElementById('t-id').value;
            if (id) {
                await request('/api/project/board/column/task/update', 'PATCH', { ...taskData, id: parseInt(id) });
            } else {
                await request('/api/project/board/column/task/create', 'POST', taskData);
            }
            document.getElementById('task-modal').classList.add('hidden');
            fetchTasks(taskData.column_id);
        } catch (err) {
            alert("Ошибка бэка: " + err.message);
        }
    };

    // Закрытие модалок
    document.getElementById('close-task-modal').onclick = () => taskModal.classList.add('hidden');
    document.getElementById('add-column-btn').onclick = () => colModal.classList.remove('hidden');
    document.getElementById('close-col-modal').onclick = () => colModal.classList.add('hidden');

    document.getElementById('col-form').onsubmit = async (e) => {
        e.preventDefault();
        try {
            await request('/api/project/board/column/create', 'POST', { board_id: parseInt(boardId), name: document.getElementById('col-name').value });
            colModal.classList.add('hidden');
            loadBoard();
        } catch (err) { alert(err.message); }
    };

    // Запуск
    await loadUsers(); // Сначала грузим юзеров
    loadBoard();   // Потом доску
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}