import onChange from 'on-change';
import i18next from 'i18next';
import { showPosts, showFeeds } from './render.js';
import elements from '../elements.js';

const mapping = {
  setFormStatus: (result) => {
    if (result === 'success') {
      elements.input.classList.add('is-valid');
      elements.feedback.classList.add('text-success');
    } else {
      elements.input.classList.add('is-invalid');
      elements.feedback.classList.add('text-danger');
    }
  },
  processing: () => {
    elements.submitButton.disabled = true;
    elements.input.setAttribute('readonly', 'true');
  },
  filling: () => {
    elements.submitButton.disabled = false;
    elements.input.removeAttribute('readonly');
  },
  posts: (postList) => elements.posts.append(showPosts(postList)),
  feeds: (feedList) => elements.feeds.append(showFeeds(feedList)),
};

export const watchedFormState = (state) => onChange(state, (path, formStatus) => {
  mapping[formStatus]();
});

export const watchedValidationState = (state) => onChange(state, (path, validationStatus) => {
  elements.feedback.classList.remove('text-danger', 'text-success');
  elements.input.classList.remove('is-valid', 'is-invalid');
  elements.feedback.textContent = i18next.t(`code.${validationStatus}`);
  elements.input.value = '';
  elements.input.focus();

  mapping.setFormStatus(validationStatus);
});

export const watchedItemsState = (state) => onChange(state, (path, items) => {
  elements[path].innerHTML = '';
  mapping[path](items);
});

export const watchedModalState = (state) => onChange(state, (path, value) => {
  const { title, description } = value;
  elements.modalHeader.textContent = title;
  elements.modalBody.textContent = description;
});

export const watchedLinkState = (state) => onChange(state, (path, value) => {
  value.forEach((linkId) => {
    const link = document.querySelector(`[data-id="${linkId}"]`);
    link.classList.replace('fw-bold', 'fw-normal');
    link.classList.add('link-secondary');
  });
});
