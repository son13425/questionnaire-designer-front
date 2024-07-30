// Функция проверки ответа сервера
export const checkResponse = (result) => {
    if (result.ok) {
        return result.json();
    }
    else if (result.status === 401) {
        window.location.replace('/');
    } else {
        alert('Что-то пошло не так, попробуйте пповторить позже...')
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