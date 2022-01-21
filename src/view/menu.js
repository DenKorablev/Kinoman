import { generateFilters } from '../mock/filters.js';
import { createElement } from '../util.js';

const getActiveClassName = (condition) => condition ? 'main-navigation__item--active' : '';
const crateFilterContainer = (films) => `
  <div class="main-navigation__items">
    ${generateFilters(films).map(({name, text, count}) => `
      <a href="#${name}" class="main-navigation__item ${getActiveClassName(name === 'all')}">${text} ${count}</a>
    `).join(' ')}
  </div>
`;

const createMenuTemplate = (films) => `
  <nav class="main-navigation">
    ${crateFilterContainer(films)}
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>
`;

export default class Menu {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return createMenuTemplate(this._films);
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
