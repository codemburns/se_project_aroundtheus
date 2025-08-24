const initialCards = [
  {
    name: "Yosemite Valley",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/yosemite.jpg",
  },
  {
    name: "Lake Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lake-louise.jpg",
  },
  {
    name: "Bald Mountains",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/bald-mountains.jpg",
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/latemar.jpg",
  },
  {
    name: "Vanoise National Park",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/vanoise.jpg",
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lago.jpg",
  },
];

//Wrappers
const modalWindow = document.querySelector(".popup");
const editForm = document.querySelector(".popup__form");
const placesList = document.querySelector(".cards__list");

//Elements*Buttons
const profileEditButton = document.querySelector("#profile-edit-button");
const profileEditModal = document.querySelector("#profile-edit-modal");
const profileCloseButton = document.querySelector("#profile-close-modal");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileTitleInput = document.querySelector("#profile-title-input");
const profileDescriptionInput = document.querySelector(
  "#profile-description-input"
);
const profileEditForm = profileEditModal.querySelector(".modal__form");
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardListElem = document.querySelector(".cards__list");
const popupAddModal = document.querySelector("#popup-add-modal");
const addCloseButton = document.querySelector("#place-close-modal");
const placesAddForm = document.querySelector(".modal__form2");
const profileAddButton = document.querySelector("#profile-add-button");

//Functions
function closePopup() {
  profileEditModal.classList.remove("modal_opened");

  popupAddModal.classList.remove("modal_opened");
}

function getCardElement(cardData) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardImageElem = cardElement.querySelector(".card__image");
  const cardTitleElem = cardElement.querySelector(".card__title");

  cardTitleElem.textContent = cardData.name;
  cardImageElem.src = cardData.link;
  cardImageElem.alt = cardData.name;

  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  deleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

  return cardElement;
}

//Event Handlers
function handleProfileEditSubmit(e) {
  e.preventDefault();
  profileTitle.textContent = profileTitleInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closePopup();
}

function handleAddFormSubmit(e) {
  e.preventDefault();

  closePopup();
}

//Event Listeners
profileEditButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;

  profileEditModal.classList.add("modal_opened");
});

profileAddButton.addEventListener("click", () => {
  console.log("Before:", popupAddModal.classList);
  popupAddModal.classList.add("modal_opened");
  console.log("After:", popupAddModal.classList);
});

placesAddForm.addEventListener("submit", handleAddFormSubmit);

profileCloseButton.addEventListener("click", () => {
  closePopup();
});

addCloseButton.addEventListener("click", () => {
  closePopup();
});

//I don't know how to get second modal to add button but it is created, it's under the edit button.
//I also don't know why my cards are duplicated. Please help.

profileEditForm.addEventListener("submit", handleProfileEditSubmit);

initialCards.forEach((cardData) => {
  const cardElement = getCardElement(cardData);
  cardListElem.append(cardElement);
});

const renderCard = (data, wrapper) => {
  const newCard = getCardElement(data);
  wrapper.prepend(newCard);
};

initialCards.forEach((data) => {
  renderCard(data, placesList);
});

//like buttons
const likeButtons = document.querySelectorAll(".card__like-button");
likeButtons.forEach((likeButton) => {
  likeButton.addEventListener("click", () => {
    likeButton.classList.toggle("card__like-button_active");
  });
});
