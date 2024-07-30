// Импорт файлов
import { getGroupAnkets } from '/src/scripts/api.js';

// Импорт стилей
import '/src/index.css';
import '/src/ankets/index.css';

// Импорт картинок
import footerLogo from '/src/images/ias-logo-3.png';
import headerLogo from '/src/images/logo-med.png';
import menuIcon from '/src/images/menu-icon.svg';
import userAvatar from '/src/images/user-icon.svg';
import { checkResponse } from '../scripts/utils';

document.querySelector('#footer-logo').src = footerLogo;
document.querySelector('#header-logo').src = headerLogo;
document.querySelector('#menu-icon').src = menuIcon;
document.querySelector('#avatar').src = userAvatar;


// Переменные
const openFormButton = document.querySelector('.open');
const groupAnketList = document.querySelector('.groups__list');
const titleElement = document.querySelector('title');
const headerElement = document.querySelector('.page-title-text');
const buttonsList = document.querySelector('.button__list');

// Функция отображения кнопок редактирования выбранной анкеты
function createButtons() {
    const oldButton = document.querySelector('#button-list');
    if (oldButton) {return};
    const buttonElement = document.querySelector('#template-button');
    const item = buttonElement.content.cloneNode(true);
    buttonsList.append(item);
}

// Функция создания элемента группы в списке анкет
function createGroup(element) {
    const groupLineTemplate = document.querySelector('#group-template').content;
    const groupLineElement = groupLineTemplate.querySelector('.anket-blocks').cloneNode(true);

    const groupName = groupLineElement.querySelector('.heading');
    groupName.textContent = element.label;
    groupName.id = element.id;
    return groupLineElement;
}

// Функция создания элемента анкеты в списке анкет
function createAnket(element) {
    const anketLineTemplate = document.querySelector('#template-anket-li').content;
    // элемент анкеты
    const anketLineElement = anketLineTemplate.querySelector('.anket-blocks-list-item').cloneNode(true);
    anketLineElement.id = element.uuid;
    // выводит id анкеты
    anketLineElement.querySelector('.anket-id').textContent = `${element.id}.`;
    // выводит статус анкеты
    const anketStatus = anketLineElement.querySelector('.anket-status');
    if (element.is_active) {
        anketStatus.textContent = 'on';
        anketStatus.classList.add('badge-success');
    } else {
        anketStatus.textContent = 'off';
        anketStatus.classList.add('badge-off');
    }
    // выводит название анкеты
    anketLineElement.querySelector('.anket-label').textContent = element.label;
    // выводит замок
    if (element.is_open) {
        anketLineElement.querySelector('.badge-lock-closed').classList.add('badge-lock-closed-off');
    }
    return anketLineElement
}

// Функция выделения анкеты
function highlightAnket(uuid) {
    const anketActive = document.getElementById(uuid);
    const labelAnket = anketActive.querySelector('.anket-label').textContent;
    if (anketActive) {
        anketActive.classList.add('anket-blocks-list-item-active');
        titleElement.textContent = `Доступ к форме '${labelAnket}' | Узел сбора информации | НЦ МБР`;
        headerElement.textContent = `Доступ к форме '${labelAnket}'`;
    }
}

// Функция снятия выделения с анкеты
function deHighlightAnket() {
    const isAnketActive = window.localStorage.getItem('select_anket');
    if (isAnketActive) {
        const anketActive = document.getElementById(isAnketActive);
        if (anketActive) {
            anketActive.classList.remove('anket-blocks-list-item-active');
        }
    }
}

// Функция выбора анкеты
function selectAnket(evt) {
    const targetElement = evt.target;
    const parentElement = targetElement.closest('.anket-blocks-list-item');
    if (parentElement === null) {
        evt.stopPropagation();
        return
    };
    deHighlightAnket();
    window.localStorage.setItem('select_anket', parentElement.id);
    highlightAnket(parentElement.id);
    createButtons();
}

// Вывод исходных данных анкет
function initialAnkets() {
    getGroupAnkets()
        .then(res => checkResponse(res))
        .then((res) => {
            // вывод групп анкет
            res.forEach((item) => {
                const groupLine = createGroup(item.group);
                groupAnketList.append(groupLine);
                // вывод анкет, принадлежащих группе
                item.ankets.forEach((anket) => {
                    const anketLine = createAnket(anket);
                    groupAnketList.append(anketLine);
                });
            });
            const isAnketActive = window.localStorage.getItem('select_anket');
            if (isAnketActive) {
                highlightAnket(isAnketActive);
                createButtons();
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }

initialAnkets();

// Слушатель выбора анкеты
groupAnketList.addEventListener('click', selectAnket);

// // Функция открытия формы
// function handleOpenForm() {
//     window.location.replace('/src/form/');
// }

// // Слушатель клика Открыть форму
// openFormButton.addEventListener('click', handleOpenForm)