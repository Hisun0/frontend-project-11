export default {
  form: document.querySelector('form'),
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.feedback'),
  feeds: document.querySelector('.feeds'),
  posts: document.querySelector('.posts'),
  modalButtons: () => document.querySelectorAll('[data-bs-toggle]'),
  modal: document.querySelector('#modal'),
  modalHeader: document.querySelector('.modal-header'),
  modalBody: document.querySelector('.modal-body'),
  postsUl: document.querySelector('list-group'),
};
