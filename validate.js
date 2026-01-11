function showInputError(formElem, inputElem, { inputErrorClass, errorClass }) {
  const errorMessageElem = formElem.querySelector(
    `#` + inputElem.id + `-error`
  );
  inputElem.classList.add(inputErrorClass);
  if (errorMessageElem) {
    errorMessageElem.textContent = inputElem.validationMessage;
    errorMessageElem.classList.add(errorClass);
  }
}

function hideInputError(formElem, inputElem, { inputErrorClass, errorClass }) {
  const errorMessageElem = formElem.querySelector(
    `#` + inputElem.id + `-error`
  );
  inputElem.classList.remove(inputErrorClass);
  if (errorMessageElem) {
    errorMessageElem.textContent = "";
    errorMessageElem.classList.remove(errorClass);
  }
}

function checkInputValidity(formElem, inputElem, settings) {
  if (!inputElem.validity.valid) {
    return showInputError(formElem, inputElem, settings);
  }
  hideInputError(formElem, inputElem, settings);
}

function resetValidation(formElem, inputElem, { inputErrorClass, errorClass }) {
  if (errorMessageElem) {
    errorMessageElem.textContent = "";
    errorMessageElem.classList.remove(errorClass);
  }
}

//Is not working when I close out the form after emptying it.
function resetFormAndValidation() {
  closeModalButton.addEventListener("click", resetFormAndValidation);
  myForm.reset();
}

const submitButton = document.querySelectorAll(".modal__button");

function toggleButtonState(inputList, buttonEl, settings) {
  let foundInvalid = false;

  inputList.forEach((inputElem) => {
    if (!inputElem.validity.valid) {
      foundInvalid = true;
    }
  });

  if (foundInvalid) {
    buttonEl.classList.add(settings.inactiveButtonClass);
    buttonEl.disabled = true;
  } else {
    buttonEl.classList.remove(settings.inactiveButtonClass);
    buttonEl.disabled = false;
  }
}

const usernameInput = document.querySelectorAll(
  "profile-title-input, profile-description-input",
  "add-title-input",
  "add-description-input"
);

function validateForm() {
  if (usernameInput.value.length >= 2) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}

const validationSettings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__field",
};

const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__field",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

function enableValidation(settings) {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));

  formList.forEach((formElem) => {
    formElem.addEventListener("submit", (e) => {
      e.preventDefault();
    });
    setEventListeners(formElem, settings);
  });
}

function setEventListeners(formElem, settings) {
  const buttonElement = formElem.querySelector(settings.submitButtonSelector);

  const inputSelector = settings.inputSelector;
  const inputList = Array.from(
    formElem.querySelectorAll(settings.inputSelector)
  );
  toggleButtonState(inputList, buttonElement, settings);

  inputList.forEach((inputElem) => {
    inputElem.addEventListener("input", () => {
      checkInputValidity(formElem, inputElem, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
}

enableValidation(settings);
