# RSS Reader

[![hexlet-check](https://github.com/Dsx-Dev/fullstack-javascript-project-137/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Dsx-Dev/fullstack-javascript-project-137/actions/workflows/hexlet-check.yml)

## 📖 Descripción

RSS Reader es un agregador de fuentes RSS que permite agregar un número ilimitado de feeds RSS, actualizarlos automáticamente y visualizar nuevas entradas en un flujo general.

**[🚀 Ver Demo en Vivo](https://your-project.vercel.app)**

## ✨ Características

- ✅ Agregar múltiples feeds RSS
- ✅ Validación de URLs con mensajes de error claros
- ✅ Actualización automática de feeds cada 5 segundos
- ✅ Previsualización de posts en modal
- ✅ Marcado visual de posts leídos/no leídos
- ✅ Interfaz responsive con Bootstrap 5
- ✅ Soporte para internacionalización
- ✅ Manejo de errores completo

## 🛠️ Tecnologías Utilizadas

### Frontend
- **JavaScript ES6+** - Lenguaje de programación
- **Bootstrap 5** - Framework CSS para UI/UX
- **Webpack 5** - Module bundler
- **Babel** - Transpilador de JavaScript

### Librerías
- **axios** - Cliente HTTP para peticiones
- **yup** - Validación de esquemas
- **on-change** - Observador de cambios de estado
- **i18next** - Internacionalización
- **lodash** - Utilidades de JavaScript

### Herramientas de Desarrollo
- **Webpack Dev Server** - Servidor de desarrollo con hot reload
- **ESLint** - Linter para mantener código limpio
- **GitHub Actions** - CI/CD
- **CodeClimate** - Análisis de calidad de código

## 📋 Requisitos Previos

- Node.js >= 14.x
- npm >= 6.x

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone git@github.com:Dsx-Dev/fullstack-javascript-project-137.git
cd fullstack-javascript-project-137
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Iniciar servidor de desarrollo

```bash
npm start
```

La aplicación se abrirá automáticamente en `http://localhost:8080`

## 📦 Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar tests
npm test

# Ejecutar linter
npm run lint
```

## 🎯 Uso

1. Ingresa la URL de un feed RSS en el campo de texto
   - Ejemplo: `https://hexlet.io/lessons.rss`
2. Haz clic en el botón **"Agregar"**
3. Los posts del feed aparecerán automáticamente
4. Haz clic en **"Просмотр"** para ver el contenido completo en un modal
5. Los feeds se actualizarán automáticamente cada 5 segundos

### Ejemplos de Feeds RSS

- `https://hexlet.io/lessons.rss` - Blog de Hexlet
- `https://lorem-rss.herokuapp.com/feed` - Feed de prueba

## 🏗️ Estructura del Proyecto

```
fullstack-javascript-project-137/
├── src/
│   ├── locales/          # Archivos de traducción
│   │   └── es.js         # Traducciones en español
│   ├── app.js            # Lógica principal de la aplicación
│   ├── index.js          # Punto de entrada
│   ├── parser.js         # Parser de XML RSS
│   ├── view.js           # Funciones de renderizado
│   └── styles.css        # Estilos personalizados
├── index.html            # Plantilla HTML base
├── webpack.config.js     # Configuración de Webpack
├── package.json          # Dependencias y scripts
├── .babelrc             # Configuración de Babel
└── README.md            # Este archivo
```

## 🔧 Configuración

### Webpack

El proyecto utiliza Webpack 5 para el empaquetado de módulos. La configuración incluye:

- **Entry point**: `./src/index.js`
- **Output**: `./dist/bundle.js`
- **Loaders**: Babel (JS), CSS Loader, Style Loader
- **Plugins**: HtmlWebpackPlugin
- **Dev Server**: Puerto 8080 con hot reload

### Bootstrap

Se utiliza Bootstrap 5 para los componentes de UI:
- Grid System para layout responsive
- Componentes: Modal, Forms, Buttons, Cards
- Utilidades para espaciado y tipografía

### Proxy CORS

El proyecto utiliza `https://allorigins.hexlet.app/` como proxy para evitar problemas de CORS al cargar feeds RSS de diferentes dominios.

## ⚠️ Manejo de Errores

La aplicación maneja los siguientes tipos de errores:

| Error | Mensaje | Descripción |
|-------|---------|-------------|
| Campo vacío | "Не должно быть пустым" | El campo de URL está vacío |
| URL inválida | "Ссылка должна быть валидным URL" | La URL no tiene formato válido |
| RSS duplicado | "RSS уже существует" | El feed ya fue agregado |
| Error de red | "Ошибка сети" | No se pudo conectar al servidor |
| RSS inválido | "Ресурс не содержит валидный RSS" | El contenido no es un RSS válido |

## 🎨 Características de UI/UX

### Posts No Leídos
- Clase CSS: `fw-bold` (negrita)
- Color: Negro (#212529)

### Posts Leídos
- Clase CSS: `fw-normal` (peso normal)
- Color: Gris (#6c757d)
- Se marcan automáticamente al hacer clic en "Просмотр" o en el enlace

### Modal de Previsualización
- Muestra el título completo del post
- Muestra la descripción/contenido
- Incluye botón "Leer completo" que abre el artículo original

## 🧪 Testing

Este proyecto utiliza pruebas automatizadas con Playwright para verificar:

- Validación de formularios
- Carga de feeds RSS
- Actualización automática de posts
- Funcionalidad del modal
- Marcado de posts leídos/no leídos

## 📝 Requisitos del Proyecto

### Restricciones Técnicas
- ✅ Sin estado global (todo el estado dentro de funciones)
- ✅ Localización por defecto: `es` (español)
- ✅ Uso de Promesas (no async/await)
- ✅ Elementos semánticos HTML correctos
- ✅ Nombre del paquete: `@hexlet/code`

### Validación
- URL debe ser válida
- No se permiten feeds duplicados
- Manejo de errores de red
- Validación de formato RSS

## 🚢 Despliegue

El proyecto está desplegado en Vercel:

**[🔗 Ver aplicación en vivo](https://your-project.vercel.app)**

### Desplegar tu propia versión

1. Crea una cuenta en [Vercel](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. Configura el build command: `npm run build`
4. Configura el output directory: `dist`
5. ¡Despliega!

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

ISC

## 👤 Autor

**Dsx-Dev**

- GitHub: [@Dsx-Dev](https://github.com/Dsx-Dev)
- Proyecto: [fullstack-javascript-project-137](https://github.com/Dsx-Dev/fullstack-javascript-project-137)

## 🙏 Agradecimientos

- [Hexlet](https://hexlet.io) - Plataforma educativa
- [Bootstrap](https://getbootstrap.com) - Framework CSS
- [Webpack](https://webpack.js.org) - Module bundler
- Comunidad de código abierto

---

⭐️ Si te gustó este proyecto, ¡dale una estrella en GitHub!