import onChange from 'on-change';
import i18next from 'i18next';
import { showPosts, showFeeds } from './render.js';

i18next.init({
  resources: {
    ru: {
      translation: {
        key: 'привет',
        code: {
          200: 'RSS успешно загружен',
          405: 'Ссылка должна быть валидным URL',
          409: 'RSS уже существует',
          500: 'Неизвестная ошибка. Что-то пошло не так',
        },
      },
    },
  },
});

export const watchedFormState = (state) => onChange(state, (path, value) => {
  const input = document.querySelector('#url-input');
  const code = i18next.t(`code.${value}`, { lng: 'ru' });
  const pError = document.querySelector('.feedback');
  pError.classList.remove('text-danger', 'text-success');
  input.value = '';
  input.focus();

  if (state.responseCode === 200) {
    input.classList.add('is-valid');
    pError.textContent = code;
    pError.classList.add('text-success');
    return;
  }
  if (state.responseCode !== '') {
    input.classList.add('is-invalid');
    pError.textContent = code;
    pError.classList.add('text-danger');
    return;
  }
  if (state.responseCode === '') {
    input.classList.remove('is-invalid');
    pError.textContent = '';
  }
});

export const watchedFeedState = (state) => onChange(state, (path, value) => {
  const feeds = document.querySelector('.feeds');
  feeds.innerHTML = '';
  feeds.append(showFeeds(value));
});

export const watchedPostState = (state) => onChange(state, (path, value) => {
  const posts = document.querySelector('.posts');
  posts.innerHTML = '';
  posts.append(showPosts(value));
});
