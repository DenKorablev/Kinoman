import AbstractView from './abstract.js';

const getActiveClassName = (condition) => condition ? 'main-navigation__item--active' : '';
const crateFilterContainer = (filters, currentFilter) => `
  <div class="main-navigation__items">
    ${filters.map(({type, name, count}) => `
      <a href="#${name}" class="main-navigation__item ${getActiveClassName(type === currentFilter)}" data-filter="${type}">${name} ${count}</a>
    `).join(' ')}
  </div>
`;

const createMenuTemplate = (films, currentFilter) => `
  <nav class="main-navigation">
    ${crateFilterContainer(films, currentFilter)}
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>
`;

export default class Menu extends AbstractView {
  constructor(filters, currentFilter) {
    super();
    this._filters = filters;

    this._currentFilter = currentFilter;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }
}
