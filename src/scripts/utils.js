// Функция проверки ответа сервера
export const checkResponse = (result) => {
    if (result.ok) {
        return result.json();
    }
    return Promise.reject(`Ошибка: ${result.status}`);
}

// Функция визуализации загрузки
export const renderLoading = (isLoading, buttonElement) => {
    if (isLoading) {
        buttonElement.textContent = 'Ожидайте...'
    } else {
        buttonElement.textContent = 'Отправить'
    }
}