import MenuView from './view/menu.js';
import ProfileView from './view/profile.js';
import FilmCardView from './view/film-card.js';
import FilmsListView from './view/films-list.js';
import SortingView from './view/sorting.js';
import ShowMoreButtonView from './view/show-more-btn.js';
import PopupView from './view/popup.js';
import StatisticsView from './view/statistics.js';
import EmptyListButtonView from './view/empty-list.js';
import { generateFilms } from './mock/data.js';
import { isEscEvent } from './utils/common.js';
import { render, remove } from './utils/render.js';

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
const footerStaisticsElement = siteBodyElement.querySelector('.footer__statistics');

const renderFilms = (list, film) => {
  const filmComponent = new FilmCardView(film);
  const popupComponent = new PopupView(film);

  const onEscKeydown = (evt) => {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      closePopup();
    }
  };

  const closePopup = () => {
    siteBodyElement.classList.remove('hide-overflow');
    siteBodyElement.removeChild(popupComponent.getElement());
    document.removeEventListener('keydown', onEscKeydown);
  };

  const openPopup = () => {
    siteBodyElement.classList.add('hide-overflow');
    render(siteBodyElement, popupComponent);
    document.addEventListener('keydown', onEscKeydown);
  };

  filmComponent.setClickHandler(openPopup);
  popupComponent.setPopupClickHandler(closePopup);

  render(list, filmComponent);
};

const renderFilmsList = (films) => {
  const filmsListElement = mainElement.querySelector('.films-list');
  if (filmsData.length === 0) {
    render(filmsListElement, new EmptyListButtonView());
  } else {
    const filmsListExtraElement = mainElement.querySelectorAll('.films-list--extra');
    const allFilmsListElement = filmsListElement.querySelector('.films-list__container');
    const topRatedElement = filmsListExtraElement[0].querySelector('.films-list__container');
    const mostCommentedElement = filmsListExtraElement[1].querySelector('.films-list__container');

    for(let i = 1; i <= Math.min(films.length, FILMS_SHOW_STEP); i++) {
      renderFilms(allFilmsListElement, films[i]);
    }

    const topFilmsData = generateFavoriteFilms();
    for(let i = 0; i < topFilmsData.length; i++) {
      renderFilms(topRatedElement, topFilmsData[i]);
    }

    const commentedFilms = generateCommentedFilms();
    for(let i = 0; i < commentedFilms.length; i++) {
      renderFilms(mostCommentedElement, commentedFilms[i]);
    }

    if (films.length > FILMS_SHOW_STEP) {
      let step = FILMS_SHOW_STEP;
      const showMoreComponent = new ShowMoreButtonView();

      render(filmsListElement, showMoreComponent);

      showMoreComponent.setLoadClickHandler(() => {
        films.slice(step, step + FILMS_SHOW_STEP).forEach((film) => renderFilms(allFilmsListElement, film));
        step += FILMS_SHOW_STEP;

        if (films.length <= step) {
          remove(showMoreComponent);
        }
      });
    }
  }
};

render(headerElement, new ProfileView(filmsData));
render(mainElement, new MenuView(filmsData));
render(mainElement, new SortingView());
render(footerStaisticsElement, new StatisticsView(filmsData));
render(mainElement, new FilmsListView());
renderFilmsList(filmsData);


