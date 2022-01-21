import { createElement } from '../util.js';

const getProfileRaiting = (films) => {
  const watched = films.filter((film) => film.userDetails.alreadyWatched);
  if (watched.length > 0 && watched.length <= 10) {
    return 'novice';
  } else if (watched.length > 10 && watched.length <= 20) {
    return 'fan';
  } else if (watched.length > 20) {
    return 'movie buff';
  }
};

const createProfileTemplate = (films) => {
  const status = getProfileRaiting(films);
  return films.length ? `
    <section class="header__profile profile">
      <p class="profile__rating">${status}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
  ` : '';
};

export default class Profile {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return createProfileTemplate(this._films);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
