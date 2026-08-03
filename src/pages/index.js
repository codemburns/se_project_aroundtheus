import Card from '../components/Card.js';
import FormValidator from '../components/FormValidator.js';
import '../pages/index.css';
import Section from '../components/Section.js';
import { PopupWithImage } from '../components/PopupWithImage.js';
import PopupWithForm from '../components/PopupWithForm.js';
import UserInfo from '../components/UserInfo.js';
import { Popup } from '../components/Popup.js';
import { validationConfig, initialCards } from "../utils/constants.js";
import Api from '../components/Api.js';

// 2. Select the form element from the DOM
const userInfo = new UserInfo('.profile__title', '.profile__description');
const api = new Api({
  baseUrl: 'https://around-api.en.tripleten-services.com/v1',
  headers: {
    authorization: 'a2233512-9267-4ac9-991f-dcc8ccbcf386',
    'Content-Type': 'application/json'
  }
});

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
let cardToDelete = null;
const createCard = (cardData) => {
  const card = new Card(
    cardData,
    '#card-template',
    (name, link) => {
      imagePopup.open(name, link);
    },
    (cardElement) => {
      cardToDelete = cardElement;
      cardDeletePopup.open();
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
  handleFormSubmit: async (formData) => {
    try {
      const response = await fetch(`${api._baseUrl}/users/me`, {
        method: 'PATCH',
        headers: api._headers,
        body: JSON.stringify({
          name: formData.title,
          about: formData.description
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      userInfo.setUserInfo({
        title: data.name || formData.title,
        description: data.about || formData.description
      });
      profileEditPopup.close();
    } catch (err) {
      console.error('Profile update failed:', err);
    }
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
  handleFormSubmit: async (formData) => {
    try {
      const response = await fetch(`${api._baseUrl}/cards`, {
        method: 'POST',
        headers: api._headers,
        body: JSON.stringify({
          name: formData.title,
          link: formData.description
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const newCardData = await response.json();
      const newCardElement = createCard(newCardData);
      cardSection.addItem(newCardElement);
      profileAddPopup.close();
      addCardValidator.resetValidation();
    } catch (err) {
      console.error('Card creation failed:', err);
    }
  }
});

const profileAddButton = document.querySelector('#profile-add-button');
profileAddButton.addEventListener('click', () => {
  profileAddPopup.open();
});

profileAddPopup.setEventListeners();

// --- Delete Card Popup ---
const cardDeletePopup = new PopupWithForm({
  popupSelector: '#card-delete-modal',
  handleFormSubmit: () => {
  
    if (cardToDelete) {
      cardToDelete.remove();
      cardDeletePopup.close();
    }
  }
});

cardDeletePopup.setEventListeners();

// --- Change Profile Avatar Popup ---
const profileAvatarPopup = new PopupWithForm({
  popupSelector: '#change-avatar-modal',
  handleFormSubmit: async (formData) => {
    try {
      const response = await fetch(`${api._baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: api._headers,
        body: JSON.stringify({ avatar: formData.avatar })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const profileImage = document.querySelector('.profile__image');
      if (profileImage) {
        profileImage.src = formData.avatar;
      }
      profileAvatarPopup.close();
    } catch (err) {
      console.error('Avatar update failed:', err);
    }
  }
});

profileAvatarPopup.setEventListeners();

const overlayButton = document.querySelector('.profile__overlay-icon');
if (overlayButton) {
  overlayButton.addEventListener('click', () => {
    profileAvatarPopup.open();
  });
}
