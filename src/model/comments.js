import Observer from '../utils/observer.js';

export default class CommentsModel extends Observer {
  constructor() {
    super();

    this._comments = [];
  }

  addComment(updateType, update) {
    this._comments.push(update);

    this._notify(updateType, this._comments);
  }

  deleteComment(updateType, update) {
    const index = this._comments
      .findIndex((comment) => comment.id === Number(update.commentId));

    if (index === -1) {
      throw new Error('Can`t delete nonexistent comment');
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  getComments() {
    return this._comments;
  }

  setComments(comments) {
    this._comments = comments.slice();
  }
}
