import axios from 'axios';

const parser = (url) =>
  axios
    .get(
      `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(
        url
      )}`
    )
    .then((response) => {
      if (!response) throw new Error(500);
      const parser = new DOMParser();
      return parser.parseFromString(response.data.contents, 'text/html');
    })
    .catch((err) => console.log(err));

export default parser;
