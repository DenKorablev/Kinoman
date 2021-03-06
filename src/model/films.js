import Observer from '../utils/observer.js';

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
  }

  getFilm(id) {
    return this._films.find((el) => el.filmInfo.id === id);
  }

  getFilmsCount() {
    return this._films.length;
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.filmInfo.id === update.filmInfo.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }
}
