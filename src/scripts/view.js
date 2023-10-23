import onChange from 'on-change';
import i18next from 'i18next';
import { showPosts, showFeeds } from './render.js';
import elements from '../elements.js';

export const watchedFormState = (state) =>
  onChange(state, (path, value) => {
    if (path === 'validationResult') {
      const responseText = i18next.t(`code.${value}`);
      elements.feedback.classList.remove('text-danger', 'text-success');
      elements.input.classList.remove('is-valid', 'is-invalid');
      elements.feedback.textContent = responseText;
      elements.input.value = '';
      elements.input.focus();

      if (value === 'success') {
        elements.input.classList.add('is-valid');
        elements.feedback.classList.add('text-success');
      } else {
        elements.input.classList.add('is-invalid');
        elements.feedback.classList.add('text-danger');
      }
    }
    if (path === 'formState') {
      if (value === 'processing') {
        elements.submitButton.disabled = true;
        elements.input.setAttribute('readonly', 'true');
      } else {
        elements.submitButton.disabled = false;
        elements.input.removeAttribute('readonly');
      }
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
