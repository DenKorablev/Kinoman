import MenuView from './view/menu.js';
import ProfileView from './view/profile.js';
import FilmCardView from './view/film-card.js';
import FilmsListView from './view/films-list.js';
import SortingView from './view/sorting.js';
import ShowMoreButtonView from './view/show-more-btn.js';
import PopupView from './view/popup.js';
import StatisticsView from './view/statistics.js';
import { generateFilms } from './mock/data.js';
import { render } from './util.js';

const FILMS_SHOW_STEP = 5;
const FILMS_COUNT = 18;
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

const siteBodyElement = document.querySelector('body');
const headerElement = siteBodyElement.querySelector('.header');
const mainElement = siteBodyElement.querySelector('.main');

render(headerElement, new ProfileView(filmsData).getElement());
render(mainElement, new MenuView(filmsData).getElement());
render(mainElement, new SortingView().getElement());

render(mainElement, new FilmsListView().getElement());

const filmsListElement = mainElement.querySelector('.films-list');
const filmsListExtraElement = mainElement.querySelectorAll('.films-list--extra');

const allFilmsListElement = filmsListElement.querySelector('.films-list__container');
for(let i = 1; i <= Math.min(filmsData.length, FILMS_SHOW_STEP); i++) {
  render(allFilmsListElement, new FilmCardView(filmsData[i]).getElement());
}
const topRatedElement = filmsListExtraElement[0].querySelector('.films-list__container');
const topFilmsData = generateFavoriteFilms();
for(let i = 0; i < topFilmsData.length; i++) {
  render(topRatedElement, new FilmCardView(topFilmsData[i]).getElement());
}
const mostCommentedElement = filmsListExtraElement[1].querySelector('.films-list__container');
const commentedFilms = generateCommentedFilms();
for(let i = 0; i < commentedFilms.length; i++) {
  render(mostCommentedElement, new FilmCardView(commentedFilms[i]).getElement());
}

/* render(siteBodyElement, new PopupView(filmsData[0]).getElement());*/

const footerStaisticsElement = siteBodyElement.querySelector('.footer__statistics');
render(footerStaisticsElement, new StatisticsView(filmsData).getElement());

if (filmsData.length > FILMS_SHOW_STEP) {
  let step = FILMS_SHOW_STEP;
  render(filmsListElement, new ShowMoreButtonView().getElement());
  const showMoreBtn = filmsListElement.querySelector('.films-list__show-more');

  showMoreBtn.addEventListener('click', (evt) => {
    evt.preventDefault();

    filmsData.slice(step, step + FILMS_SHOW_STEP).forEach((film) => {
      render(allFilmsListElement, new FilmCardView(film).getElement());
    });
    step += FILMS_SHOW_STEP;

    if (filmsData.length <= step) {
      showMoreBtn.remove();
    }
  });
}
