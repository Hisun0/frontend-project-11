import { string, setLocale } from 'yup';

export default (url, urls) => new Promise((resolve, reject) => {
  setLocale({
    string: {
      url: () => 'shouldBeValidURL',
      required: () => 'shouldBeNotEmpty',
    },
    notOneOf: () => 'alreadyExist',
  });

  const urlSchema = string().required().url().notOneOf(urls, 'alreadyExist');

  urlSchema
    .validate(url)
    .then((result) => resolve(result))
    .catch((err) => reject(err.message));
});
