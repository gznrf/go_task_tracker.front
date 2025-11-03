export function getCookie(name) {
    const value = `; ${document.cookie}`; // добавляем ; чтобы искать точное имя
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
}
