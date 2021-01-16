module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    'no-console': 'error',
    'no-shadow': 'off',
    'no-array-constructor': 'error',
    'no-useless-return': 'error',
    'no-useless-computed-key': 'error',
    'no-cond-assign': 'error',
    'no-debugger': 'error',
    'no-delete-var': 'error',
    'no-else-return': 'error',
    'no-useless-constructor': 'error',
    'no-use-before-define': 'error',
    'no-eq-null': 'error',
    'no-return-await': 'error',
    'no-unused-vars': 'error',
    'no-unreachable': 'error',
    'no-useless-rename': 'error',
    'no-useless-concat': 'error',
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
  },
};
