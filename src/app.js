import i18next from 'i18next';
import ru from './locales/ru.js';
import elements from './elements.js';
import formHandler from './handlers/form.js';

export default () => {
  const state = {
    urls: [],
    posts: [],
    formState: 'filling',
    feeds: [],
    modalData: null,
    clickedLinks: [],
    validationResult: '',
  };

  i18next.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  elements.form.addEventListener('submit', (event) => formHandler(event, state));
};
