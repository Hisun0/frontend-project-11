import { uniqueId } from 'lodash';
import {
  watchedFormState,
  watchedFeedState,
  watchedPostState,
} from './scripts/view.js';
import getValidationResult from './scripts/validator.js';
import parser from './scripts/parser.js';

const getData = (url) =>
  parser(url)
    .then((RSSDocument) => {
      const title = RSSDocument.querySelector('title').textContent;
      const description = RSSDocument.querySelector('description').textContent;
      const items = RSSDocument.querySelectorAll('item');
      const posts = [];
      items.forEach((item) => {
        const title = item.querySelector('title').textContent;

        const description = item
          .querySelector('description')
          .childNodes[0].nodeValue.replace('[CDATA[', '')
          .replace(']]', '');

        const link = [...item.childNodes]
          .filter((el) => el.nodeType === 3)
          .filter((el) => el.data.indexOf('http') >= 0)[0].data;

        posts.push({ title, description, link, id: uniqueId() });
      });
      return { feeds: [{ title, description }], posts };
    })
    .catch((err) => console.log(err));

export default () => {
  const state = {
    urls: [],
    posts: [],
    feeds: [],
    validationErrorCode: '',
  };

  const form = document.querySelector('form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const inputValue = formData.get('url');

    getValidationResult(inputValue)
      .then((url) => {
        if (state.urls.includes(url)) {
          watchedFormState(state).validationErrorCode = 409;
          return;
        }
        state.urls.push(url);
        getData(url)
          .then((data) => {
            console.log(data);
            watchedFeedState(state).feeds.push(...data.feeds);
            watchedPostState(state).posts.push(...data.posts);
          })
          .catch((err) => console.log(err));
        watchedFormState(state).validationErrorCode = '';
      })
      .catch((err) => {
        console.log(err);
        watchedFormState(state).validationErrorCode = 405;
      });
  });
};
