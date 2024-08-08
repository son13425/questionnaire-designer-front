// Функция проверки ответа сервера
export const checkResponse = (result) => {
    if (result.ok) {
        return result.json();
    }
    else if (result.status === 401) {
        window.location.replace('/');
    } else {
        alert('Что-то пошло не так, попробуйте повторить позже...')
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

// Функция сортировки массива
export const sortingListObjects = (list, attribut) => {
    list.sort(function(a, b) {
        return a.attribut - b.attribut;
    });
    return list;
}