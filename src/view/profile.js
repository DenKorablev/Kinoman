import AbstractView from './abstract.js';
import { getProfileRaiting } from '../utils/common.js';

const createProfileTemplate = (films) => {
  const status = getProfileRaiting(films);
  return films.length ? `
    <section class="header__profile profile">
      <p class="profile__rating">${status}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
  ` : '';
};

export default class Profile extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createProfileTemplate(this._films);
  }
}
