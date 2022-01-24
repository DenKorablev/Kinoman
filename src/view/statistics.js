import AbstractView from './abstract.js';

const createStatisticsTemplate = (films) => `
  <p>${films.length} movies inside</p>
`;

export default class Statistics extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createStatisticsTemplate(this._films);
  }
}
