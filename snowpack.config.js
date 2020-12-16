/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: {url: '/', static: true},
    src: {url: '/dist'},
  },
  plugins: [
    '@snowpack/plugin-svelte',
    '@snowpack/plugin-dotenv',
  ],
  install: [
    // if you do not refer to these modules, they are to placed in web_modules
    // https://github.com/snowpackjs/snowpack/discussions/1756
    'monaco-editor',
    'monaco-editor/esm/vs/language/json/json.worker.js',
    'monaco-editor/esm/vs/language/css/css.worker.js',
    'monaco-editor/esm/vs/language/html/html.worker.js',
    'monaco-editor/esm/vs/language/typescript/ts.worker.js',
    'monaco-editor/esm/vs/editor/editor.worker.js'
  ],
  installOptions: {

  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    clean: true,
  },
  proxy: {
    /* ... */
  },
  alias: {
    /* ... */
  },
};
