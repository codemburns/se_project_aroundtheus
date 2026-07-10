import Card from '../components/Card.js';
import FormValidator from '../components/FormValidator.js';
import '../pages/index.css';
import Section from '../components/Section.js';
import { PopupWithImage } from '../components/PopupWithImage.js';
import PopupWithForm from '../components/PopupWithForm.js';
import UserInfo from '../components/UserInfo.js';
import { Popup } from '../components/Popup.js';
import { validationConfig, initialCards } from "../utils/constants.js";

// 2. Select the form element from the DOM
const userInfo = new UserInfo('.profile__title', '.profile__description');

// 1. Grab the specific form elements inside each modal
const addCardForm = document.querySelector("#popup-add-modal .modal__form");
const editProfileForm = document.querySelector("#profile-edit-modal .modal__form");

const addCardCloseButton = document.querySelector("#popup-add-modal .modal__close");

const editCardCloseButton = document.querySelector("#profile-edit-modal .modal__close");

// 2. Instantiate a FormValidator for the Add Card form
const addCardValidator = new FormValidator(validationConfig, addCardForm);
addCardValidator.enableValidation();

// 3. Instantiate a FormValidator for the Edit Profile form
const editProfileValidator = new FormValidator(validationConfig, editProfileForm);
editProfileValidator.enableValidation();

// --- Image Preview Popup ---
const imagePopup = new PopupWithImage('#image-popup');
imagePopup.setEventListeners();

const createCard = (cardData) => {
  const card = new Card(
    cardData,
    '#card-template',
    (name, link) => {
      imagePopup.open(name, link);
    }
  );
  return card.getView();
};

// --- Initial Cards Rendering ---
const cardSection = new Section({
    items: initialCards,
    renderer: (cardData) => {
      const cardElement = createCard(cardData);
      cardSection.addItem(cardElement);
    }
  }, 
  '.cards__list'
);

cardSection.renderItems();

// --- Profile Edit Popup ---
const profileEditPopup = new PopupWithForm({
  popupSelector: '#profile-edit-modal',
  handleFormSubmit: (formData) => {
    userInfo.setUserInfo({
      title: formData.title,
      description: formData.description
    });
    profileEditPopup.close();
  }
});

profileEditPopup.setEventListeners();

const openProfileEditPopup = () => {
  const currentData = userInfo.getUserInfo();
  profileEditPopup.setInputValues(currentData);
  profileEditPopup.open();
};

const profileEditButton = document.querySelector('#profile-edit-button');
profileEditButton.addEventListener('click', openProfileEditPopup);

const openProfileButton = document.querySelector(".profile__edit-button");
openProfileButton.addEventListener("click", openProfileEditPopup);

// --- Add Card Popup ---
const profileAddPopup = new PopupWithForm({
  popupSelector: '#popup-add-modal',
  handleFormSubmit: (formData) => {
    const newCardData = { name: formData.title, link: formData.description };
    const newCardElement = createCard(newCardData);
    cardSection.addItem(newCardElement);
    profileAddPopup.close();
  }
});

const profileAddButton = document.querySelector('#profile-add-button');
profileAddButton.addEventListener('click', () => {
  profileAddPopup.open();
});

profileAddPopup.setEventListeners();

