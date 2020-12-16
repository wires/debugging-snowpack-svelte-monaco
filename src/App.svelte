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