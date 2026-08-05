import Card from './Card.js';

export default class Section {
  constructor({ items, renderer }, containerSelector) {
    this._renderedItems = items;
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
  }

  // Public method to render all elements on the page
  renderItems() {
    this._renderedItems.forEach((item) => {
      this._renderer(item);
    });
  }

  addItem(element, shouldAppend = true) {
    if (shouldAppend) {
      this._container.append(element);
    } else {
      this._container.prepend(element);
    }
  }
}