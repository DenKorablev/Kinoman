import ProfileView from './view/profile.js';
import StatisticsView from './view/statistics.js';
import FilmListPresenter from './presenter/film-list.js';
import FilterPresenter from './presenter/filter.js';
import { generateFilms } from './mock/data.js';
import { render } from './utils/render.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import CommentsModel from './model/comments.js';
import { COMMENTS } from './mock/data.js';

const FILMS_COUNT = 18;

const filmsData = new Array(FILMS_COUNT).fill().map(generateFilms);

const filmsModel = new FilmsModel();
filmsModel.setFilms(filmsData);

const commentsModel = new CommentsModel();
commentsModel.setComments(COMMENTS);

const filterModel = new FilterModel();

const siteBodyElement = document.querySelector('body');
const headerElement = siteBodyElement.querySelector('.header');
const mainElement = siteBodyElement.querySelector('.main');
const footerStaisticsElement = siteBodyElement.querySelector('.footer__statistics');

render(headerElement, new ProfileView(filmsData));
render(footerStaisticsElement, new StatisticsView(filmsData));

const listPresenter = new FilmListPresenter(mainElement, filmsModel, filterModel, commentsModel);
const filterPresenter = new FilterPresenter(mainElement, filmsModel, filterModel);
listPresenter.init();
filterPresenter.init();


