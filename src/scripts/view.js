import onChange from 'on-change';
import i18next from 'i18next';
import getPosts from './parser.js';
import { showPosts, showFeeds } from './render.js';

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
    input.value = '';
    input.focus();

    if (state.validationErrorCode !== '') {
      input.classList.add('is-invalid');
      pError.textContent = error;
    }
    if (state.validationErrorCode === '') {
      input.classList.remove('is-invalid');
      pError.textContent = '';
    }
  });

export const watchedFeedState = (state) =>
  onChange(state, (path, value) => {
    const feeds = document.querySelector('.feeds');
    feeds.innerHTML = '';
    feeds.append(showFeeds(value));
  });

export const watchedPostState = (state) =>
  onChange(state, (path, value) => {
    const posts = document.querySelector('.posts');
    posts.innerHTML = '';
    posts.append(showPosts(value));
  });
