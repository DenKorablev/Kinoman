import AbstractView from './abstract.js';

const createTotalFilmsTemplate = (films) => `
  <p>${films.length} movies inside</p>
`;

export default class TotalFilms extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createTotalFilmsTemplate(this._films);
  }
}
