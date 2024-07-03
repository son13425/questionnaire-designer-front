// Импорт стилей
import './index.css';
// Импорт файлов
import { createCard } from './scripts/card.js';
import { popupSelectors, openPopup, closePopup } from './scripts/modals.js';
import { getInitialCards, postCreateCard, getUserInfo, patchUserInfo, patchUserImage } from './scripts/api.js';
import { objectsValidation, enableValidation, clearVaidation } from './scripts/validation.js';
import { checkResponse, searchMyLike, renderLoading } from './scripts/utils.js';
// Импорт картинок
import footerLogo from './images/ias-logo-3.png';
import headerLogo from './images/logo-med.png';
import menuIcon from './images/menu-icon.svg';
import userAvatar from './images/user-icon.svg';
import backIcon from './images/left-icon.svg';
import listIcon from './images/list-icon.svg';
document.querySelector('#footer-logo').src = footerLogo;
document.querySelector('#header-logo').src = headerLogo;
document.querySelector('#menu-icon').src = menuIcon;
document.querySelector('#avatar').src = userAvatar;
document.querySelector('#back1').src = backIcon;
document.querySelector('#list-icon1').src = listIcon;
document.querySelector('#back2').src = backIcon;
document.querySelector('#list-icon2').src = listIcon;
// Переменные
const placesList = document.querySelector('.places__list');
const popupProfileEditImage = document.querySelector('.popup_type_edit-image');
const popupProfileEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');
const inputNameProfile = document.querySelector('.popup__input_type_name');
const inputJobProfile = document.querySelector('.popup__input_type_description');
const inputUrlNewUserImage = document.querySelector('.popup__input_type_image_url');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');
const formNewCard = document.forms.newPlace;
const formEditProfileImage = document.forms.editProfileImage;
const inputPlaceNameNewCard = document.querySelector('.popup__input_type_card-name');
const inputUrlNewCard = document.querySelector('.popup__input_type_url');
const buttonProfileEdit = document.querySelector('.profile__edit-button');
const buttonAddNewCard = document.querySelector('.profile__add-button');
const popupImageOpenImg = popupImage.querySelector('.popup__image');
const popupImageText = popupImage.querySelector('.popup__caption');
const buttonProfileEditImage = document.querySelector('.profile__image');


// глобальная переменная для хранения id пользователя
let myUserId

// Вывод исходных данных профиля и карточек
Promise.all([getUserInfo(), getInitialCards()])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(([userData, cards]) => {
        //вывод профиля
        profileTitle.textContent = userData.name;
        profileDescription.textContent = userData.about;
        profileImage.style.backgroundImage = `url('${userData.avatar}')`;
        myUserId = userData._id;
        // вывод карточек
        cards.forEach((item) => {
            let myCard
            if (item.owner._id === myUserId) {
                myCard = true;
            } else {
                myCard = false;
            }
            const cardObj = {
                name: item.name,
                link: item.link,
                myCardBool: myCard,
                myCardId: item._id,
                likes: item.likes.length,
                myLike: searchMyLike(item.likes, myUserId)
            };
            const card = createCard(cardObj, openImage);
            placesList.append(card);
        });
    })
    .catch((err) => {
        console.log(err);
    });

// Обработка формы редактирования профиля
function handleFormProfileEditSubmit(evt) {
    evt.preventDefault();
    renderLoading(true, evt.target.querySelector('.popup__button'));
    patchUserInfo(inputNameProfile.value, inputJobProfile.value)
        .then(res => checkResponse(res))
        .then((res) => {
            profileTitle.textContent = res.name;
            profileDescription.textContent = res.about;
            closePopup(popupProfileEdit, popupSelectors);
        })
        .catch((err) => {
            console.log(err);
        })
        .finally((res) => {
            renderLoading(false, evt.target.querySelector('.popup__button'));
        })
}

// Обработка формы обновления аватара пользователя
function handleFormProfileImageEditSubmit(evt) {
    evt.preventDefault();
    renderLoading(true, evt.target.querySelector('.popup__button'));
    patchUserImage(inputUrlNewUserImage.value)
        .then(res => checkResponse(res))
        .then((res) => {
            profileImage.style.backgroundImage = `url('${res.avatar}')`;
            closePopup(popupProfileEditImage, popupSelectors);
        })
        .catch((err) => {
            console.log(err);
        })
        .finally((res) => {
            renderLoading(false, evt.target.querySelector('.popup__button'));
        })
}

// Обработка формы создания карточки
function handleFormNewCardSubmit(evt) {
    evt.preventDefault();
    renderLoading(true, evt.target.querySelector('.popup__button'));
    const nameNewCard = inputPlaceNameNewCard.value;
    const linkNewCard = inputUrlNewCard.value;
    postCreateCard(nameNewCard, linkNewCard)
        .then(res => checkResponse(res))
        .then((res) => {
            const cardObj = {
                name: res.name,
                link: res.link,
                myCardBool: true,
                myCardId: res._id,
                likes: 0,
                myLike: false
            };
            const card = createCard(cardObj, openImage);
            placesList.prepend(card);
            closePopup(popupNewCard, popupSelectors);
            formNewCard.reset();
        })
        .catch((err) => {
            console.log(err);
        })
        .finally((res) => {
            renderLoading(false, evt.target.querySelector('.popup__button'));
        })
}

// Открытие картинки
const openImage = (evt) => {
    popupImageOpenImg.src = evt.target.src;
    popupImageOpenImg.alt = evt.target.alt;
    popupImageText.textContent = evt.target.alt;

    openPopup(popupImage, popupSelectors);
}

// Открытие форм
buttonProfileEditImage.addEventListener('click', function () {
    formEditProfileImage.reset();
    clearVaidation(popupProfileEditImage, objectsValidation);
    openPopup(popupProfileEditImage, popupSelectors);
})

buttonProfileEdit.addEventListener('click', function () {
    clearVaidation(popupProfileEdit, objectsValidation);
    inputNameProfile.value = profileTitle.textContent;
    inputJobProfile.value = profileDescription.textContent;
    openPopup(popupProfileEdit, popupSelectors);
})

buttonAddNewCard.addEventListener('click', function () {
    formNewCard.reset();
    clearVaidation(popupNewCard, objectsValidation);
    openPopup(popupNewCard, popupSelectors);
})

// Закрытие форм
popupProfileEditImage.addEventListener('click', function (evt) {
    if (evt.target.classList.contains('popup__close')) {
        closePopup(popupProfileEditImage, popupSelectors);
    }
})

popupProfileEdit.addEventListener('click', function (evt) {
    if (evt.target.classList.contains('popup__close')) {
        closePopup(popupProfileEdit, popupSelectors);
    }
})

popupNewCard.addEventListener('click', function (evt) {
    if (evt.target.classList.contains('popup__close')) {
        closePopup(popupNewCard, popupSelectors);
    }
})

popupImage.addEventListener('click', function (evt) {
    if (evt.target.classList.contains('popup__close')) {
        closePopup(popupImage, popupSelectors);
    }
})

enableValidation(objectsValidation);

// Слушатели отправки форм
popupProfileEdit.addEventListener('submit', handleFormProfileEditSubmit);
popupProfileEditImage.addEventListener('submit', handleFormProfileImageEditSubmit);
popupNewCard.addEventListener('submit', handleFormNewCardSubmit);
