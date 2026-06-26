import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import "../pages/index.css";
import { initialCards } from "../utils/constants.js";
import Section from '../components/Section.js';
import { PopupWithImage } from '../components/PopupWithImage.js';
import { PopupWithForm } from '../components/PopupWithForm.js';
import UserInfo from '../components/UserInfo.js';
import { Popup } from '../components/Popup.js';

//Wrappers
const placesList = document.querySelector(".cards__list");

const addTitleInput = document.querySelector("#add-title-input");
const addDescriptionInput = document.querySelector("#add-description-input");
//Elements*Buttons
const profileEditButton = document.querySelector("#profile-edit-button");
const profileEditModal = document.querySelector("#profile-edit-modal");
const profileCloseButton = document.querySelector("#profile-close-modal");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileTitleInput = document.querySelector("#profile-title-input");
const profileDescriptionInput = document.querySelector(
  "#profile-description-input",
);
const profileEditForm = profileEditModal.querySelector(".modal__form");
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardListElem = document.querySelector(".cards__list");
const popupAddModal = document.querySelector("#popup-add-modal");
const addCloseButton = document.querySelector("#place-close-modal");
const placesAddForm = popupAddModal.querySelector(".modal__form");
const profileAddButton = document.querySelector("#profile-add-button");
const imageCloseButton = document.querySelector("#popup-close-modal");
const closeButtons = document.querySelectorAll(".modal__close");
const imagePopup = new PopupWithImage({ popupSelector: '#image-popup' });
imagePopup.setEventListeners();

//Functions
closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closeModal(popup));
});

function getCardElement(cardData) {

  //Card image click event to open the image popup

  const card = new Card(
  cardData,           // The raw item data (e.g., { name, link })
  "#card-template",   // Your template selector
  (data) => {         // <--- This is your callback function!
    imagePopup.open(data);
  });
 
 return card.getView();
}
// 2. Define the event handler for card/image clicks
function handleCardClick(cardData) {
  imagePopup.open(cardData);
}

//Event Handlers
function handleProfileEditSubmit(e) {
  e.preventDefault();
  profileTitle.textContent = profileTitleInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closeModal(profileEditModal);
}

function handleAddFormSubmit(e) {
  e.preventDefault();
  const name = addTitleInput.value;
  const link = addDescriptionInput.value;
  renderCard({ name, link }, placesList);
  placesAddForm.reset();
  closeModal(popupAddModal);
}

//Event Listeners
profileEditButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;

  openModal(profileEditModal);
});

profileAddButton.addEventListener("click", () => {
  openModal(popupAddModal);
});

placesAddForm.addEventListener("submit", handleAddFormSubmit);

profileEditForm.addEventListener("submit", handleProfileEditSubmit);

const renderCard = (data, wrapper) => {
  const newCard = getCardElement(data);
  wrapper.prepend(newCard);
};

initialCards.forEach((cardData) => {
  renderCard(cardData, placesList);
});

//Popup elements

let activeModal = null;

function openModal(modal) {
  modal.classList.add("modal_opened");
  activeModal = modal;
  document.addEventListener("keydown", handleEscapeKey);
}

function resetModalForm(modal) {
  const errorDisplay = modal.querySelector(".modal__error");
  if (errorDisplay) {
    errorDisplay.textContent = "";
  }
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  resetModalForm(modal);
  activeModal = null;
  document.removeEventListener("keydown", handleEscapeKey);
}

const handleEscapeKey = (evt) => {
  if (evt.key === "Escape") {
    if (activeModal) {
      closeModal(activeModal);
    }
  }
};

const popups = document.querySelectorAll(".modal");

popups.forEach((popup) => {
  popup.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("modal_opened")) {
      closeModal(popup);
    }
  });
});
