import { string } from 'yup';

export default (url) => {
  const urlSchema = string().url('Ссылка должна быть валидным URL');
  return urlSchema.validate(url);
};
