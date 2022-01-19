import { createMenuTemplate } from './view/menu.js';
import { createProfileTemplate } from './view/profile.js';
import { createFilmCardTemplate } from './view/film-card.js';
import { createShowMoreButtonTemplate } from './view/show-more-btn.js';
import { createPopupTemplate } from './view/popup.js';
import { createStatisticsTemplate } from './view/statistics.js';
import { generateFilms } from './mock/data.js';

const FILMS_COUNT = 15;
const EXTRA_COUNT = 2;

const filmsData = new Array(FILMS_COUNT).fill().map(generateFilms);
const generateFavoriteFilms = () => {
  const films = filmsData.slice().sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
  return films.slice(0, EXTRA_COUNT);
};
const generateCommentedFilms = () => {
  const films = filmsData.slice().sort((a, b) => b.comments.length - a.comments.length);
  return films.slice(0, EXTRA_COUNT);
};

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
for(let i = 1; i < filmsData.length; i++) {
  render(allFilmsListElement, createFilmCardTemplate(filmsData[i]));
}
const topRatedElement = filmsListExtraElement[0].querySelector('.films-list__container');
const topFilmsData = generateFavoriteFilms();
for(let i = 0; i < topFilmsData.length; i++) {
  render(topRatedElement, createFilmCardTemplate(topFilmsData[i]));
}
const mostCommentedElement = filmsListExtraElement[1].querySelector('.films-list__container');
const commentedFilms = generateCommentedFilms();
for(let i = 0; i < commentedFilms.length; i++) {
  render(mostCommentedElement, createFilmCardTemplate(commentedFilms[i]));
}
render(allFilmsListElement, createShowMoreButtonTemplate());

render(siteBodyElement, createPopupTemplate(filmsData[0]));

const footerStaisticsElement = siteBodyElement.querySelector('.footer__statistics');
render(footerStaisticsElement, createStatisticsTemplate());

