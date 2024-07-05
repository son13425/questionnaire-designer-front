// Импорт стилей
import '/src/index.css';

// Импорт картинок
import footerLogo from '/src/images/ias-logo-3.png';
import headerLogo from '/src/images/logo-med.png';
import menuIcon from '/src/images/menu-icon.svg';
import userAvatar from '/src/images/user-icon.svg';
import backIcon from '/src/images/left-icon.svg';
import listIcon from '/src/images/list-icon.svg';
document.querySelector('#footer-logo').src = footerLogo;
document.querySelector('#header-logo').src = headerLogo;
document.querySelector('#menu-icon').src = menuIcon;
document.querySelector('#avatar').src = userAvatar;
document.querySelector('#back1').src = backIcon;
document.querySelector('#list-icon1').src = listIcon;
document.querySelector('#back2').src = backIcon;
document.querySelector('#list-icon2').src = listIcon;

// Константы
const linkAuthor = document.querySelector('.anket-inform-table-author-about');
const closePanelLink = document.querySelector('.close-panel-link');

// Функция открытия/закрытия секций
function sectionDisplay(selector) {
    const elementSelector = document.querySelector(selector);
    if (elementSelector.classList.contains('display-none')) {
        elementSelector.classList.remove('display-none');
    } else {
        elementSelector.classList.add('display-none');
    }
}
// Функция изменения разметки страницы в зависимости от наличия левой панели
function contentGrid() {
    const mainContent = document.querySelector('.content');
    const containerAnket = document.querySelector('.container-inform-anket');
    if (containerAnket.classList.contains('display-none')) {
        mainContent.setAttribute('style', 'grid-template-columns: 1fr;');
    } else {
        mainContent.style.removeProperty('grid-template-columns');
    }
}

// Слушатель состояния данных пользователя в заголовке анкет
linkAuthor.addEventListener('click', function () {
    sectionDisplay('#authotContactInfo');
})
// Слушатель кнопки закрыть/открыть панель слева
closePanelLink.addEventListener('click', function() {
    sectionDisplay('.container-inform-anket');
    contentGrid();
})