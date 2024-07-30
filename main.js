// Импорт файлов
import { postInputUser } from '/src/scripts/api.js'
import { renderLoading, checkResponse } from '/src/scripts/utils.js';

// Импорт стилей
import './style.css'

// Импорт картинок
import centralIcon from './src/images/logo-login.png'
document.querySelector('#central-icon').src = centralIcon

// Переменные
const formNode = document.querySelector('.login-form');


// Обработка отправки данныых для входа
function handleFormInputSabmit(evt) {
    evt.preventDefault();
    renderLoading(true, evt.target.querySelector('.login-button-in'));
    const data = new FormData(formNode);
    const bodyMessage = {};
    Array.from(data.entries()).forEach((item) => {
        bodyMessage[item[0]] = item[1];
    })
    postInputUser(bodyMessage['username'], bodyMessage['password'])
        .then(res =>  checkResponse(res))
        .then((res) => {
            window.localStorage.setItem('ef_token', res['access_token'])
            renderLoading(false, evt.target.querySelector('.login-button-in'));
            window.location.replace('/src/ankets/');
        })
        .catch((err) => {
            console.log(err)
        })
}


// Слушатель события отправки формы
formNode.addEventListener('submit', handleFormInputSabmit)
