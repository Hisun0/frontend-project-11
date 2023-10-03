import { string, setLocale } from 'yup';

export default (url, urls) =>
  new Promise((resolve, reject) => {
    setLocale({
      string: {
        url: () => ({ key: 'shouldBeValidURL' }),
      },
      required: () => ({ key: 'shouldBeNotEmpty' }),
      notOneOf: () => ({ key: 'alreadyExists' }),
    });

    const urlSchema = string().required().url().notOneOf(urls);
    urlSchema
      .validate(url)
      .then((result) => resolve(result))
      .catch((err) => reject(err.message.key));
  });
