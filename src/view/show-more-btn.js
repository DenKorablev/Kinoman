import AbstractView from './abstract.js';

export const createShowMoreButtonTemplate = () => `
  <button class="films-list__show-more">Show more</button>
`;

export default class ShowMoreButton extends AbstractView {
  constructor() {
    super();

    this._loadClickHandler = this._loadClickHandler.bind(this);
  }

  getTemplate() {
    return createShowMoreButtonTemplate();
  }

  _loadClickHandler(evt) {
    evt.preventDefault();
    this._callback.loadClick();
  }

  setLoadClickHandler(callback) {
    this._callback.loadClick = callback;
    this.getElement().addEventListener('click', this._loadClickHandler);
  }
}
