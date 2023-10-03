import axios from 'axios';
import { uniqueId } from 'lodash';

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

const getData = (url) =>
  new Promise((resolve, reject) =>
    parser(url)
      .then((RSSDocument) => {
        console.log(RSSDocument);
        console.log(url);
        const mainTitle = RSSDocument.querySelector('title').textContent;
        const mainDescription =
          RSSDocument.querySelector('description').textContent;
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
            .filter((el) => el.data.indexOf('http') >= 0)[0]
            .data.trim();

          posts.push({
            title,
            description,
            link,
            id: uniqueId(),
          });
        });
        resolve({
          feeds: [
            { title: mainTitle, description: mainDescription, id: uniqueId() },
          ],
          posts,
        });
      })
      .catch((err) => reject(err)),
  );

// const parser = (url) => {
//   getData(url)
//     .then((response) => {
//       setTimeout(parser, 5000);
//       return response;
//     })
//     .catch((err) => console.log(err));
// };

export default getData;
