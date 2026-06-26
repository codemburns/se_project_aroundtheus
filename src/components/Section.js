export default class Section {
  constructor({ items, renderer }, containerSelector) {
    this._renderedItems = items;
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
  }

  addItem(element) {
    this._container.append(element);
  }

  // Public method to render all elements on the page
  renderItems() {
    this._renderedItems.forEach((item) => {
      this._renderer(item);
    });
  }
}