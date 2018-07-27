module.exports = {
  "env": {
    "browser": true,
    "es6": true,
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
  ],
  "parser": "babel-eslint",
  "parserOptions": {
    ecmaVersion: 6,
    "sourceType": "module",
  },
  "plugins": [
    "react",
  ],
  "rules": {
    "indent": [
      "error",
      2,
    ],
    "linebreak-style": [
      "error",
      "unix",
    ],
    "quotes": [
      "error",
      "single",
    ],
    "semi": [
      "error",
      "never",
    ],
    "comma-dangle": [
      "error",
      "never",
    ],
    "no-console": [
      "warn"
    ],
    "comma-dangle": [
      "error",
      "only-multiline"
    ],
  },
}
