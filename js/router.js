import {renderLogin} from './views/login.js';
import {renderProjects} from './views/projects.js';
import {renderBoards} from './views/boards.js';
import {renderKanban} from './views/kanban.js';
import {renderProfile} from "./views/profile.js";
import {renderRegister} from "./views/register.js";

export function initRouter() {
    window.addEventListener('hashchange', route);
    route();
}

function route() {
    const hash = window.location.hash || '#login';
    const app = document.getElementById('app');
    const navbar = document.getElementById('navbar');

    if (hash === '#login' || hash === '#register') {
        navbar.classList.add('hidden');
    } else {
        navbar.classList.remove('hidden');
    }

    if (hash === '#login') {
        renderLogin(app);
    } else if (hash === '#register') {
        renderRegister(app);
    }else if (hash === '#profile') {
        renderProfile(app);
    }else if (hash === '#projects') {
        renderProjects(app);
    } else if (hash.startsWith('#project-')) {
        // Извлекаем ID проекта из хеша (например #project-5 -> 5)
        const projectId = hash.split('-')[1];
        renderBoards(app, projectId); // Вызываем функцию отрисовки досок
    } else if (hash.startsWith('#board-')) {
        const boardId = hash.split('-')[1];
        renderKanban(app, boardId);
    } else {
        window.location.hash = '#login';
    }
}