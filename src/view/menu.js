import { generateFilters } from '../mock/filters.js';

const getActiveClassName = (condition) => condition ? 'main-navigation__item--active' : '';
const crateFilterContainer = (films) => `
  <div class="main-navigation__items">
    ${generateFilters(films).map(({name, text, count}) => `
      <a href="#${name}" class="main-navigation__item ${getActiveClassName(name === 'all')}">${text} ${count}</a>
    `).join(' ')}
  </div>
`;

export const createMenuTemplate = (films) => `
  <nav class="main-navigation">
    ${crateFilterContainer(films)}
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>

  <ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>

  <section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>
    </section>

    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container"></div>
    </section>

    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container"></div>
    </section>
  </section>
`;
