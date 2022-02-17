import AbstractView from './abstract.js';
import { FilterType } from '../const.js';

const createMenuTemplate = () => `
  <nav class="main-navigation">
    <a href="#stats" class="main-navigation__additional" data-filter="${FilterType.STATS}">Stats</a>
  </nav>
`;

export default class Menu extends AbstractView {
  constructor() {
    super();

    this._active = FilterType.ALL;
    this._menuChangeHandler = this._menuChangeHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _menuChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.dataset.filter === this._active) {
      return;
    }
    this._active = evt.target.dataset.filter;
    this._setMenuItem(evt.target);
    this._callback.menuClickChange(evt.target.dataset.filter);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClickChange = callback;
    this.getElement().addEventListener('click', this._menuChangeHandler);
  }

  _setMenuItem(target) {
    const item = this.getElement().querySelector('.main-navigation__additional');
    const active = this.getElement().querySelector('.main-navigation__item--active');
    if (target.dataset.filter === FilterType.STATS) {
      active.classList.remove('main-navigation__item--active');
      target.classList.add('main-navigation__item--active');
    } else {
      item.classList.remove('main-navigation__item--active');
    }
  }
}
