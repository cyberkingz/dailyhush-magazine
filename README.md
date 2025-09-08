# DailyHush — Blog + CMS (Vite)

Tech stack: Vite + React + Tailwind + (shadcn/ui later) • Supabase (Auth, Postgres, Storage) • Netlify deploy.

## Develop

Requires Node.js: ^20.19 or >=22.12

1) Env vars (Netlify/Vite):

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

2) Run dev:

```
npm install
npm run dev
```

## Build & Deploy (Netlify)

- Build command: `npm run build`
- Publish directory: `dist`
- Redirects: see `public/_redirects` and `netlify.toml`

## Structure

```
/public
  _redirects, robots.txt, favicon.ico
/src
  /app (routing & providers)
  /pages (public + admin CMS)
  /components (ui, layout, blog, forms) [stubs]
  /lib (supabase, auth, api, utils)
  /styles/globals.css
```

SQL, RLS, and storage schema in `supabase/schema.sql` (add next).

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
# dailyhush-magazine
