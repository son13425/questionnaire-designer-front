// базовый конфиг для подключения к серверу
import { baseConfig } from '/src/scripts/api.js'


// get-запрос на загрузку данных из справочника Организации
export const getOrganizationsList = () => {
    return fetch(`${baseConfig.baseUrl}organization/`, {
        headers: baseConfig.headers
    })
}


// get-запрос на загрузку данных из справочника Должности
export const getPositionsList = () => {
    return fetch(`${baseConfig.baseUrl}position/`, {
        headers: baseConfig.headers
    })
}


// get-запрос на загрузку данных из справочника Цели регистрации
export const getGoalsList = () => {
    return fetch(`${baseConfig.baseUrl}registration_goal/`, {
        headers: baseConfig.headers
    })
}


// post-запрос на создание пользователя
export const postCreateUser = (bodyMessage) => {
    return fetch(`${baseConfig.baseUrl}auth/register`, {
        method: 'POST',
        headers: baseConfig.headers,
        body: JSON.stringify(bodyMessage)
    })
}