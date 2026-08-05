export default class Card {
  constructor(data, cardSelector, handleImageClick, handleDeleteClick) {
    const cardData = data || {};
    this._name = cardData.name || "Untitled";
    this._link = cardData.link || "";
    this._id = cardData._id || cardData.id || "";
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
    this._handleDeleteClick = handleDeleteClick;
    this._storageKey = `card-liked-${this._id || this._link}`;
  }

  _setEventListeners() {
    this._cardElement
      .querySelector(".card__like-button")
      .addEventListener("click", () => {
        this._handleLikeIcon();
      });

    this._cardElement
      .querySelector(".card__delete-button")
      .addEventListener("click", () => {
        if (typeof this._handleDeleteClick === "function") {
          this._handleDeleteClick(this);
        }
      });

    this._cardElement
      .querySelector(".card__image")
      .addEventListener("click", () => {
        if (typeof this._handleImageClick === "function") {
          this._handleImageClick(this._name, this._link);
        }
      });
  }

  removeCard() {
    this._cardElement?.remove();
    this._cardElement = null;
  }

  _handleLikeIcon() {
    const likeButton = this._cardElement.querySelector(".card__like-button");
    likeButton.classList.toggle("card__like-button_active");
    const isLiked = likeButton.classList.contains("card__like-button_active");
    localStorage.setItem(this._storageKey, isLiked);
  }

  getView() {
    this._cardElement = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);

    this._cardElement.querySelector(".card__title").textContent = this._name;

    const cardImage = this._cardElement.querySelector(".card__image");
    cardImage.src = this._link;
    cardImage.alt = this._name;

    const wasLiked = localStorage.getItem(this._storageKey) === "true";
    if (wasLiked) {
      this._cardElement
        .querySelector(".card__like-button")
        .classList.add("card__like-button_active");
    }

    this._setEventListeners();
    return this._cardElement;
  }
}