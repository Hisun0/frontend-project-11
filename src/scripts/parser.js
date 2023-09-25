import axios from 'axios';

const parser = (url) => axios
  .get(
    `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(
      url,
    )}`,
  )
  .then((response) => {
    if (!response) throw new Error(500);
    const DOMparser = new DOMParser();
    return DOMparser.parseFromString(response.data.contents, 'text/html');
  })
  .catch((err) => console.log(err));

// const parser = (url) => {
//   getData(url)
//     .then((response) => {
//       setTimeout(parser, 5000);
//       return response;
//     })
//     .catch((err) => console.log(err));
// };

export default parser;
