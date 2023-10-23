import i18next from 'i18next';
import {
  watchedFormState,
  watchedFeedState,
  watchedPostState,
  watchedModalState,
  watchedLinkState,
  watchedValidationState,
} from './scripts/view.js';
import getValidationResult from './scripts/validator.js';
import getData from './scripts/parser.js';
import ru from './locales/ru.js';
import updater from './scripts/updater.js';
import elements from './elements.js';

export default () => {
  const state = {
    urls: [],
    posts: [],
    formState: 'filling',
    feeds: [],
    modalData: null,
    clickedLinks: [],
    validationResult: '',
  };

  i18next.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const inputValue = formData.get('url');
    getValidationResult(inputValue, state.urls)
      .then((url) => {
        watchedFormState(state).formState = 'processing';
        getData(url)
          .then((data) => {
            state.urls.push(url);
            watchedFormState(state).formState = 'filling';
            watchedFeedState(state).feeds.push(...data.feeds);
            watchedPostState(state).posts.push(...data.posts);
            watchedValidationState(state).validationResult = 'success';
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
          .catch((err) => {
            watchedValidationState(state).validationResult = err.message;
            watchedFormState(state).formState = 'filling';
          })
          .finally(() => updater(state));
      })
      .catch((err) => {
        watchedValidationState(state).validationResult = err;
      });
  });
};
