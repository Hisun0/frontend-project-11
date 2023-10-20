import getData from './parser.js';
import { watchedFeedState, watchedPostState } from './view.js';
import _ from 'lodash';

const filterData = (state, data, type) => {
  // Преобразуйте массивы в объекты для более эффективного поиска.
  const data1Obj = state[type].reduce((acc, obj) => {
    acc[obj.title] = true;
    return acc;
  }, {});

  const data2Obj = data[type].reduce((acc, obj) => {
    acc[obj.title] = true;
    return acc;
  }, {});

  // Поиск последнего объекта, который отсутствует в data1 и присутствует в data2.
  let result;
  for (const key in data2Obj) {
    if (!data1Obj[key]) {
      result = { title: key };
    }
  }
  return result;
};

// https://lorem-rss.herokuapp.com/feed?length=3&unit=second&interval=5

const updater = (state) => {
  state.urls.forEach((url) => {
    getData(url)
      .then((data) => {
        // watchedFeedState(state).feeds.unshift(
        //   ...filterData(state, data, 'feeds'),
        // );
        if (!filterData(state, data, 'posts'))
          return setTimeout(() => updater(state), 5000);
        watchedPostState(state).posts.unshift(filterData(state, data, 'posts'));
      })
      .catch((err) => console.log(err))
      .finally(() => setTimeout(() => updater(state), 5000));
  });
};

export default updater;
