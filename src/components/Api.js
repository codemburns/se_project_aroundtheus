export default class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }
}

fetch("https://around-api.en.tripleten-services.com/v1/users/me", {
  method: "PATCH",
  headers: {
    authorization: "a2233512-9267-4ac9-991f-dcc8ccbcf386",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "Jacques Cousteau",
    about: "Explorer"
  })
})
  .then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  })
  .then((data) => {
    console.log("Success:", data);
  })
  .catch((err) => {
    console.error("Request failed:", err);
  });

fetch("https://around-api.en.tripleten-services.com/v1/cards", {
  method: "POST",
  headers: {
    authorization: "a2233512-9267-4ac9-991f-dcc8ccbcf386",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lago.jpg"
  })
})
  .then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  })
  .then((data) => {
    console.log("Success:", data);

    // Clear the form after successful submission
    document.querySelector("form").reset();
  })
  .catch((err) => {
    console.error("Request failed:", err);
  });

function deleteCard(cardId) {
  // Verify the ID is valid before fetching
  if (!cardId || cardId === "card-id-to-delete") {
    console.error("Invalid card ID provided");
    return;
  }
  fetch(`https://around-api.en.tripleten-services.com/v1/cards/${cardId}`, {
    method: "DELETE",
    headers: {
      authorization: "a2233512-9267-4ac9-991f-dcc8ccbcf386",
      "Content-Type": "application/json"
    }
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("This post has been deleted:", data);
      document.querySelector("form")?.reset();
    })
    .catch((err) => {
      console.error("Request failed:", err);
    });
}

// Example usage:
deleteCard("card-id-to-delete");

function likeCard(card) {
  // Prevent crash if card data is missing
  if (!card || !card._id) {
    console.error("Invalid card object provided:", card);
    return;
  }
  
  const cardId = card._id;
  fetch(`https://around-api.en.tripleten-services.com/v1/cards/${cardId}/likes`, {
    method: "PUT",
    headers: {
      authorization: "a2233512-9267-4ac9-991f-dcc8ccbcf386",
      "Content-Type": "application/json"
    },
  })
  .then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  })
  .then((data) => {
    console.log("Success:", data);
  })
  .catch((err) => {
    console.error("Request failed:", err);
  });
}

  function unlikeCard(card) {
  // Prevent crash if card data is missing
  if (!card || !card._id) {
    console.error("Invalid card object provided:", card);
    return;
  }
  
  const cardId = card._id;
  fetch(`https://around-api.en.tripleten-services.com/v1/cards/${cardId}/likes`, {
    method: "DELETE",
    headers: {
      authorization: "a2233512-9267-4ac9-991f-dcc8ccbcf386",
      "Content-Type": "application/json"
    },
  })
  .then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  })
  .then((data) => {
    console.log("Success:", data);
  })
  .catch((err) => {
    console.error("Request failed:", err);
  });
}

function updateAvatar(avatarUrl) {
  if (!avatarUrl) {
    throw new Error("Avatar URL is required");
  }

  let validUrl;

  try {
    validUrl = new URL(avatarUrl);
  } catch {
    throw new Error("Avatar must be a valid URL");
  }

  if (!["http:", "https:"].includes(validUrl.protocol)) {
    throw new Error("Avatar must use http or https");
  }

  fetch("https://around-api.en.tripleten-services.com/v1/users/me/avatar", {
    method: "PATCH",
    headers: {
      authorization: "a2233512-9267-4ac9-991f-dcc8ccbcf386",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      avatar: validUrl.toString()
    })
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((err) => {
      console.error("Request failed:", err);
    });
}
