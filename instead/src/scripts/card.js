import { deleteMyCard, putLikeCard, deleteLikeCard } from './api.js'
import { checkResponse } from './utils.js';

// Функция создает разметку корзины для моих карточек
function createDeleteButton () {
    return '<button type="button" class="card__delete-button"></button>'
}

// Функция вставляет разметку корзины в DOM
function addDeleteButtonToDom(container, markup) {
    container.insertAdjacentHTML('afterbegin', markup)
}

// Функция удаления карточки из DOM
function deleteCard(card) {
    card.remove();
}

// Функция удаления карточки на сервере
function deleteMyCardServer(myCardId, cardElement) {
    deleteMyCard(myCardId)
        .then(res => checkResponse(res))
        .then((res) => {
            deleteCard(cardElement);
        })
        .catch((err) => {
            console.log(err);
        });
}

// Функция постановки лайка карточки
function likeIt(cardLikeButton, cardId, cardLikesCounter) {
    putLikeCard(cardId)
        .then(res => checkResponse(res))
        .then((res) => {
            cardLikesCounter.textContent = res.likes.length;
            cardLikeButton.classList.add('card__like-button_is-active');
        })
        .catch((err) => {
            console.log(err);
        });
}

//Функция удаления лайка карточки
function deleteLike(cardLikeButton, cardId, cardLikesCounter) {
    deleteLikeCard(cardId)
        .then(res => checkResponse(res))
        .then((res) => {
            cardLikesCounter.textContent = res.likes.length;
            cardLikeButton.classList.remove('card__like-button_is-active');
        })
        .catch((err) => {
            console.log(err);
        });
}

// Функция обработки лайка карточки
function likeCardFunction(cardLikeButton, cardId, cardLikesCounter) {
    if (cardLikeButton.classList.contains('card__like-button_is-active')) {
        deleteLike(cardLikeButton, cardId, cardLikesCounter);
    } else {
        likeIt(cardLikeButton, cardId, cardLikesCounter);
    }
}

// Функция создания карточки
export function createCard(element, openImage) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);

    const cardImage = cardElement.querySelector('.card__image');
    cardImage.src = element.link;
    cardImage.alt = element.name;

    cardElement.querySelector('.card__title').textContent = element.name;

    cardImage.addEventListener('click', openImage);

    const cardLikesCounter = cardElement.querySelector('.card__like-button-counter')
    cardLikesCounter.textContent = element.likes;
    const cardLikeButton = cardElement.querySelector('.card__like-button');
    if (element.myLike) {
        cardLikeButton.classList.add('card__like-button_is-active');
    }
    cardLikeButton.addEventListener('click', function () {
        likeCardFunction(cardLikeButton, element.myCardId, cardLikesCounter);
    });

    if (element.myCardBool) {
        cardElement.dataset.cardId = element.myCardId;
        const cardDeleteButton = cardElement.querySelector('.container__delete-button');
        addDeleteButtonToDom(cardDeleteButton, createDeleteButton());
        const cardDelete = cardElement.querySelector('.card__delete-button');
        cardDelete.addEventListener('click', function () {
            deleteMyCardServer(element.myCardId, cardElement);
        });
    }

    return cardElement;
}
