import FilmsView from '../view/films.js';
import FilmsListView from '../view/films-list.js';
import FilmsListExtraView from '../view/films-list-extra.js';
import FilmsListContainerView from '../view/films-list-container.js';
import SortingView from '../view/sorting.js';
import EmptyListButtonView from '../view/empty-list.js';
import FilmCardView from '../view/film-card.js';
import PopupView from '../view/popup.js';
import ShowMoreButtonView from '../view/show-more-btn.js';
import { render, remove, replace, RenderPosition } from '../utils/render.js';
import { isEscEvent } from '../utils/common.js';
import { filter } from '../utils/filter.js';
import { SORT_TYPE, UpdateType, UserAction } from '../const.js';
import { sortByDate, sortByRating } from '../utils/sorting.js';

const FILMS_SHOW_STEP = 5;
const EXTRA_COUNT = 2;

export default class FilmList {
  constructor(filmsListContainer, filmsModel, filterModel) {
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._renderedFilmsStep = FILMS_SHOW_STEP;
    this._currentSortType = SORT_TYPE.DEFAULT;

    this._filmsListContainer = filmsListContainer;

    this._filmComponents = {};
    this._filmTopRatedComponents = {};
    this._filmMostCommentedComponents = {};

    this._filmPopupId = null;
    this._popupComponent = null;
    this._filmsMainComponent = null;
    this._filmsTopRatedComponent = null;
    this._filmsMostCommentedComponent = null;

    this._filmsComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListContainerComponent = new FilmsListContainerView();
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
    this._handleSortTypeClick = this._handleSortTypeClick.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SORT_TYPE.DATE:
        return filtredFilms.sort(sortByDate);
      case SORT_TYPE.RATING:
        return filtredFilms.sort(sortByRating);
      default:
        return filtredFilms;
    }
  }

  init() {
    render(this._filmsListContainer, this._filmsComponent);
    this._renderFilmsList();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortingView(this._currentSortType);
    render(this._filmsListComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandle(this._handleSortTypeClick);
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

  _renderFilmsMain() {
    const filmCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmCount, this._renderedFilmsStep));

    films.forEach((film) => this._renderFilm(this._filmsListContainerComponent, film, this._filmComponents));

    if (filmCount > this._renderedFilmsStep) {
      this._renderShowMoreButton(this._filmsListComponent);
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
    const films = this._filmsModel.getFilms()
      .filter((film) => film.comments.length > 0)
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, EXTRA_COUNT);

    this._filmsMostCommentedComponent = new FilmsListExtraView('Most commented');
    this._renderFilmsExtra(this._filmsMostCommentedComponent, films, this._filmMostCommentedComponents);
  }

  _renderFilmsTopRated() {
    const films = this._filmsModel.getFilms()
      .filter((film) => film.filmInfo.totalRating> 0)
      .sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating)
      .slice(0, EXTRA_COUNT);

    this._filmsTopRatedComponent = new FilmsListExtraView('Top rated');
    this._renderFilmsExtra(this._filmsTopRatedComponent, films, this._filmTopRatedComponents);
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

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._handleFilmChange(data);
        break;
      case UpdateType.MINOR:
        this._clearMainFilmsList();
        this._clearFilmsTopRated();
        this._clearFilmsMostCommented();
        this._renderFilmsMain();
        this._renderFilmsTopRated();
        this._renderFilmsMostCommented();

        if (this._popupComponent && this._filmPopupId === data.filmInfo.id) {
/*           this._popupComponent.update(data, this._commentsModel.getComments()); */
        }
        break;
      case UpdateType.MAJOR:
        this._clearFilmsList({resetRenderedFilmCount: true, resetSortType: true});
        this._renderFilmsList();
        break;
    }
  }

  _handleFilmChange(updatedPoint) {
    if (this._filmComponents[updatedPoint.filmInfo.id]) {
      this._replaceFilmComponent(this._filmComponents, updatedPoint);
    }

    if (this._filmTopRatedComponents[updatedPoint.filmInfo.id]) {
      this._replaceFilmComponent(this._filmTopRatedComponents, updatedPoint);
    }

    this._clearFilmsMostCommented();
    this._renderFilmsMostCommented();

    if (this._popupComponent && this._filmPopupId === updatedPoint.filmInfo.id) {
      this._replaceFilmPopupClick(updatedPoint);
    }
  }

  _clearFilmsList({resetRenderedFilmCount, resetSortType}) {
    this._clearMainFilmsList(resetRenderedFilmCount);
    this._clearFilmsTopRated();
    this._clearFilmsMostCommented();

    remove(this._filmsListContainerComponent);
    remove(this._filmsListComponent);
    remove(this._showMoreComponent);

    if (resetSortType) {
      this._currentSortType = SORT_TYPE.DEFAULT;
    }
  }

  _clearMainFilmsList(resetRenderedFilmCount = false) {
    Object
      .values(this._filmComponents)
      .forEach((component) => remove(component));

    const filmsCount = this._getFilms().length;

    remove(this._sortComponent);
    remove(this._showMoreComponent);

    if (resetRenderedFilmCount) {
      this._renderedFilmsStep = FILMS_SHOW_STEP;
    } else {
      this._renderedFilmsStep = Math.min(filmsCount, this._renderedFilmsStep);
    }
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
    this._handleViewAction(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign(
        {},
        film,
        {
          userDetails: {
            ...film.userDetails,
            alreadyWatched: !film.userDetails.alreadyWatched,
            watchingDate: !film.userDetails.alreadyWatched ? new Date() : null
          }
        },
      ),
    );
  }

  _handleWatchlistClick(film) {
    this._handleViewAction(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign(
        {},
        film,
        {
          userDetails: {
            ...film.userDetails,
            watchlist: !film.userDetails.watchlist
          }
        },
      ),
    );
  }

  _handleFavoriteClick(film) {
    this._handleViewAction(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign(
        {},
        film,
        {
          userDetails: {
            ...film.userDetails,
            favorite: !film.userDetails.favorite
          }
        },
      ),
    );
  }

  _createPopup(film) {
    const newFilmComponent = new PopupView(film);

    newFilmComponent.setPopupClickHandler(this._handlePopupClick);
    newFilmComponent.setWatchlistPopupClickHandler(this._handleWatchlistClick);
    newFilmComponent.setWatchedPopupClickHandler(this._handleWatchedClick);
    newFilmComponent.setFavoritePopupClickHandler(this._handleFavoriteClick);

    return newFilmComponent;
  }

  _replaceFilmPopupClick(film) {
    const oldFilmComponent = this._popupComponent;
    const newFilmComponent = this._createPopup(film);

    this._popupComponent = newFilmComponent;
    replace(newFilmComponent, oldFilmComponent);
    remove(oldFilmComponent);
  }

  _handleSortTypeClick(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearMainFilmsList(true);
    this._renderFilmsMain();
  }

  _handleFilmCardClick(film) {
    if (this._popupComponent) {
      remove(this._popupComponent);
    }
    this._filmPopupId = film.filmInfo.id;
    this._popupComponent = this._createPopup(film);

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this._escKeyDownHandler);
    render(document.body, this._popupComponent);
  }

  _handleLoadMoreButtonClick() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmsStep + FILMS_SHOW_STEP);
    const films = this._getFilms().slice(this._renderedFilmsStep, newRenderedFilmCount);

    films.forEach((film) => this._renderFilm(this._filmsListContainerComponent, film, this._filmComponents));

    this._renderedFilmsStep = newRenderedFilmCount;

    if (this._renderedFilmsStep >= filmCount) {
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
    const filmCount = this._getFilms().length;

    if (filmCount === 0) {
      this._renderEmptyList();
      return;
    }

    render(this._filmsComponent, this._filmsListComponent);
    render(this._filmsListComponent, this._filmsListContainerComponent);

    this._renderFilmsMain();
    this._renderFilmsTopRated();
    this._renderFilmsMostCommented();
  }
}
