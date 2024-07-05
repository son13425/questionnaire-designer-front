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
// Функция открытия/закрытия данных пользователя в заголовке анкет
function autorInfoDisplay() {
    const aboutAuthor = document.querySelector('#authotContactInfo');
    if (aboutAuthor.classList.contains('display-none')) {
        aboutAuthor.classList.remove('display-none');
    } else {
        aboutAuthor.classList.add('display-none');
    }
}
// Слушатель состояния данных пользователя в заголовке анкет
linkAuthor.addEventListener('click', function () {
    autorInfoDisplay();
})