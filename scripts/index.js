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
const placesAddForm = popupAddModal.querySelector(".modal__form");
const profileAddButton = document.querySelector("#profile-add-button");
const cardTitleInput = placesAddForm.querySelector(".modal__field_type_title");
const cardUrlInput = placesAddForm.querySelector(".modal__field_type_url");
const imageCloseButton = document.querySelector("#popup-close-modal");
const imagePopup = document.querySelector("#image-popup");
const popupImage = imagePopup.querySelector(".modal__image");
const popupCaption = imagePopup.querySelector(".modal__caption");
const closeButtons = document.querySelectorAll(".modal__close");

//Functions
closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closeModal(popup));
});

function getCardElement(cardData) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardImageElem = cardElement.querySelector(".card__image");
  const cardTitleElem = cardElement.querySelector(".card__title");

  cardTitleElem.textContent = cardData.name;
  cardImageElem.src = cardData.link;
  cardImageElem.alt = cardData.name;

  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  likeButton.addEventListener("click", () => {
    likeButton.classList.toggle("card__like-button_active");
  });

  deleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

  const handlePreviewPicture = (data) => {
    popupImage.src = data.link;
    popupImage.alt = data.name;
    popupCaption.textContent = data.name;
    openModal(imagePopup);
  };

  cardImageElem.addEventListener("click", () => handlePreviewPicture(cardData));

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
  const name = cardTitleInput.value;
  const link = cardUrlInput.value;
  renderCard({ name, link }, placesList);
  placesAddForm.reset();
  cardListElem.prepend();
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

function openModal(modal) {
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}
