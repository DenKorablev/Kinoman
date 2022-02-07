import Abstract from './abstract';

export default class Smart extends Abstract {
  constructor() {
    super();
    this._film = {};
  }

  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }

    this._film = Object.assign(
      {},
      this._film,
      update,
    );

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    const scrollTop = this.getElement().scrollTop;

    this.removeElement();

    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);

    newElement.scrollTop = scrollTop;
    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}
