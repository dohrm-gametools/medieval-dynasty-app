module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    project: './tsconfig.json',
    sourceType: 'module'
  },
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint'
  ],
  settings: {
    react: { version: 'detect' }
  },
  rules: {
    semi: ['error', 'always'],
    'react/prop-types': 0,
    'camelcase': 0,
    'func-call-spacing': 0,
    'no-prototype-builtins': 0,
    'space-before-function-paren': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-unsafe-member-access': 0,
    '@typescript-eslint/no-unsafe-assignment': 0
  }
};
