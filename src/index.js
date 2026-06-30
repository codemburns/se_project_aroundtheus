import Card from '../components/Card.js';
import FormValidator from '../components/FormValidator.js';
import '../pages/index.css';
import { initialCards } from '../utils/constants.js';
import Section from '../components/Section.js';
import { PopupWithImage } from '../components/PopupWithImage.js';
import PopupWithForm from '../components/PopupWithForm.js';
import UserInfo from '../components/UserInfo.js';
import { Popup } from '../components/Popup.js';

// 1. The configuration settings for validation
const validationConfig = {
  formSelector: ".modal__form",
  inputSelector: ".modal__field",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible"
};

// 2. Select the form element from the DOM
const formElement = document.querySelector(".modal__form");
const formValidator = new FormValidator(validationConfig, formElement);

// 3. Call the method to enable validation
formValidator.enableValidation();

// 1. Grab the specific form elements inside each modal
const addCardForm = document.querySelector("#popup-add-modal .modal__form");
const editProfileForm = document.querySelector("#profile-edit-modal .modal__form");

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
    document.querySelector('.profile__name').textContent = formData.name;
    document.querySelector('.profile__description').textContent = formData.description;
    profileEditPopup.close();
  }
});

profileEditPopup.setEventListeners();

const profileEditButton = document.querySelector('#profile-edit-button');
profileEditButton.addEventListener('click', () => {
  profileEditPopup.open();
});

// --- Add Card Popup ---
const profileAddPopup = new PopupWithForm({
  popupSelector: '#popup-add-modal',
  handleFormSubmit: (formData) => {
    const newCardData = { name: formData.name, link: formData.link };
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