import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier'; // Importar
import prettierPlugin from 'eslint-plugin-prettier'; // Importar

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error', // Muestra errores de formato como errores de ESLint
    },
  },
  prettierConfig, // Desactiva reglas de ESLint que entran en conflicto con Prettier

  // eslint.config.mjs
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'public/*.js',
  ]),
]);

export default eslintConfig;
