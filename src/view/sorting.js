import AbstractView from './abstract.js';
import { SORT_TYPE } from '../const.js';

const addActiveControlClass = (isActive) => isActive ? 'sort__button--active' : '';

const createSortingTemplate = (isActiveType) => `
  <ul class="sort">
    ${Object.values(SORT_TYPE).map((type) => `
      <li><a href="#" class="sort__button ${addActiveControlClass(type === isActiveType)}" data-sort-type="${type}">Sort by ${type}</a></li>
    `).join('')}
  </ul>
`;

export default class Sorting extends AbstractView {
  constructor(currentSortType) {
    super();

    this.currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortingTemplate(this.currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandle(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
