import onChange from 'on-change';
import { showPosts, showFeeds } from './render.js';
import i18next from 'i18next';
import elements from '../elements.js';

export const watchedFormState = (state) =>
  onChange(state, (path, value) => {
    const responseText = i18next.t(`code.${value}`);
    elements.feedback.classList.remove('text-danger', 'text-success');
    elements.input.classList.remove('is-valid', 'is-invalid');
    elements.feedback.textContent = responseText;
    elements.input.value = '';
    elements.input.focus();

    if (state.validationResult === 'success') {
      elements.input.classList.add('is-valid');
      elements.feedback.classList.add('text-success');
      return;
    } else {
      elements.input.classList.add('is-invalid');
      elements.feedback.classList.add('text-danger');
      return;
    }
  });

export const watchedFeedState = (state) =>
  onChange(state, (path, value) => {
    elements.feeds.innerHTML = '';
    elements.feeds.append(showFeeds(value));
  });

export const watchedPostState = (state) =>
  onChange(state, (path, value) => {
    console.log('view', value);
    elements.posts.innerHTML = '';
    elements.posts.append(showPosts(value));
  });

export const watchedModalState = (state) =>
  onChange(state, (path, value) => {
    console.log(value);
    const { title, description } = value;
    elements.modalHeader.textContent = title;
    elements.modalBody.textContent = description;
  });

export const watchedLinkState = (state) =>
  onChange(state, (path, value) => {
    value.forEach((linkId) => {
      const link = document.querySelector(`[data-id="${linkId}"]`);
      link.classList.replace('fw-bold', 'fw-normal');
      link.classList.add('link-secondary');
    });
  });
