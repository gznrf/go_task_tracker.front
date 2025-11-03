export async function loadComponents() {
    const elements = document.querySelectorAll("[data-include]");
    for (const el of elements) {
        const file = el.getAttribute("data-include");
        try {
            const res = await fetch(file);
            el.innerHTML = await res.text();
        } catch (e) {
            console.error(`Ошибка:`, e);
        }

    }
}