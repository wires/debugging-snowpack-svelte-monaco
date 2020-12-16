
I'm trying to get `monaco-editor` to work with a Svelte app and build it using `snowpack` (using `pnpm`).
During the process I kept running into all kinds of issues, mostly loading to worker related errors.

Essentially trying to resolve this issue https://github.com/microsoft/monaco-editor/issues/2227 but with added Svelte support.

Here is a working gist, but without Svelte support. https://gist.github.com/mattpowell/221f7d35c4ae1273dc2e1ee469d000a7

I bootstrapped this using

```
pnpx create-snowpack-app --use-pnpm --template @snowpack/app-template-svelte snowpack-svelte-monaco
```

We need to add monaco and the worked to `snowpack.config.js`

```js
  install: [
    'monaco-editor',
    'monaco-editor/esm/vs/language/json/json.worker.js',
    'monaco-editor/esm/vs/language/css/css.worker.js',
    'monaco-editor/esm/vs/language/html/html.worker.js',
    'monaco-editor/esm/vs/language/typescript/ts.worker.js',
    'monaco-editor/esm/vs/editor/editor.worker.js'
  ]
```

but this is not enough, if you do not refer to these modules, they are not placed in `web_modules` when you run `snowpack build`.
https://github.com/snowpackjs/snowpack/discussions/1756

So we also modify `index.js`

```js
import 'monaco-editor'
import 'monaco-editor/esm/vs/language/json/json.worker.js'
import 'monaco-editor/esm/vs/language/css/css.worker.js'
import 'monaco-editor/esm/vs/language/html/html.worker.js'
import 'monaco-editor/esm/vs/language/typescript/ts.worker.js'
import 'monaco-editor/esm/vs/editor/editor.worker.js'
```

then I add this to `index.html`

```html
<!-- setting up monaco editor -->
<script type="module">
    import * as Monaco from '/web_modules/monaco-editor.js'
    window.Monaco = Monaco
    window.MonacoEnvironment = {
    getWorker(workerId, label) {
        return new Worker(
        window.MonacoEnvironment.getWorkerUrl(workerId, label),
        {
            name: label,
            type: 'module'
        }
        );
    },
    getWorkerUrl: function (moduleId, label) {
        if (label === 'json') {
        return '/web_modules/monaco-editor/esm/vs/language/json/json.worker.js';
        }
        if (label === 'css') {
        return '/web_modules/monaco-editor/esm/vs/language/css/css.worker.js';
        }
        if (label === 'html') {
        return '/web_modules/monaco-editor/esm/vs/language/html/html.worker.js';
        }
        if (label === 'typescript' || label === 'javascript') {
        return '/web_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js';
        }
        return '/web_modules/monaco-editor/esm/vs/editor/editor.worker.js';
    }
    };
</script>
```

I'm doing this in the `index.html` file and not `App.svelte` because I am basing it of `mattpowell`'s gist. I need a `<script type="module">` tag, which can't be used in a `.svelte` file.

We the inject the relevant stuff into `window`

```js
// make Monaco globally availble
window.Monaco = Monaco

// pointing the worker URL to modules specified in the `install` attribute of `snowpack.config.js`
window.MonacoEnvironment
```

Now it can be used in `App.svelte`. If you press `switchJs()` it will change workers (and you can see in the console that no errors are thrown)

```html
<div on:click={() => switchJs()}>switch js</div>
<div id="monaco"></div>

<style>
  #monaco {
    width: 100vw;
    height: 100vh;
  }
</style>

<script>
  import {onMount} from 'svelte';

  var editor = false;
  onMount(() => {
    editor = Monaco.editor.create(document.getElementById('monaco'), {
      value: document.documentElement.outerHTML,
      language: 'html'
    });

    window.addEventListener('resize', () => editor.layout(), false);
  });

  function switchJs () {
    if(editor) {
      let model = editor.getModel()
      editor.setValue('function hi (bla) {return `123 + ${bla}`}')
      console.log('setting')
      monaco.editor.setModelLanguage(model, 'javascript')
    }
  }
</script>
```

----

# New Project

> ✨ Bootstrapped with Create Snowpack App (CSA).

## Available Scripts

### pnpm start

Runs the app in the development mode.
Open http://localhost:8080 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### pnpm test

Launches the test runner in the interactive watch mode.
See the section about running tests for more information.

### pnpm run build

Builds a static copy of your site to the `build/` folder.

**THIS DOES NOT WORK** the `web_modules` folder is not populated with the modules from `install`

<!--
~~Your app is ready to be deployed!~~

**For the best production performance:** Add a build bundler plugin like [@snowpack/plugin-webpack](https://github.com/snowpackjs/snowpack/tree/main/plugins/plugin-webpack) or [snowpack-plugin-rollup-bundle](https://github.com/ParamagicDev/snowpack-plugin-rollup-bundle) to your `snowpack.config.json` config file.
-->