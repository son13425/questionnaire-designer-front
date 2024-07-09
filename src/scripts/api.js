// базовый конфиг для подключения к серверу
export const baseConfig = {
    baseUrl: 'http://localhost:8000/',
    headers: {
        'Content-Type': 'application/json'
    }
}


// post-запрос на авторизацию
export const postInputUser = (name, pass) => {
    var param = new URLSearchParams('username='+name+'&password='+pass);
    return fetch(`${baseConfig.baseUrl}auth/jwt/login`, {
        method: 'POST',
        body: param
    })
}
