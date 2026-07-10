export default class UserInfo {
  constructor(profileTitleSelector, profileDescriptionSelector) {
    this._nameElement = document.querySelector(profileTitleSelector);
    this._jobElement = document.querySelector(profileDescriptionSelector);
  }

  getUserInfo() {
    return {
      title: this._nameElement.textContent,
      description: this._jobElement.textContent
    };
  }

  setUserInfo(newUserData) {
    this._nameElement.textContent = newUserData.title;
    this._jobElement.textContent = newUserData.description;
  }
}