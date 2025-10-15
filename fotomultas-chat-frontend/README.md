# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# Fotomultas Chat - Frontend

Aplicación web para consultar fotomultas de tránsito en Colombia mediante un chat conversacional con IA.

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── Chat/
│   │   │   ├── ChatContainer.jsx
│   │   │   └── Message.jsx
│   │   └── Multas/
│   │       └── MultaCard.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── Chat.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── index.html
```

## 🚀 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita el archivo `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 4. Build para producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## 📦 Tecnologías Utilizadas

- **React 18** - Framework de UI
- **Vite** - Build tool
- **React Router** - Navegación
- **Tailwind CSS** - Estilos
- **Axios** - HTTP Client
- **Lucide React** - Iconos

## 🎨 Características

### Páginas

1. **Home** (`/`)
   - Página de bienvenida
   - Descripción del servicio
   - Call to action para login

2. **Login** (`/login`)
   - Autenticación con número de documento
   - Validación de formulario
   - Manejo de errores

3. **Chat** (`/chat`)
   - Interfaz de chat conversacional
   - Visualización de multas en tiempo real
   - Mensajes del bot con información contextual

### Componentes Principales

#### ChatContainer
```jsx
// Maneja el estado del chat y la comunicación con el backend
<ChatContainer />
```

#### Message
```jsx
// Renderiza mensajes del usuario y del bot
<Message message={messageData} />
```

#### MultaCard
```jsx
// Muestra información detallada de una multa
<MultaCard multa={multaData} />
```

## 🔌 API Endpoints Esperados

El frontend espera que el backend exponga estos endpoints:

### Autenticación
```
POST /api/auth/login
Body: { documentNumber, documentType }
Response: { token, user }
```

### Chat
```
POST /api/chat
Headers: { Authorization: Bearer <token> }
Body: { message, documentNumber }
Response: { message, multas? }
```

```
GET /api/chat/history/:documentNumber
Headers: { Authorization: Bearer <token> }
Response: { messages: [] }
```

### Multas
```
POST /api/multas/consultar
Headers: { Authorization: Bearer <token> }
Body: { documentType, documentNumber }
Response: { multas: [] }
```

## 🎯 Próximos Pasos

Una vez que el frontend esté funcionando, necesitarás:

1. ✅ **Backend con Express** - API REST
2. ✅ **MCP Server** - Herramientas para el agente IA
3. ✅ **Sistema RAG** - Base de conocimiento
4. ✅ **Integración con Claude** - Agente conversacional
5. ✅ **Integración con SIMIT API** - Consulta de multas

## 🔧 Scripts Disponibles

```bash
npm run dev          # Modo desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linter
```

## 📱 Responsive Design

La aplicación está optimizada para:
- 📱 Mobile (320px+)
- 💻 Tablet (768px+)
- 🖥️ Desktop (1024px+)

## 🐛 Troubleshooting

### El servidor no se conecta
Verifica que:
- El backend esté corriendo en `http://localhost:3000`
- La variable `VITE_API_URL` esté correctamente configurada
- No haya problemas de CORS

### Estilos no se aplican
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Errores de compilación
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📄 Licencia

MIT