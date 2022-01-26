import AbstractView from './abstract';

const createFilmsSectionTemplate = () => `
    <section class="films"></section>
  `;

export default class Films extends AbstractView {
  getTemplate() {
    return createFilmsSectionTemplate();
  }
}
