import { Popup } from './Popup.js';

export default class PopupWithForm extends Popup {
  constructor({ popupSelector, handleFormSubmit }) {
    super(popupSelector);
    this._handleFormSubmit = handleFormSubmit;
    this._form = this._popupElement.querySelector('.modal__form');
    this._inputList = this._form.querySelectorAll('.modal__field'); 
  } 

  // Override the parent setEventListeners()
  setEventListeners() {
    // 1. Keep the overlay and escape key behavior from the parent class
    super.setEventListeners();

    // 2. Add the submit event listener
    this._form.addEventListener('submit', (evt) => {
      evt.preventDefault(); // Prevent the browser from reloading on submit

      // Pass the collected form data to your callback function
      this._handleFormSubmit(this._getInputValues()); 
      this._form.reset();
    });
  }
  
  // Note: You will need a method to fetch input data, for example:
  _getInputValues() {
    this._formValues = {};
    this._inputList.forEach(input => {
      this._formValues[input.name] = input.value;
    });
    return this._formValues;
  }

  setInputValues(data) {
    this._inputList.forEach((input) => {
      input.value = data[input.name] ?? "";
    });
  }

   close() {
    super.close();
  }
}