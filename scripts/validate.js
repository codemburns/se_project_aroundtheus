const showInputError = (formElement, inputElement, errorMessage) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);

  inputElement.classList.add("modal__field_type_error");
  errorElement.textContent = errorMessage;
  errorElement.classList.add("modal__error_visible");
};

const hideInputError = (formElement, inputElement) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);

  inputElement.classList.remove("modal__field_type_error");
  errorElement.classList.remove("modal__error_visible");
  errorElement.textContent = "";
};

const checkInputValidity = (formElement, inputElement) => {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
};

function toggleButtonState(inputList, buttonElement, settings) {
  let foundInvalid = false;

  inputList.forEach((inputElement) => {
    if (!inputElement.validity.valid) {
      foundInvalid = true;
    }
  });

  if (foundInvalid) {
    buttonElement.classList.add(settings.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(settings.inactiveButtonClass);
    buttonElement.disabled = false;
  }
}

const resetFormValidation = (formElement) => {
  formElement.reset();

  const inputList = Array.from(formElement.querySelectorAll(".modal__field"));
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement);
  });

  const buttonElement = formElement.querySelector(".modal__button");
  if (buttonElement) {
    toggleButtonState(inputList, buttonElement, settings);
  }
};

const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__field",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

const setEventListeners = (formElem) => {
  const inputList = Array.from(formElem.querySelectorAll(".modal__field"));
  const buttonElement = formElem.querySelector(".modal__button");

  inputList.forEach((inputElem) => {
    inputElem.addEventListener("input", function () {
      checkInputValidity(formElem, inputElem);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
};

const enableValidation = () => {
  const formList = Array.from(document.querySelectorAll(".modal__form"));
  formList.forEach((formElement) => {
    formElement.addEventListener("submit", function (evt) {
      evt.preventDefault();
    });
    setEventListeners(formElement);
  });
};

enableValidation();
