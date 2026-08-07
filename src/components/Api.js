export default class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  async _request(endpoint, options = {}) {
    const response = await fetch(`${this._baseUrl}${endpoint}`, {
      headers: this._headers,
      ...options
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  getUserInfo() {
    return this._request('/users/me');
  }

  updateUserInfo({ name, about }) {
    return this._request('/users/me', {
      method: 'PATCH',
      body: JSON.stringify({ name, about })
    });
  }

  getInitialCards() {
    return this._request('/cards');
  }

  addCard({ name, link }) {
    return this._request('/cards', {
      method: 'POST',
      body: JSON.stringify({ name, link })
    });
  }

  deleteCard(cardId) {
    return this._request(`/cards/${cardId}`, {
      method: 'DELETE'
    });
  }

  updateAvatar(avatar) {
    return this._request('/users/me/avatar', {
      method: 'PATCH',
      body: JSON.stringify({ avatar })
    });
  }
}