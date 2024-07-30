// Импорт файлов
import { getOrganizationsList, getPositionsList, postCreateUser } from './api.js';
import { renderLoading, checkResponse } from '/src/scripts/utils.js';

// Импорт стилей
import '/src/index.css';
import './index.css';

// Импорт картинок
import footerLogo from '/src/images/ias-logo-3.png';
import headerLogo from '/src/images/logo-med.png';
document.querySelector('#footer-logo').src = footerLogo;
document.querySelector('#header-logo').src = headerLogo;

// Глобальные переменные
let dictOrganizations = {};
let dictPositions = {};

// Переменные
const placeListOrganizations = document.querySelector('#organizations');
const placeListPositions = document.querySelector('#positions');
const formNode = document.querySelector('.form-reg');


// Функция создания элемента списка
function createElementList(item) {
    const elementTemplate = document.querySelector('#list-element').content;
    const listElement = elementTemplate.querySelector('.element').cloneNode(true);
    listElement.setAttribute('value', `${item}`)
    return listElement
}


// Вывод полей со списками
Promise.all([getOrganizationsList(), getPositionsList()])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(([organisationData, positionData, goalData]) => {
        // вывод поля Организация
        organisationData.organizations.forEach((item) => {
            const elementList = createElementList(item.name);
            placeListOrganizations.append(elementList);
            dictOrganizations[item.name] = item.id;
        });
        // вывод поля Должности
        positionData.positions.forEach((item) => {
            const elementList = createElementList(item.name);
            placeListPositions.append(elementList);
            dictPositions[item.name] = item.id;
        });
    })
    .catch((err) => {
        console.log(err)
    })


// Обработка отправки данныых на регистрацию
function handleFormRegistrationSabmit(evt) {
    evt.preventDefault();
    renderLoading(true, evt.target.querySelector('.button'));
    const data = new FormData(formNode);
    const bodyMessage = {
        "is_active": true,
        "is_superuser": false,
        "is_verified": false,
    };
    Array.from(data.entries()).forEach((item) => {
        bodyMessage[item[0]] = item[1];
    })
    bodyMessage['role'] = 1;
    bodyMessage['organization'] = dictOrganizations[bodyMessage['organization']];
    bodyMessage['position'] = dictPositions[bodyMessage['position']];
    postCreateUser(bodyMessage)
        .then(res =>  checkResponse(res))
        .then((res) => {
            renderLoading(false, evt.target.querySelector('.button'));
            window.location.replace('/');
        })
        .catch((err) => {
            console.log(err)
        })
}


// Слушатель события отправки формы
// formNode.addEventListener('submit', handleFormRegistrationSabmit)