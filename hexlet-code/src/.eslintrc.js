module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'plugin:prettier/recommended', // Debe ser el último para apagar reglas en conflicto
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    // Permite usar console.log para el desarrollo
    'no-console': 'off',
    // Configuración para usar Prettier como herramienta de formateo
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};