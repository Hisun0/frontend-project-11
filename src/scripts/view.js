import onChange from 'on-change';
import i18next from 'i18next';
import getPosts from './parser.js';

i18next.init({
  resources: {
    ru: {
      translation: {
        key: 'привет',
        error: {
          405: 'Ссылка должна быть валидным URL',
          409: 'RSS уже существует',
        },
      },
    },
  },
});

export const watchedFormState = (state) =>
  onChange(state, (path, value) => {
    const input = document.querySelector('#url-input');
    const error = i18next.t(`error.${value}`, { lng: 'ru' });
    const pError = document.querySelector('.feedback');

    if (state.validationErrorCode !== '') {
      input.classList.add('is-invalid');
      pError.textContent = error;
    }
    if (state.validationErrorCode === '') {
      input.classList.remove('is-invalid');
      pError.textContent = '';
    }
    if (Array.isArray(value)) {
      getPosts(value[value.length - 1])
        .then((posts) => console.log(posts))
        .catch((err) => console.log(err));
    }
  });
