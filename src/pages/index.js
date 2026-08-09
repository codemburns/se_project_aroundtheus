import Card from '../components/Card.js';
import FormValidator from '../components/FormValidator.js';
import '../pages/index.css';
import Section from '../components/Section.js';
import { PopupWithImage } from '../components/PopupWithImage.js';
import PopupWithForm from '../components/PopupWithForm.js';
import UserInfo from '../components/UserInfo.js';
import { validationConfig } from '../utils/constants.js';
import Api from '../components/Api.js';

const userInfo = new UserInfo('.profile__title', '.profile__description');
const api = new Api({
  baseUrl: 'https://around-api.en.tripleten-services.com/v1',
  headers: {
    authorization: 'a2233512-9267-4ac9-991f-dcc8ccbcf386',
    'Content-Type': 'application/json'
  }
});

let cardToDelete = null;
const deletedCardIds = new Set();
let currentUserId = null;

const addCardForm = document.querySelector('#popup-add-modal .modal__form');
const editProfileForm = document.querySelector('#profile-edit-modal .modal__form');
const avatarForm = document.querySelector('#change-avatar-modal .modal__form');

const addCardValidator = new FormValidator(validationConfig, addCardForm);
addCardValidator.enableValidation();

const editProfileValidator = new FormValidator(validationConfig, editProfileForm);
editProfileValidator.enableValidation();

const avatarValidator = new FormValidator(validationConfig, avatarForm);
avatarValidator.enableValidation();

const imagePopup = new PopupWithImage('#image-popup');
imagePopup.setEventListeners();

const profileEditPopup = new PopupWithForm({
  popupSelector: '#profile-edit-modal',
  handleFormSubmit: async (formData) => {
    try {
      const userData = await api.updateUserInfo({
        name: formData.title,
        about: formData.description
      });

      userInfo.setUserInfo({
        title: userData.name,
        description: userData.about
      });

      profileEditPopup.close();
      editProfileValidator.resetValidation();
    } catch (err) {
      console.error('Profile update failed:', err);
    }
  }
});
profileEditPopup.setEventListeners();

const profileAddPopup = new PopupWithForm({
  popupSelector: '#popup-add-modal',
  handleFormSubmit: async (formData) => {
    try {
      const newCardData = await api.addCard({
        name: formData.title,
        link: formData.description
      });

      const newCardElement = createCard(newCardData);
      cardSection.addItem(newCardElement, false);
      profileAddPopup.close();
      addCardValidator.resetValidation();
    } catch (err) {
      console.error('Card creation failed:', err);
    }
  }
});

profileAddPopup.setEventListeners();

const profileAvatarPopup = new PopupWithForm({
  popupSelector: '#change-avatar-modal',
  handleFormSubmit: async (formData) => {
    try {
      const userData = await api.updateAvatar(formData.avatar);
      const profileImage = document.querySelector('.profile__image');

      if (profileImage) {
        profileImage.src = userData.avatar;
      }

      profileAvatarPopup.close();
      avatarValidator.resetValidation();
    } catch (err) {
      console.error('Avatar update failed:', err);
    }
  }
});
profileAvatarPopup.setEventListeners();

const cardDeletePopup = new PopupWithForm({
  popupSelector: '#card-delete-modal',
  handleFormSubmit: async () => {
    if (!cardToDelete || !cardToDelete._id) {
      cardDeletePopup.close();
      return;
    }

    try {
      await api.deleteCard(cardToDelete._id);
      deletedCardIds.add(cardToDelete._id);
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

const profileEditButton = document.querySelector('#profile-edit-button');
if (profileEditButton) {
  profileEditButton.addEventListener('click', () => {
    const currentData = userInfo.getUserInfo();
    profileEditPopup.setInputValues(currentData);
    profileEditPopup.open();
  });
}

const profileAddButton = document.querySelector('#profile-add-button');
if (profileAddButton) {
  profileAddButton.addEventListener('click', () => {
    profileAddPopup.open();
  });
}

const overlayButton = document.querySelector('.profile__overlay-icon');
if (overlayButton) {
  overlayButton.addEventListener('click', () => {
    profileAvatarPopup.open();
  });
}

const profileImage = document.querySelector('.profile__image');
if (profileImage) {
  profileImage.addEventListener('click', () => {
    profileAvatarPopup.open();
  });
}

const normalizeCardData = (cardData) => {
  const normalizedId = cardData._id || cardData.id;
  const likes = Array.isArray(cardData.likes) ? cardData.likes : [];
  const hasExplicitLikeState = typeof cardData.isLiked === 'boolean';
  const isLiked = hasExplicitLikeState
    ? Boolean(cardData.isLiked)
    : currentUserId
      ? likes.some((like) => {
          if (typeof like === 'string') {
            return like === currentUserId;
          }

          return like?._id === currentUserId || like?.id === currentUserId;
        })
      : false;

  return {
    ...cardData,
    _id: normalizedId,
    id: normalizedId,
    isLiked
  };
};

const createCard = (cardData) => {
  const normalizedCardData = normalizeCardData(cardData);
  const card = new Card(
    normalizedCardData,
    '#card-template',
    (name, link) => {
      imagePopup.open(name, link);
    },
    (cardInstance) => {
      cardToDelete = cardInstance;
      cardDeletePopup.open();
    },
    async (cardInstance) => {
      const wasLiked = cardInstance._isLiked;
      const nextLikedState = !wasLiked;
      cardInstance.setLikedState(nextLikedState);

      try {
        const updatedCard = await api.toggleLike(cardInstance._id, nextLikedState);
        const nextCardData = normalizeCardData({
          ...updatedCard,
          _id: updatedCard._id || updatedCard.id,
          id: updatedCard._id || updatedCard.id,
          isLiked: updatedCard.isLiked ?? nextLikedState
        });

        cardInstance.updateCardData(nextCardData);
      } catch (err) {
        cardInstance.setLikedState(wasLiked);
        console.error('Like update failed:', err);
      }
    }
  );
  return card.getView();
};

const cardSection = new Section({
  items: [],
  renderer: (cardData) => {
    const cardElement = createCard(cardData);
    cardSection.addItem(cardElement);
  }
}, '.cards__list');

const renderCardsFromServer = async () => {
  try {
    const cardsData = await api.getInitialCards();
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

const loadUserProfile = async () => {
  try {
    const userData = await api.getUserInfo();
    currentUserId = userData._id;
    userInfo.setUserInfo({
      title: userData.name,
      description: userData.about
    });

    const profileImage = document.querySelector('.profile__image');
    if (profileImage && userData.avatar) {
      profileImage.src = userData.avatar;
    }
  } catch (err) {
    console.error('Initial application load failure:', err);
  }
};

const initApp = async () => {
  await loadUserProfile();
  await renderCardsFromServer();
};

initApp();