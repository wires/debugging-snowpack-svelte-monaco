import App from "./App.svelte"

import 'monaco-editor'
import 'monaco-editor/esm/vs/language/json/json.worker.js'
import 'monaco-editor/esm/vs/language/css/css.worker.js'
import 'monaco-editor/esm/vs/language/html/html.worker.js'
import 'monaco-editor/esm/vs/language/typescript/ts.worker.js'
import 'monaco-editor/esm/vs/editor/editor.worker.js'

let app = new App({
  target: document.body,
});

export default app;

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(() => {
    app.$destroy();
  });
}
