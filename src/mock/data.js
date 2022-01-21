import dayjs from 'dayjs';
import { EMOTIONS } from '../const.js';
import { getRandomInt, getRandomFloat, getRandomArrayElement, makeRandomArrayGenerator, randomeDate } from '../util.js';

const YEAR_IN_MINUTES = 525600;

const COMMENTS = [
  {
    id: 0,
    author: 'Илюха',
    comment: 'Отличный фильм',
    emotion: getRandomArrayElement(EMOTIONS),
    date: randomeDate()
  },
  {
    id: 1,
    author: 'Петя',
    comment: 'Ужасно',
    emotion: getRandomArrayElement(EMOTIONS),
    date: randomeDate()
  },
  {
    id: 2,
    author: 'Илюха',
    comment: 'Супер фильм',
    emotion: getRandomArrayElement(EMOTIONS),
    date: randomeDate()
  },
  {
    id: 3,
    author: 'Маша',
    comment: 'Было смешно',
    emotion: getRandomArrayElement(EMOTIONS),
    date: randomeDate()
  },
  {
    id: 4,
    author: 'Саша',
    comment: 'Советую!!!',
    emotion: getRandomArrayElement(EMOTIONS),
    date: randomeDate()
  },
  {
    id: 5,
    author: 'Юля',
    comment: 'Огонь',
    emotion: 'smile',
    date: randomeDate()
  }];

const FILMS_LIST = [
  {
    title: 'Очень страшное кино',
    alternativeTitle: 'Ужастики на ночь',
  },
  {
    title: 'Знакомство с Факерами',
    alternativeTitle: 'Знакомство с родителями',
  },
  {
    title: 'Игра престолов',
    alternativeTitle: 'Games of Throne',
  },
  {
    title: 'Ведьмак',
    alternativeTitle: 'Серебряный мечь',
  },
  {
    title: 'Зверопой',
    alternativeTitle: 'Звери поют',
  },
  {
    title: 'Человек-паук',
    alternativeTitle: 'Spider-man',
  }];

const DIRECTORS = ['Василий Пивоваров', 'Серега', 'Гай Ричи', 'Тарантино', 'Спилберг', 'Мария', 'Бондарчук'];

const ACTORS = ['Джонни Депп', 'Саша Петров', 'Сергей Бурунов', 'Дуэйн Джонсон', 'Джессика Альба', 'Хлоя Моррис', 'Эмилия Кларк', 'Эмма Уотсон'];

const GENER = ['Комедия', 'Ужасы', 'Боевик', 'Триллер', 'Мультфильм', 'Драма', 'Фантастика', 'Биография'];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

const POSTERS = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg'
];

const COUNTRY = ['США', 'Россия', 'Франция', 'Япония', 'Корея', 'Англия'];

const generateComments = () => new Array(getRandomInt(0, COMMENTS.length - 1)).fill().map(() => getRandomInt(0, COMMENTS.length - 1));

const getRelease = () => {
  const date = dayjs().subtract(getRandomInt(50, 5), 'year').subtract(getRandomInt(1, YEAR_IN_MINUTES), 'm').toDate();
  return {
    date,
    releaseCountry: getRandomArrayElement(COUNTRY)
  };
};

const getFilmInfo = () => {
  const {title, alternativeTitle} = getRandomArrayElement(FILMS_LIST);
  const description = makeRandomArrayGenerator(DESCRIPTIONS).join(' ');

  return {
    title,
    alternativeTitle,
    totalRating: getRandomFloat(1, 10, 1),
    poster: `./images/posters/${getRandomArrayElement(POSTERS)}`,
    ageRating: getRandomInt(6, 18),
    director: getRandomArrayElement(DIRECTORS),
    writers: makeRandomArrayGenerator(DIRECTORS),
    actors: makeRandomArrayGenerator(ACTORS),
    release: getRelease(),
    runtime: getRandomInt(70, 138),
    genre: makeRandomArrayGenerator(GENER),
    description
  };
};

const getDetails = () => {
  const watchingDate = dayjs().subtract(getRandomInt(1, 300), 'm').toDate();
  return {
    watchlist: Boolean(getRandomInt()),
    alreadyWatched: Boolean(getRandomInt()),
    watchingDate,
    favorite: Boolean(getRandomInt())
  };
};

const generateFilms = () => ({
  comments: generateComments(),
  filmInfo: getFilmInfo(),
  userDetails: getDetails()
});

export { generateFilms, COMMENTS };
