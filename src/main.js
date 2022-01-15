import { createMenuTemplate } from './view/menu.js';
import { createProfileTemplate } from './view/profile.js';
import { createFilmCardTemplate } from './view/film-card.js';
import { createShowMoreButtonTemplate } from './view/show-more-btn.js';
import { createPopupTemplate } from './view/popup.js';
import { createStatisticsTemplate } from './view/statistics.js';

const FILMS_COUNT = 5;
const EXTRA_COUNT = 2;
const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

const siteBodyElement = document.querySelector('body');
const headerElement = siteBodyElement.querySelector('.header');
render(headerElement, createProfileTemplate());

const mainElement = siteBodyElement.querySelector('.main');
render(mainElement, createMenuTemplate());

const filmsListElement = mainElement.querySelector('.films-list');
const filmsListExtraElement = mainElement.querySelectorAll('.films-list--extra');

const allFilmsListElement = filmsListElement.querySelector('.films-list__container');
for(let i = 0; i < FILMS_COUNT; i++) {
  render(allFilmsListElement, createFilmCardTemplate());
}
const topRatedElement = filmsListExtraElement[0].querySelector('.films-list__container');
for(let i = 0; i < EXTRA_COUNT; i++) {
  render(topRatedElement, createFilmCardTemplate());
}
const mostCommentedElement = filmsListExtraElement[1].querySelector('.films-list__container');
for(let i = 0; i < EXTRA_COUNT; i++) {
  render(mostCommentedElement, createFilmCardTemplate());
}
render(allFilmsListElement, createShowMoreButtonTemplate());

render(siteBodyElement, createPopupTemplate());

const footerStaisticsElement = siteBodyElement.querySelector('.footer__statistics');
render(footerStaisticsElement, createStatisticsTemplate());

