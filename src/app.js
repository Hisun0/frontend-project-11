import {
  watchedFormState,
  watchedFeedState,
  watchedPostState,
} from './scripts/view.js';
import getValidationResult from './scripts/validator.js';
import getData from './scripts/parser.js';
import i18next from 'i18next';
import ru from './locales/ru.js';

export default () => {
  const state = {
    urls: [],
    posts: [],
    feeds: [],
    validationResult: '',
  };

  i18next.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  const form = document.querySelector('form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const inputValue = formData.get('url');

    getValidationResult(inputValue, state.urls)
      .then((url) => {
        state.urls.push(url);
        watchedFormState(state).validationResult = 'success';
        getData(url)
          .then((data) => {
            watchedFeedState(state).feeds.push(...data.feeds);
            watchedPostState(state).posts.push(...data.posts);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => (watchedFormState(state).validationResult = err));
  });
};
