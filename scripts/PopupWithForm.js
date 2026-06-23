import Popup from './Popup.js';

class PopupWithForm extends Popup {
  constructor({ popupSelector, handleFormSubmit }) {
    super({ popupSelector });
    this._handleFormSubmit = handleFormSubmit;
    this._form = this._popupElement.querySelector('.popup__form');
    this._inputList = Array.from(this._form.querySelectorAll('.popup__input'));
    this._submitButton = this._form.querySelector('.popup__save-button');
    this._submitButtonText = this._submitButton.textContent;
  } 

  close() {
    this._popupForm.reset();
    super.close();
  }

  //index.js

  const newCardPopup = new PopupWithForm('#image-popup', () => {});
  newCardPopup.open()

  newCardPopup.close();