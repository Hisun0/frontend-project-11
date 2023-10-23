import axios from 'axios';
import { uniqueId } from 'lodash';

const filterFromCData = (element) => {
  const mapping = {
    default: ['[CDATA[', ']]'],
    exclamation: ['<![CDATA[', ']]>'],
  };
  const text = element.childNodes[0].nodeValue;
  const filter = (dataType) => {
    const [textStart, textEnd] = mapping[dataType];
    return text.replace(textStart, '').replace(textEnd, '');
  };

  if (text.startsWith('<![')) {
    return filter('exclamation');
  }

  return filter('default');
};

const parser = (url) =>
  axios
    .get(
      `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(
        url,
      )}`,
    )
    .then((response) => {
      const DOMparser = new DOMParser();
      return Promise.resolve(
        DOMparser.parseFromString(response.data.contents, 'text/xml'),
      );
    })
    .catch((err) => Promise.reject(err));

const getPosts = (newDocument) => {
  const items = newDocument.querySelectorAll('item');
  const posts = [];
  items.forEach((item) => {
    const title = filterFromCData(item.querySelector('title'));

    const description = filterFromCData(item.querySelector('description'));

    const url = item.querySelector('link').textContent;

    posts.push({
      title,
      description,
      url,
      clicked: false,
      id: uniqueId(),
    });
  });

  return posts;
};

const getFeeds = (newDocument) => {
  const title = filterFromCData(newDocument.querySelector('title'));
  const description = newDocument.querySelector('description').textContent;
  return [{ title, description, id: uniqueId() }];
};

const getData = (url) =>
  parser(url)
    .then((RSSDocument) => {
      if (RSSDocument.querySelector('parsererror')) {
        throw new Error('shouldBeValidRSS');
      }
      const feeds = getFeeds(RSSDocument);
      const posts = getPosts(RSSDocument);
      return Promise.resolve({ feeds, posts });
    })
    .catch((err) => Promise.reject(err));

export default getData;
