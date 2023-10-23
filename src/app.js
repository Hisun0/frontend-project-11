import {
  watchedFormState,
  watchedFeedState,
  watchedPostState,
  watchedModalState,
  watchedLinkState,
} from './scripts/view.js';
import getValidationResult from './scripts/validator.js';
import getData from './scripts/parser.js';
import i18next from 'i18next';
import ru from './locales/ru.js';
import updater from './scripts/updater.js';
import elements from './elements.js';

export default () => {
  const state = {
    urls: [],
    posts: [],
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
        state.urls.push(url);
        watchedFormState(state).validationResult = 'success';
        getData(url)
          .then((data) => {
            console.log(state.posts);
            watchedFeedState(state).feeds.push(...data.feeds);
            watchedPostState(state).posts.push(...data.posts);
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
          .finally(() => updater(state));
      })
      .catch((err) => (watchedFormState(state).validationResult = err));
  });
};
