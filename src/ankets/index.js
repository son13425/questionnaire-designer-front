// Импорт файлов
import { getGroupAnkets, postCreateAnket, getGroupsAnketList, getAnket, patchAnket } from '/src/scripts/api.js';
import { popupSelectors, openPopup, closePopup } from '/src/scripts/modals.js';
import { checkResponse, renderLoading } from '../scripts/utils';

// Импорт стилей
import '/src/index.css';
import '/src/ankets/index.css';

// Импорт картинок
import footerLogo from '/src/images/ias-logo-3.png';
import headerLogo from '/src/images/logo-med.png';
import menuIcon from '/src/images/menu-icon.svg';
import userAvatar from '/src/images/user-icon.svg';
document.querySelector('#footer-logo').src = footerLogo;
document.querySelector('#header-logo').src = headerLogo;
document.querySelector('#menu-icon').src = menuIcon;
document.querySelector('#avatar').src = userAvatar;


// Переменные
const openCreateAnket = document.querySelector('.create-anket');
const openEditAnket = document.querySelector('#edit-anket');
const openSettingAnket = document.querySelector('.setting-anket');
const groupAnketList = document.querySelector('.groups__list');
const titleElement = document.querySelector('title');
const headerElement = document.querySelector('.page-title-text');
const buttonsList = document.querySelector('.button__list');
const popupCreateAnket = document.querySelector('.popup-create-anket');
const popupEditAnket = document.querySelector('.popup-edit-anket');
const formNodeCreateAnket = document.querySelector('.popup-form-create-anket');
const formNodeEditAnket = document.querySelector('.popup-form-edit-anket');
const placeListGroups = document.querySelector('#groups');
const placeListEditGroups = document.querySelector('#groups_edit');
const formNewAnket = document.forms.newAnket;
const formEditAnket = document.forms.editAnket;
const editTitle = document.querySelector('.edit-title');
const editLabel = document.querySelector('#edit-anket-name');
const editGroup = document.querySelector('#edit-anket-group');
const editIsActive = document.querySelector('#edit-anket-is-active');
const editIsSubscribe = document.querySelector('#edit-anket-is-subscribe');
const editIsOpen = document.querySelector('#edit-anket-is-open');
const editIsIac = document.querySelector('#edit-anket-for-iac');
const editDescription = document.querySelector('#popup-edit-anket-description');


// Функция отображения кнопок редактирования выбранной анкеты
function createButtons() {
    if (buttonsList.classList.contains('button__list-none')) {
        buttonsList.classList.remove('button__list-none');
    }
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
    if (!element.is_open) {
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
            // очистка списка анкет
            groupAnketList.textContent='';
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

// Функция создания элемента списка
function createElementList(item) {
    const elementTemplate = document.querySelector('#list-element').content;
    const listElement = elementTemplate.querySelector('.element').cloneNode(true);
    listElement.setAttribute('value', `${item}`)
    return listElement
}

// Вывод поля со списком
function createFieldList (placeList) {
    getGroupsAnketList()
        .then(res => checkResponse(res))
        .then((groupsData) => {
            // вывод поля Выбрать группу
            groupsData.forEach((item) => {
                const elementList = createElementList(item.label);
                placeList.append(elementList);
            });
        })
        .catch((err) => {
            console.log(err)
        })
}

// Подготовка объекта Анкета к отправке на сервер
function editObjAnket (bodyMessage) {
    if (bodyMessage['label'] === '') {
        bodyMessage['label'] = '<без названия>';
    }
    if (bodyMessage['group'] === '') {
        bodyMessage['group'] = 'Общие';
    }
    if (bodyMessage.hasOwnProperty('is_active')) {
        bodyMessage['is_active'] = true;
    } else {
        bodyMessage['is_active'] = false;
    }
    if (bodyMessage.hasOwnProperty('is_subscribe')) {
        bodyMessage['is_subscribe'] = true;
    } else {
        bodyMessage['is_subscribe'] = false;
    }
    if (bodyMessage.hasOwnProperty('is_open')) {
        bodyMessage['is_open'] = true;
    } else {
        bodyMessage['is_open'] = false;
    }
    if (bodyMessage.hasOwnProperty('for_iac')) {
        bodyMessage['for_iac'] = true;
    } else {
        bodyMessage['for_iac'] = false;
    }
    return bodyMessage
}

// Обработка формы создания анкеты
function handleCreateAnketSubmit(evt) {
    evt.preventDefault();
    renderLoading(true, evt.target.querySelector('.popup-edit-anket-button-save'));
    const data = new FormData(formNodeCreateAnket);
    const bodyMes = {};
    Array.from(data.entries()).forEach((item) => {
        bodyMes[item[0]] = item[1];
    })
    const bodyMessage = editObjAnket(bodyMes);
    postCreateAnket(bodyMessage)
        .then(res => checkResponse(res))
        .then((res) => {
            window.localStorage.setItem('select_anket', res.uuid);
            initialAnkets();
            placeListGroups.textContent = '';
            closePopup(popupCreateAnket, popupSelectors);
            formNewAnket.reset();
        })
        .catch((err) => {
            console.log(err);
        })
        .finally((res) => {
            renderLoading(false, evt.target.querySelector('.popup-edit-anket-button-save'));
        })
}

// Обработка формы редактирования анкеты
function handleEditAnketSubmit(evt) {
    evt.preventDefault();
    renderLoading(true, evt.target.querySelector('.button-edit'));
    const data = new FormData(formNodeEditAnket);
    const bodyMes = {};
    Array.from(data.entries()).forEach((item) => {
        bodyMes[item[0]] = item[1];
    })
    const bodyMessage = editObjAnket(bodyMes);
    const isAnketActive = window.localStorage.getItem('select_anket');
    patchAnket(isAnketActive, bodyMessage)
        .then(res => checkResponse(res))
        .then((res) => {
            initialAnkets();
            placeListGroups.textContent = '';
            closePopup(popupEditAnket, popupSelectors);
            formEditAnket.reset();
        })
        .catch((err) => {
            console.log(err);
        })
        .finally((res) => {
            renderLoading(false, evt.target.querySelector('.button-edit'));
        })
}

// Функция перехода к настройкам анкеты
function locationReplaceSettings() {
    window.location.replace('/src/maket/');
}

initialAnkets();

// Слушатель выбора анкеты
groupAnketList.addEventListener('click', selectAnket);

// Слушатель клика К настройкам
openSettingAnket.addEventListener('click', locationReplaceSettings)

// Открытие формы Создать анкету
openCreateAnket.addEventListener('click', function () {
    openPopup(popupCreateAnket, popupSelectors);
    createFieldList(placeListGroups);
})

// Открытие формы Редактировать анкету
openEditAnket.addEventListener('click', function () {
    createFieldList(placeListEditGroups);
    const isAnketActive = window.localStorage.getItem('select_anket');
    getAnket(isAnketActive)
        .then(res => checkResponse(res))
        .then((res) => {
            editTitle.textContent = res.id;
            editLabel.value = res.label;
            editGroup.value = res.group;
            editDescription.value = res.description;
            if (res.is_active) {
                editIsActive.setAttribute('checked', true);
            } else {
                if (editIsActive.hasAttribute('checked')) {
                    editIsActive.removeAttribute('checked');
                }
            };
            if (res.is_subscribe) {
                editIsSubscribe.setAttribute('checked', true)
            } else {
                if (editIsSubscribe.hasAttribute('checked')) {
                    editIsSubscribe.removeAttribute('checked');
                }
            };
            if (res.is_open) {
                editIsOpen.setAttribute('checked', true)
            } else {
                if (editIsOpen.hasAttribute('checked')) {
                    editIsOpen.removeAttribute('checked');
                }
            };
            if (res.for_iac) {
                editIsIac.setAttribute('checked', true)
            } else {
                if (editIsIac.hasAttribute('checked')) {
                    editIsIac.removeAttribute('checked');
                }
            };
        })
        .catch((err) => {
            console.log(err);
        });
    openPopup(popupEditAnket, popupSelectors);
})

// Слушатель отправки формы Создать анкету
popupCreateAnket.addEventListener('submit', handleCreateAnketSubmit)

// Слушатель отправки формы Редактировать анкету
popupEditAnket.addEventListener('submit', handleEditAnketSubmit)

// Закрытие формы Создать анкету
popupCreateAnket.addEventListener('click', function (evt) {
    if (evt.target.classList.contains('popup-close')) {
        closePopup(popupCreateAnket, popupSelectors);
    }
})

// Закрытие формы Редактировать анкету
popupEditAnket.addEventListener('click', function (evt) {
    if (evt.target.classList.contains('popup-close')) {
        closePopup(popupEditAnket, popupSelectors);
    }
})