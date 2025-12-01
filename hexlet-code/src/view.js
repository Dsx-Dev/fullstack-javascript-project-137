import { Modal } from 'bootstrap';

const renderFeeds = (feeds, elements, i18n) => {
  const { feedsContainer } = elements;

  if (feeds.length === 0) {
    feedsContainer.innerHTML = '';
    return;
  }

  const feedsHTML = `
    <div class="card border-0">
      <div class="card-body">
        <h2 class="card-title h4">${i18n.t('feeds')}</h2>
      </div>
      <ul class="list-group border-0 rounded-0">
        ${feeds.map((feed) => `
          <li class="list-group-item border-0 border-end-0">
            <h3 class="h6 m-0">${feed.title}</h3>
            <p class="m-0 small text-black-50">${feed.description}</p>
          </li>
        `).join('')}
      </ul>
    </div>
  `;

  feedsContainer.innerHTML = feedsHTML;
};

const renderPosts = (posts, visitedPostIds, elements, i18n) => {
  const { postsContainer } = elements;

  if (posts.length === 0) {
    postsContainer.innerHTML = '';
    return;
  }

  const postsHTML = `
    <div class="card border-0">
      <div class="card-body">
        <h2 class="card-title h4">${i18n.t('posts')}</h2>
      </div>
      <ul class="list-group border-0 rounded-0">
        ${posts.map((post) => {
          const fontWeightClass = visitedPostIds.has(post.id) ? 'fw-normal' : 'fw-bold';
          return `
            <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
              <a href="${post.link}" 
                 class="${fontWeightClass}" 
                 data-id="${post.id}" 
                 target="_blank" 
                 rel="noopener noreferrer">
                ${post.title}
              </a>
              <button type="button" 
                      class="btn btn-outline-primary btn-sm" 
                      data-id="${post.id}" 
                      data-bs-toggle="modal" 
                      data-bs-target="#modal">
                ${i18n.t('preview')}
              </button>
            </li>
          `;
        }).join('')}
      </ul>
    </div>
  `;

  postsContainer.innerHTML = postsHTML;
};

const renderModal = (post, elements) => {
  const { modal } = elements;
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  const modalLink = modal.querySelector('.full-article');

  modalTitle.textContent = post.title;
  modalBody.innerHTML = post.description;
  modalLink.href = post.link;
};

const setFeedback = (message, type, elements) => {
  const { feedback, input } = elements;
  
  feedback.textContent = message;
  feedback.classList.remove('text-success', 'text-danger');
  
  if (type === 'success') {
    feedback.classList.add('text-success');
    input.classList.remove('is-invalid');
  } else if (type === 'error') {
    feedback.classList.add('text-danger');
    input.classList.add('is-invalid');
  }
};

const clearFeedback = (elements) => {
  const { feedback, input } = elements;
  feedback.textContent = '';
  feedback.classList.remove('text-success', 'text-danger');
  input.classList.remove('is-invalid');
};

export default (state, elements, i18n) => (path) => {
  switch (path) {
    case 'feeds':
      renderFeeds(state.feeds, elements, i18n);
      break;
    
    case 'posts':
      renderPosts(state.posts, state.ui.visitedPosts, elements, i18n);
      break;
    
    case 'ui.visitedPosts':
      renderPosts(state.posts, state.ui.visitedPosts, elements, i18n);
      break;
    
    case 'form.status':
      if (state.form.status === 'sending') {
        elements.submitBtn.disabled = true;
        elements.input.disabled = true;
      } else {
        elements.submitBtn.disabled = false;
        elements.input.disabled = false;
      }
      break;
    
    case 'form.error':
      if (state.form.error) {
        setFeedback(i18n.t(`errors.${state.form.error}`), 'error', elements);
      }
      break;
    
    case 'form.valid':
      if (state.form.valid) {
        clearFeedback(elements);
        setFeedback(i18n.t('success.rssLoaded'), 'success', elements);
        elements.form.reset();
        elements.input.focus();
      }
      break;

    default:
      break;
  }
};