import {
  watchedFormState,
  watchedItemsState,
  watchedValidationState,
} from '../scripts/view.js';
import getValidationResult from '../scripts/validator.js';
import getData from '../scripts/parser.js';
import elements from '../elements.js';
import updater from '../scripts/updater.js';
import modalButtonHandler from './modalButton.js';

export default (event, state) => {
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
          watchedItemsState(state).feeds.push(...data.feeds);
          watchedItemsState(state).posts.push(...data.posts);
          watchedValidationState(state).validationResult = 'success';
          elements.modalButtons().forEach((modalButton) => {
            modalButton.addEventListener('click', () => modalButtonHandler(modalButton, state));
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
};
