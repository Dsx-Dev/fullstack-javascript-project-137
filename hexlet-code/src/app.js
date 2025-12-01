import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import onChange from 'on-change';
import parse from './parser.js';
import watch from './view.js';
import resources from './locales/es.js';

const schema = yup.string().url().required();

const addProxy = (url) => {
  const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
};

const loadRSS = (url) => axios.get(addProxy(url))
  .then((response) => {
    const parsedData = parse(response.data.contents);
    return parsedData;
  });

const validate = (url, feeds) => {
  try {
    schema.validateSync(url);
    const urls = feeds.map((feed) => feed.url);
    if (urls.includes(url)) {
      throw new Error('duplicateUrl');
    }
    return null;
  } catch (error) {
    if (error.message === 'duplicateUrl') {
      return 'duplicateUrl';
    }
    return 'invalidUrl';
  }
};

const updatePosts = (state) => {
  const promises = state.feeds.map((feed) => 
    loadRSS(feed.url)
      .then((data) => {
        const oldPosts = state.posts.filter((post) => post.feedId === feed.id);
        const oldLinks = oldPosts.map((post) => post.link);
        const newPosts = data.posts
          .filter((post) => !oldLinks.includes(post.link))
          .map((post) => ({ ...post, id: _.uniqueId(), feedId: feed.id }));
        
        state.posts = [...newPosts, ...state.posts];
      })
      .catch((error) => {
        console.error('Error updating posts:', error);
      })
  );

  Promise.all(promises).finally(() => {
    setTimeout(() => updatePosts(state), 5000);
  });
};

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    submitBtn: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    modal: document.getElementById('modal'),
  };

  const initialState = {
    form: {
      status: 'filling',
      error: null,
      valid: false,
    },
    feeds: [],
    posts: [],
    ui: {
      visitedPosts: new Set(),
    },
  };

  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'es',
    debug: false,
    resources: {
      es: resources,
    },
  }).then(() => {
    const watchedState = onChange(initialState, watch(initialState, elements, i18nInstance));

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const url = formData.get('url').trim();

      const error = validate(url, watchedState.feeds);
      if (error) {
        watchedState.form.error = error;
        watchedState.form.valid = false;
        return;
      }

      watchedState.form.status = 'sending';
      watchedState.form.error = null;

      loadRSS(url)
        .then((data) => {
          const feedId = _.uniqueId();
          const feed = {
            id: feedId,
            url,
            title: data.feed.title,
            description: data.feed.description,
          };

          const posts = data.posts.map((post) => ({
            ...post,
            id: _.uniqueId(),
            feedId,
          }));

          watchedState.feeds = [feed, ...watchedState.feeds];
          watchedState.posts = [...posts, ...watchedState.posts];
          watchedState.form.status = 'filling';
          watchedState.form.valid = true;
          watchedState.form.error = null;
        })
        .catch((error) => {
          watchedState.form.status = 'filling';
          if (error.isParsingError) {
            watchedState.form.error = 'invalidRSS';
          } else {
            watchedState.form.error = 'networkError';
          }
        });
    });

    elements.postsContainer.addEventListener('click', (e) => {
      const { id } = e.target.dataset;
      if (!id) {
        return;
      }

      watchedState.ui.visitedPosts.add(id);

      if (e.target.tagName === 'BUTTON') {
        const post = watchedState.posts.find((p) => p.id === id);
        if (post) {
          const modalTitle = elements.modal.querySelector('.modal-title');
          const modalBody = elements.modal.querySelector('.modal-body');
          const modalLink = elements.modal.querySelector('.full-article');

          modalTitle.textContent = post.title;
          modalBody.innerHTML = post.description;
          modalLink.href = post.link;
        }
      }
    });

    setTimeout(() => updatePosts(watchedState), 5000);
  });
};