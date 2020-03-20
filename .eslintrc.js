module.exports = {
  env: {
    commonjs: true,
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
    ecmaFeatures: {
        impliedStrict: true
    }
  },
  rules: {
    strict: 0,
  },
};
