import { watchedFormState } from './scripts/view.js';
import getValidationResult from './scripts/validator.js';

export default () => {
  const state = {
    urls: [],
    validationErrorCode: '',
  };

  const form = document.querySelector('form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const inputValue = formData.get('url');
    const input = document.querySelector('#url-input');

    getValidationResult(inputValue)
      .then((url) => {
        if (state.urls.includes(url)) {
          watchedFormState(state).validationErrorCode = 409;
          return;
        }
        watchedFormState(state).urls.push(url);
        watchedFormState(state).validationErrorCode = '';
      })
      .catch((err) => {
        console.log(err);
        watchedFormState(state).validationErrorCode = 405;
      });

    input.value = '';
    input.focus();
  });
};
