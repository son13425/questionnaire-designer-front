//базовые настройки селекторов валидации
export const objectsValidation = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'form__input-error',
    errorClass: 'popup__error_visible',
    errorSelector: '.popup__input_type_error'
  };

//показывает элемент ошибки
const showInputError = (formElement, inputElement, errorMessage, objectsValidation) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.add(objectsValidation.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(objectsValidation.errorClass);
  };

  //скрывает элемент ошибки
const hideInputError = (formElement, inputElement, objectsValidation) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.remove(objectsValidation.inputErrorClass);
    errorElement.classList.remove(objectsValidation.errorClass);
    errorElement.textContent = '';
};

//контролирует валидность заполнения поля формы
const isValid = (formElement, inputElement, objectsValidation) => {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, objectsValidation);
  } else {
    hideInputError(formElement, inputElement, objectsValidation);
  }
};

//делает заключение о валидности формы (ввалидны все поля)
const hasInvalidInput = (inputList) => {
    return inputList.some((inputElement) => {
      return !inputElement.validity.valid;
    })
};

//переключчает активность кнопки отправки
const toggleButtonState = (inputList, buttonElement, objectsValidation) => {
    // Если есть хотя бы один невалидный инпут
    if (hasInvalidInput(inputList)) {
      // сделай кнопку неактивной
        buttonElement.disabled = true;
        buttonElement.classList.add(objectsValidation.inactiveButtonClass);
    } else {
          // иначе сделай кнопку активной
        buttonElement.disabled = false;
        buttonElement.classList.remove(objectsValidation.inactiveButtonClass);
    }
  };

//вешает слушатель на все поля ввода внутри формы
const setEventListeners = (formElement, objectsValidation) => {
  const inputList = Array.from(formElement.querySelectorAll(objectsValidation.inputSelector));
  const buttonElement = formElement.querySelector(objectsValidation.submitButtonSelector);
  toggleButtonState(inputList, buttonElement, objectsValidation);
  inputList.forEach((inputElement) => {
      inputElement.addEventListener('input', function () {
          isValid(formElement, inputElement, objectsValidation);
          toggleButtonState(inputList, buttonElement, objectsValidation);
      });
  });
};

//добавляет обработчики всем формам
export const enableValidation = (objectsValidation) => {
    // Найдём все формы с указанным классом в DOM,
    // сделаем из них массив методом Array.from
    const formList = Array.from(document.querySelectorAll(objectsValidation.formSelector));
    // Переберём полученную коллекцию
    formList.forEach((formElement) => {
        setEventListeners(formElement, objectsValidation);
      });
  };

// очищает поля валидации в форме перед ее открытием
export const clearVaidation = (popupElement, objectsValidation) => {
    const errMess = popupElement.querySelectorAll(objectsValidation.errorSelector);
    errMess.forEach((item) => {
        item.textContent = '';
    });
    const inputErr = popupElement.querySelectorAll(objectsValidation.inputSelector);
    inputErr.forEach((item) => {
        item.classList.remove(objectsValidation.inputErrorClass);
    });
    const buttonElement = popupElement.querySelector(objectsValidation.submitButtonSelector);
    buttonElement.disabled = true;
    buttonElement.classList.add(objectsValidation.inactiveButtonClass);
};