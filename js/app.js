import { initRouter } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
    initRouter();

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.hash = '#login';
    });
});