import onChange from 'on-change';
import { showPosts, showFeeds } from './render.js';
import i18next from 'i18next';

export const watchedFormState = (state) =>
  onChange(state, (path, value) => {
    const input = document.querySelector('#url-input');
    const responseText = i18next.t(`code.${value}`);
    const pEl = document.querySelector('.feedback');
    pEl.classList.remove('text-danger', 'text-success');
    input.classList.remove('is-valid', 'is-invalid');
    pEl.textContent = responseText;
    input.value = '';
    input.focus();

    if (state.validationResult === 'success') {
      input.classList.add('is-valid');
      pEl.classList.add('text-success');
      return;
    } else {
      input.classList.add('is-invalid');
      pEl.classList.add('text-danger');
      return;
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
