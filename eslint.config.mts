// @ts-check
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  // Files we never lint.
  { ignores: ['dist/**', '.astro/**', 'node_modules/**', 'coverage/**'] },

  // Base recommended JS rules.
  js.configs.recommended,

  // TypeScript-aware rules (no type-checking pass, keeps lint fast).
  ...tseslint.configs.recommended,

  // Astro components: parser + client-side TS processor + recommended rules.
  ...astro.configs['flat/recommended'],

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  {
    files: ['**/*.astro'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // MDX/astro islands run inside the browser after hydration.
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  {
    // Config files run in Node.
    files: ['*.config.{js,mjs,cjs,ts,mts,cts}', 'src/**/*.config.ts'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // Turn off formatting rules that conflict with Prettier (run last).
  prettier
);
