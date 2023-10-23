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
  new Promise((resolve, reject) =>
    axios
      .get(
        `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(
          url,
        )}`,
      )
      .then((response) => {
        const DOMparser = new DOMParser();
        resolve(DOMparser.parseFromString(response.data.contents, 'text/html'));
      })
      .catch((err) => reject(err)),
  );

const getPosts = (newDocument) => {
  const items = newDocument.querySelectorAll('item');
  const posts = [];
  items.forEach((item) => {
    const title = filterFromCData(item.querySelector('title'));

    const description = filterFromCData(item.querySelector('description'));

    const url = [...item.childNodes]
      .filter((el) => el.nodeType === 3)
      .filter((el) => el.data.indexOf('http') >= 0)[0]
      .data.trim();

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
  new Promise((resolve, reject) =>
    parser(url)
      .then((RSSDocument) => {
        const feeds = getFeeds(RSSDocument);
        const posts = getPosts(RSSDocument);
        resolve({ feeds, posts });
      })
      .catch((err) => reject(err)),
  );

export default getData;
