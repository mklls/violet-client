<template>
  <q-page class="flex remove-scrollbar flex-center">
    <div> {{ Math.random().toString(32) }} </div>
    <div>{{$route.fullPath}}</div>
  </q-page>
</template>

<style scoped>
</style>

<script>
export default {
  name: 'channels'
};
</script>
