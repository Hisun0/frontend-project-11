import { watchedModalState, watchedLinkState } from '../scripts/view.js';

export default (modalButton, state) => {
  const postId = modalButton.dataset.buttonId;
  const post = state.posts.find(({ id }) => postId === id);
  post.clicked = true;
  watchedModalState(state).modalData = post;
  watchedLinkState(state).clickedLinks.push(postId);
};
