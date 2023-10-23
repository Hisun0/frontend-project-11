import getData from './parser.js';
import {
  watchedLinkState,
  watchedPostState,
  watchedModalState,
} from './view.js';
import elements from '../elements.js';
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
        const filteredData = filterData(state, data, 'posts');
        if (filteredData.length !== 0) {
          watchedPostState(state).posts = [
            ...filterData(state, data, 'posts'),
            ...state.posts,
          ];
        }
        elements.modalButtons().forEach((modalButton) => {
          modalButton.addEventListener('click', () => {
            const postId = modalButton.dataset.buttonId;
            console.log('clicked');
            const post = state.posts.find(({ id }) => postId === id);
            post.clicked = true;
            watchedModalState(state).modalData = post;
            watchedLinkState(state).clickedLinks.push(postId);
          });
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setTimeout(() => updater(state), 5000));
  });
};

export default updater;
