
const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const sortByDate = (prev, curr) => {
  const weight = getWeightForNullDate(prev, curr);

  if (weight !== null) {
    return weight;
  }

  return  curr.filmInfo.release.date - prev.filmInfo.release.date;
};

const sortByRating = (prev, curr) => {
  const weight = getWeightForNullDate(prev.filmInfo.totalRating, curr.filmInfo.totalRating);

  if (weight !== null) {
    return weight;
  }

  return curr.filmInfo.totalRating - prev.filmInfo.totalRating;
};

export {
  sortByDate,
  sortByRating
};
