export default class FormValidator {
  constructor(settings, formElem) {
    this._inputSelector = settings.inputSelector;
    this._submitButtonSelector = settings.submitButtonSelector;
    this._inactiveButtonClass = settings.inactiveButtonClass;
    this._inputErrorClass = settings.inputErrorClass;
    this._errorClass = settings.errorClass;
    this._form = formElem;
    this._buttonElement = this._form.querySelector(this._submitButtonSelector);
    this._inputList = Array.from(
      this._form.querySelectorAll(this._inputSelector),
    );
  }

  disableSubmitButton() {
    this._buttonElement.classList.add(this._inactiveButtonClass);
    this._buttonElement.setAttribute("disabled", true);
  }

  _showInputError(inputElem) {
    const errorMessageElem = this._form.querySelector(`#${inputElem.id}-error`);

    inputElem.classList.add(this._inputErrorClass);
    if (errorMessageElem) {
      errorMessageElem.textContent = inputElem.validationMessage;
      errorMessageElem.classList.add(this._errorClass);
    }
  }

  _hideInputError(inputElem) {
    const errorMessageElem = this._form.querySelector(`#${inputElem.id}-error`);

    inputElem.classList.remove(this._inputErrorClass);
    if (errorMessageElem) {
      errorMessageElem.textContent = "";
      errorMessageElem.classList.remove(this._errorClass);
    }
  }

  _validateAvatarProfileUrl(inputElem) {
    const value = inputElem.value.trim();
    const pattern =
      /^(https?:\/\/)[\w.-]+(?:\.[\w.-]+)+(?:\/[^\s]*)?$/i;

    if (!value) {
      return "Avatar URL is required.";
    }

    if (!pattern.test(value)) {
      return "Please enter a valid URL.";
    }

    return "";
  }

  _checkInputValidity(inputElem) {
    if (inputElem.id === "change-avatar-input") {
      const message = this._validateAvatarProfileUrl(inputElem);
      inputElem.setCustomValidity(message);
    } else {
      inputElem.setCustomValidity("");
    }

    if (!inputElem.validity.valid) {
      this._showInputError(inputElem);
    } else {
      this._hideInputError(inputElem);
    }
  }

  _hasInvalidInput() {
    return this._inputList.some((inputElem) => {
      return inputElem.value.trim() === "" || !inputElem.validity.valid;
    });
  }

  _toggleButtonState() {
    if (this._hasInvalidInput()) {
      this._buttonElement.classList.add(this._inactiveButtonClass);
      this._buttonElement.disabled = true;
    } else {
      this._buttonElement.classList.remove(this._inactiveButtonClass);
      this._buttonElement.disabled = false;
    }
  }

  _setEventListeners() {
    this._inputList.forEach((inputElem) => {
      inputElem.addEventListener("input", () => {
        this._checkInputValidity(inputElem);
        this._toggleButtonState();
      });
    });

    this._toggleButtonState();
  }

  enableValidation() {
    this._form.addEventListener("submit", (e) => {
      e.preventDefault();
    });
    this._setEventListeners();
  }

  resetValidation() {
    this._inputList.forEach((inputElem) => {
      inputElem.value = "";
      inputElem.setCustomValidity("");
      this._hideInputError(inputElem);
    });

    this.disableSubmitButton();
  }
}
