export function getCookie(name) {
    const value = `; ${document.cookie}`; // добавляем ; чтобы искать точное имя
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
}

export function deleteAllCookies() {
    const cookies = document.cookie.split(";");

    console.log(cookies)

    for (let cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
}