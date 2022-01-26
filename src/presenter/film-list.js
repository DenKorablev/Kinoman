import FilmsView from '../view/films.js';
import FilmsListView from '../view/films-list.js';
import FilmsListExtraView from '../view/films-list-extra.js';
import FilmsListContainerView from '../view/films-list-container.js';
import SortingView from '../view/sorting.js';
import EmptyListButtonView from '../view/empty-list.js';
import FilmCardView from '../view/film-card.js';
import PopupView from '../view/popup.js';
import ShowMoreButtonView from '../view/show-more-btn.js';
import { render, remove } from '../utils/render.js';
import { isEscEvent } from '../utils/common.js';

const FILMS_SHOW_STEP = 5;
const EXTRA_COUNT = 2;

export default class FilmList {
  constructor(filmsListContainer) {
    this._filmsListContainer = filmsListContainer;
    this._renderedFilmsStep = FILMS_SHOW_STEP;
    this._filmsComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListContainerComponent = new FilmsListContainerView();
    this._sortComponent = new SortingView();
    this._emptyListComponent = new EmptyListButtonView();
    this._showMoreComponent = new ShowMoreButtonView();

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
  }

  init(films) {
    this._films = films.slice();
    render(this._filmsListContainer, this._filmsComponent);
    this._renderFilmsList();
  }

  _renderSort() {
    render(this._filmsListComponent, this._sortComponent, 'afterbegin');
  }

  _renderFilm(list, film) {
    const filmComponent = new FilmCardView(film);
    const popupComponent = new PopupView(film);

    const onEscKeydown = (evt) => {
      if (isEscEvent(evt)) {
        evt.preventDefault();
        closePopup();
      }
    };

    const closePopup = () => {
      document.body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', onEscKeydown);
      document.body.removeChild(popupComponent.getElement());
    };

    const openPopup = () => {
      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', onEscKeydown);
      render(document.body, popupComponent);
    };

    filmComponent.setClickHandler(openPopup);
    popupComponent.setPopupClickHandler(closePopup);

    render(list, filmComponent);
  }

  _renderFilmsMain(from, to) {
    this._films.slice(from, to).forEach((film) => this._renderFilm(this._filmsListContainerComponent, film));

    if (this._films.length > this._renderedFilmsStep) {
      this._renderShowMoreButton(this._filmsListContainerComponent);
    }

    this._renderSort();
  }

  _renderFilmsExtra(filmsListExtraComponent, filmsList) {
    if (filmsList.length > 0) {
      const filmsListContainerComponent = new FilmsListContainerView();

      render(this._filmsComponent, filmsListExtraComponent);
      render(filmsListExtraComponent, filmsListContainerComponent);

      filmsList.forEach((film) => {
        this._renderFilm(filmsListContainerComponent, film);
      });
    }
  }

  _renderFilmsMostCommented() {
    const films = this._films.slice()
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, EXTRA_COUNT);

    const extra = new FilmsListExtraView('Most commented');
    this._renderFilmsExtra(extra, films);
  }

  _renderFilmsTopRated() {
    const films = this._films.slice()
      .sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating)
      .slice(0, EXTRA_COUNT);

    const extra = new FilmsListExtraView('Top rated');
    this._renderFilmsExtra(extra, films);
  }

  _handleLoadMoreButtonClick() {
    this._renderFilmsMain(this._renderedFilmsStep, this._renderedFilmsStep + FILMS_SHOW_STEP);
    this._renderedFilmsStep += FILMS_SHOW_STEP;

    if (this._renderedFilmsStep >= this._films.length) {
      remove(this._showMoreComponent);
    }
  }

  _renderShowMoreButton(list) {
    render(list, this._showMoreComponent);
    this._showMoreComponent.setLoadClickHandler(this._handleLoadMoreButtonClick);
  }

  _renderEmptyList() {
    render(this._filmsListContainer, this._emptyListComponent);
  }

  _renderFilmsList() {
    if (this._films.length === 0) {
      this._renderEmptyList();
      return;
    }

    render(this._filmsComponent, this._filmsListComponent);
    render(this._filmsListComponent, this._filmsListContainerComponent);

    this._renderFilmsMain(0, Math.min(this._films.length, FILMS_SHOW_STEP));
    this._renderFilmsTopRated();
    this._renderFilmsMostCommented();
  }
}
