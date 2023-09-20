import axios from 'axios';

export default (url) =>
  axios
    .get(
      `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(
        url
      )}`
    )
    .then((response) => {
      const parser = new DOMParser();
      return parser.parseFromString(response.data.contents, 'text/html');
    })
    .catch((err) => console.log(err));
