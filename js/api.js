const BASE_URL = 'http://localhost:3322';

export async function request(url, method = 'GET', body = null) {
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        // КРИТИЧНО: разрешаем браузеру отправлять и получать куки
        credentials: 'include'
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${BASE_URL}${url}`, config);

        // Если 401 — значит кука протухла или её нет
        if (response.status === 401) {
            if (window.location.hash !== '#login') {
                window.location.hash = '#login';
            }
            return;
        }

        // Если ответ пустой (например, Logout 204), не пытаемся парсить JSON
        if (response.status === 204) return null;

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Ошибка сервера');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}