import { uniqueId } from 'lodash';
import {
  watchedFormState,
  watchedFeedState,
  watchedPostState,
} from './scripts/view.js';
import getValidationResult from './scripts/validator.js';
import parser from './scripts/parser.js';

const getData = (url) => parser(url)
  .then((RSSDocument) => {
    const mainTitle = RSSDocument.querySelector('title').textContent;
    const mainDescription = RSSDocument.querySelector('description').textContent;
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

      posts.push({
        title,
        description,
        link,
        id: uniqueId(),
      });
    });
    return {
      feeds: [{ title: mainTitle, description: mainDescription }],
      posts,
    };
  })
  .catch((err) => console.log(err));

export default () => {
  const state = {
    urls: [],
    posts: [],
    feeds: [],
    responseCode: '',
  };

  const form = document.querySelector('form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const inputValue = formData.get('url');

    getValidationResult(inputValue)
      .then((url) => {
        if (state.urls.includes(url)) throw new Error(409);
        watchedFormState(state).urls.push(url);
        watchedFormState(state).responseCode = '';

        getData(url)
          .then((data) => {
            if (!data) throw new Error(500);
            console.log(data.feeds, data.posts);
            watchedFeedState(state).feeds.push(...data.feeds);
            watchedPostState(state).posts.push(...data.posts);
            watchedFormState(state).responseCode = 200;
          })
          .catch((err) => {
            watchedFormState(state).responseCode = err.message;
          });
      })
      .catch((err) => {
        watchedFormState(state).responseCode = err.message;
      });
  });
  const a = document.querySelectorAll('a');
  console.log(a);
};
