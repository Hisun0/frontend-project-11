import getData from './parser.js';
import { watchedFeedState, watchedPostState } from './view.js';
import _ from 'lodash';

const filterData = (state, data, type) => {
  const nameSet = new Set(state[type].map((el) => el.title));
  return data[type].filter((el) => !nameSet.has(el.title));
};

// https://lorem-rss.herokuapp.com/feed?length=3&unit=second&interval=5

const updater = (state) => {
  state.urls.forEach((url) => {
    getData(url)
      .then((data) => {
        if (!filterData(state, data, 'posts'))
          return setTimeout(() => updater(state), 5000);
        watchedPostState(state).posts.unshift(
          ...filterData(state, data, 'posts'),
        );
      })
      .catch((err) => console.log(err))
      .finally(() => setTimeout(() => updater(state), 5000));
  });
};

export default updater;
