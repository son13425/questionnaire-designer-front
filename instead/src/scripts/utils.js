// Функция проверки ответа сервера
export const checkResponse = (result) => {
    if (result.ok) {
        return result.json();
    }
    return Promise.reject(`Ошибка: ${result.status}`);
}

// Функция поиска моего лайка в массиве лайков
export const searchMyLike = (array, myUserId) => {
    const myLike = array.find((element) => {return element._id === myUserId})
    if (myLike) {
        return true;
    } else {
        return false;
    }
}

// Функция визуализации загрузки
export const renderLoading = (isLoading, buttonElement) => {
    if (isLoading) {
        buttonElement.textContent = 'Сохранение...'
    } else {
        buttonElement.textContent = 'Сохранить'
    }
}