import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
import { getRandomInt } from './common.js';

const randomeDate = () => dayjs().subtract(getRandomInt(1, 99999), 'm').toDate();
const dateConverter = (date, formate) => dayjs(date).format(formate);
const durationConverter = (time, formate) => dayjs.duration(time, 'm').format(formate);
const getDurationHours = (runtime) => Math.floor(dayjs.duration(runtime, 'm').asHours());
const getDurationMinutes = (runtime) => dayjs.duration(runtime, 'm').minutes();

export {
  randomeDate,
  dateConverter,
  durationConverter,
  getDurationMinutes,
  getDurationHours
};
