export default {
  translation: {
    // 1. Textos de la interfaz (Interfaz de Usuario)
    app: {
      title: 'Agregador de Feeds RSS',
      subtitle: 'Empieza a leer hoy. Es fácil, es gratis.',
      placeholder: 'Enlace del feed RSS',
      button: 'Añadir',
      feedsTitle: 'Feeds',
      postsTitle: 'Noticias',
    },
    feedback: {
      success: 'Feed agregado con éxito.',
      networkError: 'Error de red: Problemas de conexión o el proxy no responde.',
      parsingError: 'Error de procesamiento: El feed no es un XML RSS válido.',
      unknownError: 'Ha ocurrido un error desconocido.',
    },
    
    // 2. Textos de los errores de yup (Validación)
    yup: {
      mixed: {
        notOneOf: 'Este feed ya ha sido agregado.',
      },
      string: {
        url: 'La dirección ingresada no es una URL válida.',
        required: 'La dirección es obligatoria.',
      },
    },
  },
};