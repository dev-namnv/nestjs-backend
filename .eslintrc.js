module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'airbnb/base',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'quotes': [
      'error',
      'single',
      {
        'avoidEscape': true
      }
    ],
    'semi': 0,
    'comma-dangle': 0,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    'func-names': 0,
    'class-methods-use-this': 0,
    'consistent-return': 0,
    'new-cap': 0,
    'no-underscore-dangle': [2, { 'allow': ['_id'] }],
    'no-console': 0,
    'no-use-before-define': 0,
    'no-useless-constructor': 0,
    'no-empty-function': 0,
    'object-curly-newline': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-this-alias': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    'no-restricted-syntax': 0,
    'no-param-reassign': 0,
    'max-classes-per-file': 0,
    '@typescript-eslint/class-name-casing': 0
  },
};
