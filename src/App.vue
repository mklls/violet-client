<template>
  <div id="q-app">
  <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    console.log('vue start');
    this.$initAxiosResponseCheck(this.$t('common'));
  }
};
</script>
