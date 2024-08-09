// Импорт файлов
import { getAnket, patchAnket, getChaptersSections, getSections, getAnketSection, postCreateSection } from '/src/scripts/api.js';
import { checkResponse, sortingListObjects, renderLoading } from '../scripts/utils';
import { popupSelectors, openPopup, closePopup } from '/src/scripts/modals.js';

// Импорт стилей
import '/src/index.css';
import '/src/ankets/index.css';
import '/src/maket/index.css';

// Импорт картинок
import footerLogo from '/src/images/ias-logo-3.png';
import headerLogo from '/src/images/logo-med.png';
import menuIcon from '/src/images/menu-icon.svg';
import userAvatar from '/src/images/user-icon.svg';
import shareIcon from '/src/images/share_link.svg';
import rightArrow from '/src/images/right-arrow.svg';
import listIcon from '/src/images/list-icon.svg';
document.querySelector('#footer-logo').src = footerLogo;
document.querySelector('#header-logo').src = headerLogo;
document.querySelector('#menu-icon').src = menuIcon;
document.querySelector('#avatar').src = userAvatar;
document.querySelectorAll('.share-link').forEach(element => element.src = shareIcon);
document.querySelectorAll('.right-arrow').forEach(element => element.src = rightArrow);

// Переменные
const textTitle = document.querySelector('title');
const textTitleHeader = document.querySelector('.page-title-text');
const editIsOpen = document.querySelector('#edit-anket-is-open');
const formBlock = document.querySelector('.anket-edit__form-checkbox');
const chaptersList = document.querySelector('.chapters-container');
const createSectionButton = document.querySelector('.create-section');
const popupEditSection = document.querySelector('.popup-edit-anket');
const formNewSection = document.forms.newSection;
const deleteButton = document.querySelector('.popup-edit-anket-button-delete');
const placeListChapter = document.querySelector('#chapters-list');
const popupTitleId = document.querySelector('#section-id');
const popupTitleText = document.querySelector('#section-title');
const popupSectionName = document.querySelector('#section-name');
const popupSectionChapter = document.querySelector('#section-chapter');
const popupSectionSorting = document.querySelector('#section-sort');
const popupSectionColumns = document.querySelector('#section-columns');


// Функция отрисовки чек-бокса блокировки анкеты
function renderingBlockButton (data) {
    if (data) {
        editIsOpen.setAttribute('checked', true)
    } else {
        if (editIsOpen.hasAttribute('checked')) {
            editIsOpen.removeAttribute('checked');
        }
    };
}

// Функция базовой отрисовки страницы
function initialPage () {
    const uuidAnket = window.localStorage.getItem('select_anket');
    getAnket(uuidAnket)
        .then(res => checkResponse(res))
        .then((res) => {
            const labelAnket = res.label;
            textTitle.textContent = `Макет. ${labelAnket} | Узел сбора информации | НЦ МБР`;
            textTitleHeader.textContent = `Макет. ${labelAnket}`;
            renderingBlockButton(res.is_open);
        })
        .catch((err) => {
            console.log(err);
        });
}

// Функция создания элемента родителя разделов
function createChapter(element) {
    const chapterLineTemplate = document.querySelector('#chapter-template').content;
    const chapterLineElement = chapterLineTemplate.querySelector('.chapter').cloneNode(true);
    const chapterLabel = chapterLineElement.querySelector('.group-title');
    const chapterList = chapterLineElement.querySelector('.anket-fields-list');
    chapterLabel.textContent = element.label;
    chapterList.id = element.id;
    return chapterLineElement;
}

// Функция создания элемента раздела
function createSection(element) {
    let chapterId = 0;
    console.log('c1', chapterId)
    if (element.chapters_id) {
        console.log('c111', element.chapters_id)
        chapterId = element.chapters_id;
    }
    console.log('c2', chapterId)
    const chapterUl = document.getElementById(chapterId);
    console.log('c3', chapterUl)
    const sectionLineTemplate = document.querySelector('#section-template').content;
    const sectionLineElement = sectionLineTemplate.querySelector('.anket-fields-list-item').cloneNode(true);
    sectionLineElement.id = element.uuid;
    const sectionSorting = sectionLineElement.querySelector('.section-sorting');
    sectionSorting.textContent = `${element.sorting}.`;
    if (element.dependent_field_uuid) {
        const sectionDependent = sectionLineElement.querySelector('.dependent-field');
        sectionDependent.classList.remove('field-off');
        sectionLineElement.querySelector('.share-link').src = shareIcon;
    }
    const sectionTitle = sectionLineElement.querySelector('.link-text');
    sectionTitle.textContent = element.label;
    const sectionColumn = sectionLineElement.querySelector('.column-section');
    sectionColumn.textContent = `${element.columns} кол.`
    const numberField = sectionLineElement.querySelector('.list-item-link-icons-text');
    numberField.textContent = '???';
    sectionLineElement.querySelector('.list-icon').src = listIcon;
    sectionLineElement.querySelector('.right-arrow').src = rightArrow;
    chapterUl.append(sectionLineElement);
}

// Функция отрисовки разделов
function initialChapterSections () {
    const uuidAnket = window.localStorage.getItem('select_anket');
    Promise.all([getChaptersSections(uuidAnket), getSections(uuidAnket)])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(([chapters, sections]) => {
            console.log('a', chapters)
            // очистка списка разделов
            chaptersList.textContent='';
            // вывод родительских разделов
            if (chapters.length > 0) {
                chapters.forEach((item) => {
                    const chapterLine = createChapter(item);
                    chaptersList.append(chapterLine);
                });
            }
            const chapterLine0 = createChapter({'id': 0, 'label': ''});
            chaptersList.append(chapterLine0);
            console.log('b', sections)
            if (sections.length > 1) {
                sortingListObjects(sections, 'sorting');
            }
            if (sections.length > 0) {
                // вывод разделов
                sections.forEach((item) => {
                    const sectionLine = createSection(item);
                });
            }
        })
        .catch((err) => {
            alert('Сервер недоступен, попробуйте позже...')
            console.log(err);
        });
}


// Обработчик клика чек-бокса блокировки анкеты
function handleClickBlockButton() {
    const uuidAnket = window.localStorage.getItem('select_anket');
    const data = new FormData(formBlock);
    const bodyMessage = {};
    Array.from(data.entries()).forEach((item) => {
        bodyMessage[item[0]] = item[1];
    })
    if (bodyMessage.hasOwnProperty('is_open')) {
        bodyMessage['is_open'] = true;
    } else {
        bodyMessage['is_open'] = false;
    }
    patchAnket(uuidAnket, bodyMessage)
        .then(res => checkResponse(res))
        .then((res) => {
            if (res.is_open) {
                alert('Форма заблокирована');
            } else {
                alert('Форма разблокирована');
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

// Вывод поля со списком Родительский раздел
function createChapterList () {
    const uuidAnket = window.localStorage.getItem('select_anket');
    getChaptersSections(uuidAnket)
        .then(res => checkResponse(res))
        .then((res) => {
            placeListChapter.textContent = '';
            // вывод поля Выбрать родительский раздел
            res.forEach((item) => {
                const elementList = createElementList(item.label);
                placeListChapter.append(elementList);
            });
        })
        .catch((err) => {
            console.log(err)
        })
}

// Подготовка объекта Раздела к отправке на сервер
function createObjSection (bodyMessage) {
    if (bodyMessage['label'] === '') {
        bodyMessage['label'] = '<без названия>';
    }
    if (bodyMessage['columns'] === '') {
        bodyMessage['columns'] = 1;
    } else if (bodyMessage['columns'] > 3) {
        bodyMessage['columns'] = 3;
    }
    if (bodyMessage['sorting'] === '') {
        bodyMessage['sorting'] = 999;
    }
    if (bodyMessage['chapter'] === '') {
        bodyMessage['label'] = '<без названия>';
    }
    return bodyMessage;
}

// Обработка формы создания раздела
function handleCreateSectionSubmit(evt) {
    evt.preventDefault();
    renderLoading(true, evt.target.querySelector('.popup-edit-anket-button-save'));
    const data = new FormData(formNewSection);
    const bodyMes = {};
    Array.from(data.entries()).forEach((item) => {
        bodyMes[item[0]] = item[1];
    });
    console.log(bodyMes);
    bodyMes['ankets_uuid'] = window.localStorage.getItem('select_anket');
    let bodyMessage = createObjSection(bodyMes);
    Object.keys(bodyMessage).forEach((key) => bodyMessage[key] == '' && delete bodyMessage[key]);
    console.log(bodyMessage);
    postCreateSection(bodyMessage)
        .then(res => checkResponse(res))
        .then((res) => {
            initialChapterSections();
            placeListChapter.textContent = '';
            closePopup(popupEditSection, popupSelectors);
        })
        .catch((err) => {
            console.log(err);
        })
        .finally((res) => {
            renderLoading(false, evt.target.querySelector('.popup-edit-anket-button-save'));
            formNewSection.reset();
        })
}

// слушатель чек-бокса блокировки анкеты
editIsOpen.addEventListener('click', handleClickBlockButton);

// открыть модальное окно для создания раздела
createSectionButton.addEventListener('click', function () {
    formNewSection.reset();
    openPopup(popupEditSection, popupSelectors);
    if (!deleteButton.classList.contains('field-off')) {
        deleteButton.classList.add('field-off');
    };
    createChapterList();
})

// открыть модальное окно для редактирования раздела
chaptersList.addEventListener('click', function (evt) {
    const targetElement = evt.target;
    const parentElement = targetElement.closest('.list-item-link-text');
    if (parentElement === null) {
        evt.stopPropagation();
        return
    };
    if (deleteButton.classList.contains('field-off')) {
        deleteButton.classList.remove('field-off');
    };
    const parentLiElement = targetElement.closest('.anket-fields-list-item');
    openPopup(popupEditSection, popupSelectors);
    createChapterList();
    getAnketSection(parentLiElement.id)
        .then(res => checkResponse(res))
        .then((res) => {
            console.log(res)
            popupTitleId.textContent = `${res.id}.`;
            if (res.chapter) {
                popupTitleText.textContent = `${res.chapter} | ${res.label}`;
            } else {
                popupTitleText.textContent = `${res.label}`;
            }
            popupSectionName.value = res.label;
            popupSectionChapter.value = res.chapter;
            popupSectionSorting.value = res.sorting;
            popupSectionColumns.value = res.columns; 
        })
        .catch((err) => {
            console.log(err);
        })
})

// закрыть модальное окно
popupEditSection.addEventListener('click', function (evt) {
    if (evt.target.classList.contains('popup-close')) {
        closePopup(popupEditSection, popupSelectors);
    }
})

// Слушатель отправки формы Создать раздел
popupEditSection.addEventListener('submit', handleCreateSectionSubmit);

initialPage();
initialChapterSections();
