import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

const getRandomInt = (min = 0, max = 1) => {
  if (max < min) {
    [min, max] = [max, min];
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomFloat = (min, max, float) => {
  if (max < min) {
    [min, max] = [max, min];
  }

  return (Math.random() * (max - min) + min).toFixed(float);
};

const getRandomArrayElement = (array) => array[getRandomInt(1, array.length - 1)];

const makeRandomArrayGenerator = (array) => {
  const result = [];
  const count = getRandomInt(1, array.length);

  for(let i = 0; i < count; i++) {
    result.push(array[getRandomInt(0, array.length - 1)]);
    array = array.filter((obj) => !result.includes(obj));
  }

  return result.sort();
};

const randomeDate = () => dayjs().subtract(getRandomInt(1, 99999), 'm').toDate();
const dateConverter = (date, formate) => dayjs(date).format(formate);
const durationConverter = (time, formate) => dayjs.duration(time, 'm').format(formate);

const render = (container, element, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstElementChild;
};

const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export {
  getRandomInt,
  getRandomFloat,
  getRandomArrayElement,
  makeRandomArrayGenerator,
  dateConverter,
  durationConverter,
  randomeDate,
  RenderPosition,
  render,
  createElement,
  isEscEvent
};
