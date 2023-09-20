import axios from 'axios';
import { uniqueId } from 'lodash';

export default (url) =>
  axios
    .get(
      `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(
        url
      )}`
    )
    .then((response) => {
      const parser = new DOMParser();
      const RSSDocument = parser.parseFromString(
        response.data.contents,
        'text/html'
      );
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
      return { title, description, posts };
    })
    .catch((err) => console.log(err));

// <item>
//       <title>ResponseEntity / Java: Корпоративные приложения на Spring Boot</title>
//       <guid ispermalink="false">4274</guid>
//       <link> https://ru.hexlet.io/courses/java-spring/lessons/response-entity/theory_unit
//       <description>Цель: Учимся добавлять свои собственные заголовки и менять код ответа</description>
//       <pubdate>Wed, 06 Sep 2023 11:21:18 +0000</pubdate>
//     </item>
