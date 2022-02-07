import SmartView from './smart.js';
import { DATE_FORMAT, EMOTIONS } from '../const.js';
import { COMMENTS } from '../mock/data.js';
import { dateConverter, durationConverter } from '../utils/date.js';

const getActiveClassName = (condition) => condition ? 'film-details__control-button--active' : '';

const createGenreContainer = (genres) => genres.length ? `
  <td class="film-details__cell">
  ${genres.map((genre) =>
    `<span class="film-details__genre">${genre}</span>`
  ).join(' ')}
  </td>` : '';

const createCommentsContainer = (comments) => comments.length ? `
  <ul class="film-details__comments-list">
  ${comments.map((id) => {
    const { author, comment, emotion, date } = COMMENTS.find((cm) => cm.id === id);
    return `
      <li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
        </span>
        <div>
          <p class="film-details__comment-text">${comment}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${dateConverter(date, DATE_FORMAT.DATE_HOUR)}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>
    `;
  }).join(' ')}
  </ul>` : '';

const createEmotionListContainer = () => `
  <div class="film-details__emoji-list">
  ${EMOTIONS.map((em) =>
    `
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${em}" value="${em}">
      <label class="film-details__emoji-label" for="emoji-${em}">
        <img src="./images/emoji/${em}.png" width="30" height="30" alt="emoji">
      </label>
    `
  ).join(' ')}
  </div>`;

const createNewCommentTemplate = (emojiIcon) => {
  const em = emojiIcon !== '' ?
    `<img src="./images/emoji/${emojiIcon}.png" width="55" height="55" alt="emoji-smile">` : '';

  return `
    <div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">${em}</div>
      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
      </label>
      ${createEmotionListContainer()}
    </div>
  `;
};

export const createPopupTemplate = ({comments, filmInfo, userDetails, emojiIcon}) => {
  const { title, alternativeTitle, totalRating, ageRating, director, writers, actors, runtime, release, genre, poster, description } = filmInfo;
  const { favorite, alreadyWatched, watchlist } = userDetails;
  const releaseYear = dateConverter(release.date, DATE_FORMAT.DATE);
  const durationFilm = durationConverter(runtime, DATE_FORMAT.DURATION_HM);

  return `
    <section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="${title}">

              <p class="film-details__age">${ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">${alternativeTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${totalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${releaseYear}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${durationFilm}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${release.releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  ${createGenreContainer(genre)}
                </tr>
              </table>

              <p class="film-details__film-description">${description}</p>
            </div>
          </div>

          <section class="film-details__controls">
            <button type="button" class="film-details__control-button film-details__control-button--watchlist ${getActiveClassName(watchlist)}" id="watchlist" name="watchlist">Add to watchlist</button>
            <button type="button" class="film-details__control-button film-details__control-button--watched ${getActiveClassName(alreadyWatched)}" id="watched" name="watched">Already watched</button>
            <button type="button" class="film-details__control-button film-details__control-button--favorite ${getActiveClassName(favorite)}" id="favorite" name="favorite">Add to favorites</button>
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
            ${createCommentsContainer(comments)}
            ${createNewCommentTemplate(emojiIcon)}
          </section>
        </div>
      </form>
    </section>
  `;
};

export default class Popup extends SmartView {
  constructor(film) {
    super();
    this._film = Popup.parseFilmToData(film);

    this._popupClickHandler = this._popupClickHandler.bind(this);
    this._watchlistPopupClickHandler = this._watchlistPopupClickHandler.bind(this);
    this._watchedPopupClickHandler = this._watchedPopupClickHandler.bind(this);
    this._favoritePopupClickHandler = this._favoritePopupClickHandler.bind(this);
    this._emojiIChangeHandler = this._emojiIChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPopupTemplate(this._film);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setPopupClickHandler(this._callback.closeClick);
    this.setWatchlistPopupClickHandler(this._callback.watchlistClick);
    this.setWatchedPopupClickHandler(this._callback.watchedClick);
    this.setFavoritePopupClickHandler(this._callback.favoriteClick);
  }

  _popupClickHandler() {
    this._callback.closeClick();
  }

  _watchlistPopupClickHandler() {
    this._callback.watchlistClick(this._film);
  }

  _watchedPopupClickHandler() {
    this._callback.watchedClick(this._film);
  }

  _favoritePopupClickHandler() {
    this._callback.favoriteClick(this._film);
  }

  _emojiIChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      emojiIcon: evt.target.value,
    }, false);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.film-details__emoji-list')
      .addEventListener('change', this._emojiIChangeHandler);
  }

  setPopupClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._popupClickHandler);
  }

  setWatchlistPopupClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._watchlistPopupClickHandler);
  }

  setWatchedPopupClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._watchedPopupClickHandler);
  }

  setFavoritePopupClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._favoritePopupClickHandler);
  }

  static parseFilmToData(film) {
    return Object.assign(
      {},
      film,
      {
        emojiIcon: ''
      }
    );
  }

  static parseDataToFilm(data) {
    return Object.assign({}, data);
  }
}
