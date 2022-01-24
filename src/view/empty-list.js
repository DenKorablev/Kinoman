import AbstractView from './abstract.js';

export const createEmptyListButtonTemplate = () => `
  <h2 class="films-list__title">There are no movies in our database</h2>
`;

export default class EmptyListButton extends AbstractView {
  getTemplate() {
    return createEmptyListButtonTemplate();
  }
}
