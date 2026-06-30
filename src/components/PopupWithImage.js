import { Popup } from './Popup.js';

export class PopupWithImage extends Popup {
  constructor(popupSelector) {
    super(popupSelector);

    this._popupImage = this._popupElement.querySelector('.modal__image');
    this._popupCaption = this._popupElement.querySelector('.modal__caption');
  }

  open(nameOrData, link) {
    const name = typeof nameOrData === 'object' && nameOrData !== null
      ? nameOrData.name
      : nameOrData;
    const imageLink = typeof nameOrData === 'object' && nameOrData !== null
      ? nameOrData.link
      : link;

    this._popupImage.src = imageLink;
    this._popupImage.alt = name;
    this._popupCaption.textContent = name;
    super.open();
  }
}