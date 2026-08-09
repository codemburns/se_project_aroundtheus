export default class Card {
  constructor(data, cardSelector, handleImageClick, handleDeleteClick, handleLikeClick) {
    const cardData = data || {};
    this._name = cardData.name || "Untitled";
    this._link = cardData.link || "";
    this._id = cardData._id || cardData.id || "";
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
    this._handleDeleteClick = handleDeleteClick;
    this._handleLikeClick = handleLikeClick;
    this._isLiked = Boolean(cardData.isLiked)
  }

  _setEventListeners() {
      this._cardElement
      .querySelector(".card__like-button")
      .addEventListener("click", () => {
        if (typeof this._handleLikeClick === "function") {
          this._handleLikeClick(this);
        }
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

  setLikedState(isLiked) {
    this._isLiked = Boolean(isLiked);

    if (!this._cardElement) {
      return;
    }

    const likeButton = this._cardElement.querySelector(".card__like-button");
    if (likeButton) {
      likeButton.classList.toggle("card__like-button_active", this._isLiked);
    }
  }

  updateCardData(cardData) {
    const newCardData = cardData || {};
    this._name = newCardData.name || this._name;
    this._link = newCardData.link || this._link;
    this._id = newCardData._id || newCardData.id || this._id;
    this._isLiked = Boolean(newCardData.isLiked);

    if (this._cardElement) {
      this._cardElement.querySelector(".card__title").textContent = this._name;

      const cardImage = this._cardElement.querySelector(".card__image");
      cardImage.src = this._link;
      cardImage.alt = this._name;

      this.setLikedState(this._isLiked);
    }
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

    this.setLikedState(this._isLiked);

    this._setEventListeners();
    return this._cardElement;
  }
}