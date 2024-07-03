// базовый конфиг для подключения к серверу
export const baseConfig = {
    baseUrl: 'https://nomoreparties.co/v1/wff-cohort-15/',
    headers: {
        authorization: '53680752-ffe0-4b4e-8a8e-da3b12fcaa3b',
        'Content-Type': 'application/json'
    }
}


// get-запрос на загрузку данных о пользователе
export const getUserInfo = () => {
    return fetch(`${baseConfig.baseUrl}users/me`, {
        headers: baseConfig.headers
    })
}


// patch-запрос на редактирование данных о пользователе
export const patchUserInfo = (nameUserNew, aboutUserNew) => {
    return fetch(`${baseConfig.baseUrl}users/me`, {
        method: 'PATCH',
        headers: baseConfig.headers,
        body: JSON.stringify({
            name: nameUserNew,
            about: aboutUserNew
        })
    })
}


// patch-запрос на обновление аватара пользователя
export const patchUserImage = (newUserImage) => {
    return fetch(`${baseConfig.baseUrl}users/me/avatar`, {
        method: 'PATCH',
        headers: baseConfig.headers,
        body: JSON.stringify({
            avatar: newUserImage
        })
    })
}


// get-запрос на загрузку карточек
export const getInitialCards = () => {
    return fetch(`${baseConfig.baseUrl}cards`, {
        headers: baseConfig.headers
    })
}


// post-запрос на создание карточки
export const postCreateCard = (postName, postLink) => {
    return fetch(`${baseConfig.baseUrl}cards`, {
        method: 'POST',
        headers: baseConfig.headers,
        body: JSON.stringify({
            name: postName,
            link: postLink
        })
    })
}


// delete-запрос на удаление карточки
export const deleteMyCard = (cardId) => {
    return fetch(`${baseConfig.baseUrl}cards/${cardId}`, {
        method: 'DELETE',
        headers: baseConfig.headers
    })
}


// put-запрос на лайк карточки
export const putLikeCard = (cardId) => {
    return fetch(`${baseConfig.baseUrl}cards/likes/${cardId}`, {
        method: 'PUT',
        headers: baseConfig.headers
    })
}


// delete-запрос на удаление лайкa карточки
export const deleteLikeCard = (cardId) => {
    return fetch(`${baseConfig.baseUrl}cards/likes/${cardId}`, {
        method: 'DELETE',
        headers: baseConfig.headers
    })
}
