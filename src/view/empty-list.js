import { createElement } from '../util.js';

export const createEmptyListButtonTemplate = () => `
  <h2 class="films-list__title">There are no movies in our database</h2>
`;

export default class EmptyListButton {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEmptyListButtonTemplate();
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
