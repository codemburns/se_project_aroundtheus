export default class UserInfo {
  constructor(profile__title, profile__description) {
    this._nameElement = document.querySelector(profile__title);
    this._jobElement = document.querySelector(profile__description);
  }

  // 1. Read existing user data from the page
  getUserInfo() {
    return {
      name: this._nameElement.textContent,
      job: this._jobElement.textContent
    };
  }

  // 2. Update user data on the page
  setUserInfo(newUserData) {
    this._nameElement.textContent = newUserData.name;
    this._jobElement.textContent = newUserData.job;
  }
}