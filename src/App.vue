<template>
  <div id="app" class="app-wrapper">
    <SimpleAmisApp />
  </div>
</template>

<script>
import SimpleAmisApp from './components/SimpleAmisApp.vue';

export default {
  name: 'App',
  components: {
    SimpleAmisApp
  }
};
</script>

<style>
html,
body,
.app-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
