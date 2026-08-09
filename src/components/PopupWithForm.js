import { Popup } from './Popup.js';

export default class PopupWithForm extends Popup {
  constructor({ popupSelector, handleFormSubmit }) {
    super(popupSelector);
    this._handleFormSubmit = handleFormSubmit;
    this._form = this._popupElement.querySelector('.modal__form');
    this._inputList = this._form.querySelectorAll('.modal__field'); 
    this._submitButton = this._form.querySelector('button[type="submit"]');
    this._submitButtonText = this._submitButton ? this._submitButton.textContent : 'Save';
  }

  // Override the parent setEventListeners()
  setEventListeners() {
    super.setEventListeners();

    this._form.addEventListener('submit', (evt) => {
      evt.preventDefault();

      this.renderLoading(true);

      const submitResult = this._handleFormSubmit(this._getInputValues());

      if (submitResult && typeof submitResult.then === 'function') {
        submitResult.finally(() => {
          this.renderLoading(false);
          this._form.reset();
        });
      } else {
        this.renderLoading(false);
        this._form.reset();
      }
    });
  }
  
  // Note: You will need a method to fetch input data, for example:
  _getInputValues() {
    this._formValues = {};
    this._inputList.forEach((input) => {
      this._formValues[input.name] = input.value;
    });
    return this._formValues;
  }

  setInputValues(data) {
    this._inputList.forEach((input) => {
      input.value = data[input.name] ?? '';
    });
  }

  renderLoading(isLoading) {
    if (!this._submitButton) return;

    this._submitButton.disabled = isLoading;
    this._submitButton.textContent = isLoading ? 'Saving...' : this._submitButtonText;
  }

  close() {
    super.close();
  }
}