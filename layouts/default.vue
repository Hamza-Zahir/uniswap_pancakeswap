<template>
  <div class="app-default">
<Header/>
<Nuxt />
  </div>
</template>
<script>
import Header from '../components/Header.vue';

export default {
 components: {
    Header
}
}
</script>
<style>
.app-default {
  max-width: 1500px;
  margin: 0 auto;
  overflow: hidden;
}
</style>
