import FilmsView from '../view/films.js';
import FilmsListView from '../view/films-list.js';
import FilmsListExtraView from '../view/films-list-extra.js';
import FilmsListContainerView from '../view/films-list-container.js';
import SortingView from '../view/sorting.js';
import EmptyListButtonView from '../view/empty-list.js';
import FilmCardView from '../view/film-card.js';
import PopupView from '../view/popup.js';
import ShowMoreButtonView from '../view/show-more-btn.js';
import { render, remove, replace } from '../utils/render.js';
import { isEscEvent, updateItem } from '../utils/common.js';

const FILMS_SHOW_STEP = 5;
const EXTRA_COUNT = 2;

export default class FilmList {
  constructor(filmsListContainer) {
    this._renderedFilmsStep = FILMS_SHOW_STEP;
    this._filmComponents = {};
    this._filmTopRatedComponents = {};
    this._filmMostCommentedComponents = {};

    this._filmsListContainer = filmsListContainer;
    this._popupComponent = null;
    this._filmsTopRatedComponent = null;
    this._filmsMostCommentedComponent = null;

    this._filmsComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListContainerComponent = new FilmsListContainerView();
    this._sortComponent = new SortingView();
    this._emptyListComponent = new EmptyListButtonView();
    this._showMoreComponent = new ShowMoreButtonView();

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handlePopupClick = this._handlePopupClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
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

  _createFilm(film) {
    const filmComponent = new FilmCardView(film);

    filmComponent.setClickHandler(this._handleFilmCardClick);
    filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    return filmComponent;
  }

  _renderFilm(list, film, componets) {
    const filmComponent = this._createFilm(film);

    componets[film.filmInfo.id] = filmComponent;
    render(list, filmComponent);
  }

  _replaceFilmComponent(filmComponents, film) {
    const oldFilmComponent = filmComponents[film.filmInfo.id];
    const newFilmComponent = this._createFilm(film);

    replace(newFilmComponent, oldFilmComponent);
    remove(oldFilmComponent);

    filmComponents[film.filmInfo.id] = newFilmComponent;
  }

  _renderFilmsMain(from, to) {
    this._films.slice(from, to).forEach((film) => this._renderFilm(this._filmsListContainerComponent, film, this._filmComponents));

    if (this._films.length > this._renderedFilmsStep) {
      this._renderShowMoreButton(this._filmsListContainerComponent);
    }

    this._renderSort();
  }

  _renderFilmsExtra(filmsListExtraComponent, filmsList, componets) {
    if (filmsList.length > 0) {
      const filmsListContainerComponent = new FilmsListContainerView();

      render(this._filmsComponent, filmsListExtraComponent);
      render(filmsListExtraComponent, filmsListContainerComponent);

      filmsList.forEach((film) => {
        this._renderFilm(filmsListContainerComponent, film, componets);
      });
    }
  }

  _renderFilmsMostCommented() {
    const films = this._films.slice()
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, EXTRA_COUNT);

    this._filmsMostCommentedComponent = new FilmsListExtraView('Most commented');
    this._renderFilmsExtra(this._filmsMostCommentedComponent, films, this._filmMostCommentedComponents);
  }

  _renderFilmsTopRated() {
    const films = this._films.slice()
      .sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating)
      .slice(0, EXTRA_COUNT);

    this._filmsTopRatedComponent = new FilmsListExtraView('Top rated');
    this._renderFilmsExtra(this._filmsTopRatedComponent, films, this._filmTopRatedComponents);
  }

  _clearTaskList() {
    Object
      .values(this._filmComponents)
      .forEach((component) => remove(component));
    this._taskPresenter = {};
    this._renderedFilmsStep = FILMS_SHOW_STEP;
    remove(this._showMoreComponent);
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._handlePopupClick();
    }
  }

  _handlePopupClick() {
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escKeyDownHandler);
    document.body.removeChild(this._popupComponent.getElement());
  }

  _handleFilmChange(updatedPoint) {
    this._films = updateItem(this._films, updatedPoint);
    this._replaceFilmComponent(this._filmComponents, updatedPoint);
    this._clearFilmsTopRated();
    this._clearFilmsMostCommented();
    this._renderFilmsTopRated();
    this._renderFilmsMostCommented();
  }

  _clearFilmsTopRated() {
    Object.values(this._filmTopRatedComponents).forEach((component) => remove(component));
    this._filmTopRatedComponents = {};
    remove(this._filmsTopRatedComponent);
  }

  _clearFilmsMostCommented() {
    Object.values(this._filmMostCommentedComponents).forEach((component) => remove(component));
    this._filmMostCommentedComponents = {};
    remove(this._filmsMostCommentedComponent);
  }

  _handleWatchedClick(film) {
    this._handleFilmChange(
      Object.assign(
        {},
        film,
        {
          userDetails: {
            watchlist: film.userDetails.watchlist,
            alreadyWatched: !film.userDetails.alreadyWatched,
            watchingDate: !film.userDetails.alreadyWatched ? new Date() : null,
            favorite: film.userDetails.favorite,
          }
        },
      ),
    );
  }

  _handleWatchlistClick(film) {
    debugger
    this._handleFilmChange(
      Object.assign(
        {},
        film,
        {
          userDetails: {
            watchlist: !film.userDetails.watchlist,
            favorite: film.userDetails.favorite,
            watchingDate: film.userDetails.watchingDate,
            alreadyWatched: film.userDetails.alreadyWatched
          }
        },
      ),
    );
  }

  _handleFavoriteClick(film) {
    this._handleFilmChange(
      Object.assign(
        {},
        film,
        {
          userDetails: {
            watchlist: film.userDetails.watchlist,
            alreadyWatched: film.userDetails.alreadyWatched,
            watchingDate: film.userDetails.watchingDate,
            favorite: !film.userDetails.favorite
          }
        },
      ),
    );
  }


  _handleFilmCardClick(film) {
    this._popupComponent = new PopupView(film);

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this._escKeyDownHandler);

    this._popupComponent.setPopupClickHandler(this._handlePopupClick);
    this._popupComponent.setWatchlistPopupClickHandler(this._handleWatchlistClick);
    this._popupComponent.setWatchedPopupClickHandler(this._handleWatchedClick);
    this._popupComponent.setFavoritePopupClickHandler(this._handleFavoriteClick);

    render(document.body, this._popupComponent);
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
