import Card from '../components/Card.js';
import FormValidator from '../components/FormValidator.js';
import '../pages/index.css';
import Section from '../components/Section.js';
import { PopupWithImage } from '../components/PopupWithImage.js';
import PopupWithForm from '../components/PopupWithForm.js';
import UserInfo from '../components/UserInfo.js';
import { Popup } from '../components/Popup.js';
import { validationConfig } from "../utils/constants.js";
import Api from '../components/Api.js';

// Initialize core instances
const userInfo = new UserInfo('.profile__title', '.profile__description');
const api = new Api({
  baseUrl: 'https://around-api.en.tripleten-services.com/v1',
  headers: {
    authorization: 'a2233512-9267-4ac9-991f-dcc8ccbcf386',
    'Content-Type': 'application/json'
  }
});

// Track card targets for deletions globally
let cardToDelete = null;
const deletedCardIds = new Set();

// Form selectors
const addCardForm = document.querySelector("#popup-add-modal .modal__form");
const editProfileForm = document.querySelector("#profile-edit-modal .modal__form");
const avatarForm = document.querySelector("#change-avatar-modal .modal__form");

// Form Validators
const addCardValidator = new FormValidator(validationConfig, addCardForm);
addCardValidator.enableValidation();

const editProfileValidator = new FormValidator(validationConfig, editProfileForm);
editProfileValidator.enableValidation();

const avatarValidator = new FormValidator(validationConfig, avatarForm);
avatarValidator.enableValidation();

// --- Image Preview Popup ---
const imagePopup = new PopupWithImage('#image-popup');
imagePopup.setEventListeners();

// --- Card Creation Engine ---
const createCard = (cardData) => {
  const card = new Card(
    cardData,
    '#card-template',
    (name, link) => {
      imagePopup.open(name, link);
    },
    (cardInstance) => {
      // Pass the entire card instance object so we can read its server ID later
      cardToDelete = cardInstance;
      cardDeletePopup.open();
    }
  );
  return card.getView();
};

// --- Empty Section Template Wrapper ---
const cardSection = new Section({
    items: [], 
    renderer: (cardData) => {
      const cardElement = createCard(cardData);
      cardSection.addItem(cardElement);
    }
  }, 
  '.cards__list'
);

const renderCardsFromServer = async () => {
  try {
    const response = await fetch(`${api._baseUrl}/cards`, {
      headers: api._headers
    });

    if (!response.ok) {
      throw new Error(`Cards load failed: ${response.status}`);
    }

    const cardsData = await response.json();
    const cardListContainer = document.querySelector('.cards__list');

    if (cardListContainer) {
      cardListContainer.innerHTML = '';
    }

    const seenCards = new Set();

    cardsData.forEach((cardData) => {
      const cardId = cardData._id || cardData.id;
      const cardKey = `${(cardData.name || '').trim().toLowerCase()}|${(cardData.link || '').trim().toLowerCase()}`;

      if (cardId && deletedCardIds.has(cardId)) {
        return;
      }

      if (seenCards.has(cardKey)) {
        return;
      }

      seenCards.add(cardKey);
      const cardElement = createCard(cardData);
      cardSection.addItem(cardElement, true);
    });
  } catch (err) {
    console.error('Failed to refresh cards:', err);
  }
};

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

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      userInfo.setUserInfo({
        title: data.name,
        description: data.about
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

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const newCardData = await response.json();
      const newCardElement = createCard(newCardData);
      
      if (newCardElement !== null) {
        cardSection.addItem(newCardElement, false);
      }
      
      profileAddPopup.close();
      addCardValidator.resetValidation();
    } catch (err) {
      console.error('Card creation failed:', err);
    }
  }
});
profileAddPopup.setEventListeners();

const profileAddButton = document.querySelector('#profile-add-button');
profileAddButton.addEventListener('click', () => {
  profileAddPopup.open();
});

// --- Delete Card Popup with API integration ---
const cardDeletePopup = new PopupWithForm({
  popupSelector: '#card-delete-modal',
  handleFormSubmit: async () => {
    if (!cardToDelete || !cardToDelete._id) {
      cardDeletePopup.close();
      return;
    }

    try {
      const response = await fetch(`${api._baseUrl}/cards/${cardToDelete._id}`, {
        method: 'DELETE',
        headers: api._headers
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }

      const deletedCardId = cardToDelete._id;
      if (deletedCardId) {
        deletedCardIds.add(deletedCardId);
      }

      cardToDelete.removeCard();
      cardToDelete = null;
      cardDeletePopup.close();
      await renderCardsFromServer();
    } catch (err) {
      console.error('Failed to delete card:', err);
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

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

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

// --- Unified App Synchronization Pipeline ---
Promise.all([
  fetch(`${api._baseUrl}/users/me`, { headers: api._headers }).then(res => res.ok ? res.json() : Promise.reject(res.status))
])
  .then(([userData]) => {
    userInfo.setUserInfo({
      title: userData.name,
      description: userData.about
    });

    const profileImage = document.querySelector('.profile__image');
    if (profileImage && userData.avatar) {
      profileImage.src = userData.avatar;
    }
  })
  .catch((err) => {
    console.error('Initial Application Load Failure:', err);
  });

renderCardsFromServer();