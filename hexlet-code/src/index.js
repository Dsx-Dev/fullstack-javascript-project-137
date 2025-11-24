import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from 'yup';
import i18n from 'i18next';
import init from 'yup-i18next';
import axios from 'axios';

// Importar los recursos de localización
import resources from './locales/es.js';

// ===================================
// I. ESTADO GLOBAL DE LA APLICACIÓN
// ===================================

const state = {
  // Estado de la interfaz y errores
  form: {
    processState: 'filling', // filling, sending, failed, finished
    error: null,
  },
  
  // Almacena las URLs de los feeds para la validación rápida de duplicados
  feedUrls: new Set(), 
  
  // Datos normalizados
  feeds: [], // [{ id, url, title, description }]
  posts: [], // [{ id, feedId, title, link }]
};

// ===================================
// II. UTILIDADES Y LÓGICA DE PARSEO
// ===================================

const proxyUrl = (url) => {
  const origin = 'https://allorigins.hexlet.app';
  // Deshabilitar la caché para obtener siempre el contenido más reciente
  const proxy = `${origin}/get?disableCache=true&url=${encodeURIComponent(url)}`;
  return proxy;
};

// Genera IDs únicos
const generateId = () => crypto.randomUUID();

/**
 * Parsea el XML del RSS y extrae el título, descripción y posts.
 * @param {string} xmlString El contenido XML del feed.
 * @param {string} feedUrl La URL original del feed (para referencia).
 * @returns {{feed: Object, posts: Array}} Datos del feed y sus posts.
 */
const parseRss = (xmlString, feedUrl) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');

  // Verifica si hay errores de parseo (la etiqueta <parsererror> existe en caso de fallo)
  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    throw new Error('parsingError'); // Usará la clave de i18next
  }

  try {
    const feedId = generateId();
    
    // Extraer datos del feed (canal)
    const feedTitle = doc.querySelector('channel > title').textContent;
    const feedDescription = doc.querySelector('channel > description').textContent;

    const feed = {
      id: feedId,
      url: feedUrl,
      title: feedTitle,
      description: feedDescription,
    };

    // Extraer posts
    const items = doc.querySelectorAll('item');
    const posts = Array.from(items).map((item) => {
      const title = item.querySelector('title').textContent;
      const link = item.querySelector('link').textContent;
      
      return {
        id: generateId(),
        feedId,
        title,
        link,
      };
    });

    return { feed, posts };
  } catch (e) {
    // Captura errores si alguna etiqueta esencial falta (e.g., title o link)
    throw new Error('parsingError');
  }
};

// ===================================
// III. LÓGICA ASÍNCRONA (Promesa)
// ===================================

/**
 * Realiza la descarga y el parseo del feed.
 * @param {string} url La URL del feed RSS.
 * @returns {Promise<Object>} Una promesa que resuelve con los datos normalizados.
 */
const fetchAndParseFeed = (url) => {
  const proxyLink = proxyUrl(url);

  // Usamos Promesas: Axios devuelve una Promesa
  return axios.get(proxyLink)
    .then((response) => {
      // Axios envuelve la respuesta del proxy en data.contents
      const xmlString = response.data.contents;
      return parseRss(xmlString, url);
    })
    .catch((error) => {
      // Si Axios falla, es un error de red o de la API proxy
      console.error('Error en la petición/proxy:', error);
      throw new Error('networkError');
    });
};

// ===================================
// IV. VALIDACIÓN Y RENDERIZADO
// ===================================

const getValidationSchema = (existingFeeds) => yup.object({
  url: yup.string()
    .required()
    .url()
    .notOneOf(existingFeeds),
});

// Función para actualizar el estado visual de la interfaz
const setVisualFeedback = (elements, isValid, key = 'unknownError') => {
  const { inputEl, feedbackEl, submitButton } = elements;
  
  inputEl.classList.remove('is-invalid', 'is-valid');
  feedbackEl.textContent = '';
  submitButton.disabled = false;
  
  if (isValid === true) {
    inputEl.classList.add('is-valid');
    feedbackEl.classList.remove('text-danger');
    feedbackEl.classList.add('text-success');
    feedbackEl.textContent = i18next.t('feedback.success');
  } else if (isValid === false) {
    inputEl.classList.add('is-invalid');
    feedbackEl.classList.remove('text-success');
    feedbackEl.classList.add('text-danger');
    
    // Si el error es de yup, el mensaje ya viene en 'key'. Si es de red/parseo, se traduce.
    const message = (key.startsWith('feedback.')) ? i18next.t(key) : key;
    feedbackEl.textContent = message;
  }
};

/**
 * Renderiza todos los feeds y posts basados en el estado.
 */
const render = () => {
  const feedsContainer = document.getElementById('feeds-container');
  const postsContainer = document.getElementById('posts-container');
  const i18nInstance = i18n.getFixedT(i18n.language); // Obtener la función de traducción

  feedsContainer.innerHTML = '';
  postsContainer.innerHTML = '';

  // Renderizar Feeds
  if (state.feeds.length > 0) {
    const feedsHtml = state.feeds.map((feed) => `
      <li class="list-group-item">
        <h5 class="m-0">${feed.title}</h5>
        <p class="m-0 text-muted small">${feed.description}</p>
      </li>
    `).join('');
    
    feedsContainer.innerHTML = `
      <div class="card border-0">
        <div class="card-body">
          <h2 class="card-title h4">${i18nInstance('app.feedsTitle')}</h2>
        </div>
        <ul class="list-group list-group-flush">${feedsHtml}</ul>
      </div>
    `;
  }
  
  // Renderizar Posts
  if (state.posts.length > 0) {
    const postsHtml = state.posts.map((post) => `
      <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
        <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="fw-bold">${post.title}</a>
      </li>
    `).join('');
    
    postsContainer.innerHTML = `
      <div class="card border-0">
        <div class="card-body">
          <h2 class="card-title h4">${i18nInstance('app.postsTitle')}</h2>
        </div>
        <ul class="list-group list-group-flush">${postsHtml}</ul>
      </div>
    `;
  }
};


const handleSubmit = (e) => {
  e.preventDefault();

  const form = e.target;
  const inputEl = form.querySelector('#url-input');
  const feedbackEl = form.querySelector('#feedback');
  const submitButton = form.querySelector('button[type="submit"]');
  
  const elements = { inputEl, feedbackEl, submitButton };
  const url = inputEl.value.trim();

  // 1. Resetear la interfaz y deshabilitar botón
  setVisualFeedback(elements, null);
  submitButton.disabled = true;

  // 2. Validación local con yup
  const validationSchema = getValidationSchema(Array.from(state.feedUrls));

  validationSchema.validate({ url }, { abortEarly: true })
    .then(() => {
      // 3. Validación exitosa: Iniciar proceso asíncrono
      state.form.processState = 'sending';
      
      return fetchAndParseFeed(url);
    })
    .then(({ feed, posts }) => {
      // 4. Petición y Parseo exitoso: Actualizar estado normalizado
      state.feeds.push(feed);
      state.posts.push(...posts);
      state.feedUrls.add(url); // Añadir para validación de duplicados
      
      state.form.processState = 'finished';

      // Actualizar la interfaz
      setVisualFeedback(elements, true);
      
      // Renderizar el contenido
      render(); 
      
      // Limpiar y enfocar el formulario
      form.reset();
      inputEl.focus();

    })
    .catch((err) => {
      // 5. Manejo de Errores (Validación, Red o Parseo)
      state.form.processState = 'failed';
      
      let errorKey;
      if (err.name === 'ValidationError') {
        // Error de validación (yup). El mensaje es el texto de error literal.
        errorKey = err.errors[0]; 
      } else {
        // Errores de red o parseo (usamos la clave de error que arrojamos)
        errorKey = `feedback.${err.message}`;
      }
      
      setVisualFeedback(elements, false, errorKey);
    });
};


// ===================================
// V. PUNTO DE ENTRADA
// ===================================

const updateUI = () => {
    // Usar i18nextInstance.t para obtener la función de traducción
    const i18nInstance = i18n.getFixedT(i18n.language); 
    
    // Aplicar textos a elementos de la UI
    const inputEl = document.getElementById('url-input');
    const button = document.querySelector('button[type="submit"]');

    if (inputEl) inputEl.placeholder = i18nInstance('app.placeholder');
    if (button) button.textContent = i18nInstance('app.button');
    
    // Actualizar Títulos de la aplicación si fuera necesario
    // document.querySelector('h1').textContent = i18nInstance('app.title'); 
};


const app = () => {
  const form = document.getElementById('rss-form');
  const inputEl = form.querySelector('#url-input');
  
  // 1. Inicializa el foco en el input
  if (inputEl) inputEl.focus();

  // 2. Asignar el handler al evento submit
  if (form) form.addEventListener('submit', handleSubmit);
};


// Inicializar I18Next y la aplicación
i18n.createInstance().init({
  lng: 'es',
  debug: false,
  resources: {
    'es': resources,
  },
}).then(() => {
  // Conectar yup a i18next
  init(i18n.getFixedT(i18n.language));
  
  // Iniciar la aplicación después de la inicialización
  app();
  updateUI();
});