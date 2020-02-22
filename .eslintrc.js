module.exports = {
  env: {
    commonjs: true,
    /*es6: true,*/
    jest: true
  },
  extends: [
    'standard',
    'plugin:jest/recommended'
  ],
  plugins: [
    'jest'
  ],
  parserOptions: {
    /*ecmaVersion: 2018,*/
    /*sourceType: "module",*/
    ecmaFeatures: {
        impliedStrict: true
    }
  },
  rules: {
    strict: 0,
  },
};
