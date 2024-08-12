// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginUnicorn.configs['flat/recommended'],
  {
    ignores: ['public/build/'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.builtin,
        ...globals.serviceworker,
        ...globals.webextensions,
      },
    },
    rules: {
      'no-console': [
        'error',
        {
          allow: ['error'],
        },
      ],
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'unicorn/no-null': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/prevent-abbreviations': 'off',
    },
  },
);
