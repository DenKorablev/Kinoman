
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


const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export {
  getRandomInt,
  getRandomFloat,
  getRandomArrayElement,
  makeRandomArrayGenerator,
  isEscEvent
};
