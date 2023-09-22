const createElementWithAttributes = (
  tagName,
  classNames = [],
  attributes = {},
  text
) => {
  const element = document.createElement(tagName);
  classNames.forEach((className) => element.classList.add(className));
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) =>
      element.setAttribute(key, value)
    );
  }
  element.textContent = text;
  return element;
};

const createList = (items) => {
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  items.forEach((item) => {
    ul.append(item);
  });
  return ul;
};

const createPostItem = ({ title, link, id }) => {
  const li = createElementWithAttributes('li', [
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
    'border-0',
    'border-end-0',
  ]);

  const a = createElementWithAttributes(
    'a',
    ['fw-bold'],
    {
      href: link,
      'data-id': id,
      target: '_blank',
      rel: 'noopener noreferrer',
    },
    title
  );

  const button = createElementWithAttributes(
    'button',
    ['btn', 'btn-outline-primary', 'btn-sm'],
    {
      type: 'button',
      'data-id': id,
      'data-bs-toggle': 'modal',
      'data-bs-target': '#modal',
    },
    'Просмотр'
  );

  li.append(a, button);
  return li;
};

const createFeedItem = ({ title, description }) => {
  const li = createElementWithAttributes('li', [
    'list-group-item',
    'border-0',
    'border-end-0',
  ]);
  const h3 = createElementWithAttributes('h3', ['h6', 'm-0'], false, title);
  const p = createElementWithAttributes(
    'p',
    ['m-0', 'small', 'text-black-50'],
    false,
    description
  );

  li.append(h3, p);
  return li;
};

const createCard = (title, list) => {
  const cardDiv = createElementWithAttributes('div', ['card', 'border-0']);
  const cardBody = createElementWithAttributes('div', ['card-body']);
  const h2 = createElementWithAttributes(
    'h2',
    ['card-title', 'h4'],
    false,
    title
  );

  cardBody.append(h2);
  cardDiv.append(cardBody, list);

  return cardDiv;
};

export const showPosts = (data) => {
  const postItems = data.map(createPostItem);
  const postList = createList(postItems);
  return createCard('Посты', postList);
};

export const showFeeds = (data) => {
  const feedItems = data.map(createFeedItem);
  const feedList = createList(feedItems);
  return createCard('Фиды', feedList);
};
