// src/index.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

// Función para manejar la adición de un RSS (debe devolver una Promesa)
const handleRssAddition = (url) => {
  console.log(`Intentando agregar RSS: ${url}`);
  
  // *** Implementación con Promesas aquí ***
  // Ejemplo: fetch(url).then(response => response.json()).then(data => ...).catch(error => ...)
  return new Promise((resolve, reject) => {
    // Simulación de una operación asíncrona exitosa
    setTimeout(() => {
      if (url.startsWith('http')) {
         resolve({ message: 'Flujo RSS agregado con éxito' });
      } else {
         reject(new Error('URL no válida'));
      }
    }, 1000);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('rss-form');
  const input = form.querySelector('input[type="url"]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = input.value;
    
    // Llamada a la función y gestión del resultado con Promesas
    handleRssAddition(url)
      .then((result) => {
        console.log('Éxito:', result.message);
        form.reset();
      })
      .catch((error) => {
        console.error('Error:', error.message);
      });
  });
});

