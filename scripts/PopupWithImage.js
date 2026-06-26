import { Popup } from './Popup.js';

export class PopupWithImage extends Popup {
  // 1. Accept the entire options/config object
  constructor({ popupSelector }) {
    // 2. Pass that object directly up to the parent Popup class
    super({ popupSelector });
    
    // 3. Select your elements (this._popupElement is safely inherited from Popup)
    this._popupImage = this._popupElement.querySelector('.modal__image');
    this._popupCaption = this._popupElement.querySelector('.modal__caption');
  }

  // Example open method to utilize these elements
    open({ name, link }) {
    this._popupImage.src = link;
    this._popupImage.alt = name;
    this._popupCaption.textContent = name;
    super.open(); // Call the parent open method to display the modal
  }
}