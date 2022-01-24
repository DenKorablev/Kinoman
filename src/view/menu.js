import AbstractView from './abstract.js';
import { generateFilters } from '../mock/filters.js';

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

export default class Menu extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createMenuTemplate(this._films);
  }
}
