import AbstractView from './abstract.js';

const getActiveClassName = (condition) => condition ? 'main-navigation__item--active' : '';
const createFilterTemplate = (filters, currentFilter) => `
  <div class="main-navigation__items">
    ${filters.map(({type, name, count}) => `
      <a href="#${name}" class="main-navigation__item ${getActiveClassName(type === currentFilter)}" data-filter="${type}">${name} ${count}</a>
    `).join(' ')}
  </div>
`;

export default class Filter extends AbstractView {
  constructor(filters, currentFilter) {
    super();
    this._filters = filters;

    this._currentFilter = currentFilter;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.dataset.filter === this._currentFilter) {
      return;
    }
    this._callback.filterTypeChange(evt.target.dataset.filter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }
}
