// текущий jwt-токен
const token = ` Bearer ${window.localStorage.getItem('ef_token')}`;

// базовый конфиг для подключения к серверу
export const baseConfig = {
    baseUrl: 'http://84.201.154.109:8000/',
    // baseUrl: 'http://0.0.0.0:8800/',
    headers: {
        'Content-Type': 'application/json',
        authorization: token
    }
}

// post-запрос на авторизацию
export const postInputUser = (name, pass) => {
    var param = new URLSearchParams('username='+name+'&password='+pass);
    return fetch(`${baseConfig.baseUrl}api/auth/jwt/login`, {
        method: 'POST',
        body: param
    })
}

// get-запрос на загрузку списка групп анкет
export const getGroupsAnketList = () => {
    return fetch(`${baseConfig.baseUrl}groups/`, {
        headers: baseConfig.headers
    })
}

// get-запрос на загрузку исходных данных списка анкет
export const getGroupAnkets = () => {
    return fetch(`${baseConfig.baseUrl}ankets/`, {
        headers: baseConfig.headers
    })
}

// get-запрос на загрузку объекта анкеты по uuid
export const getAnket = (uuid) => {
    return fetch(`${baseConfig.baseUrl}ankets/${uuid}`, {
        headers: baseConfig.headers
    })
}

// post-запрос на создание анкеты
export const postCreateAnket = (dataAnket) => {
    return fetch(`${baseConfig.baseUrl}ankets/`, {
        method: 'POST',
        headers: baseConfig.headers,
        body: JSON.stringify(dataAnket)
    })
}

// patch-запрос на обновление анкеты
export const patchAnket = (uuid, dataAnket) => {
    return fetch(`${baseConfig.baseUrl}ankets/${uuid}`, {
        method: 'PATCH',
        headers: baseConfig.headers,
        body: JSON.stringify(dataAnket)
    })
}
