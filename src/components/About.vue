<template>
  <q-dialog v-model="$_open" transition-show="jump-up" transition-hide="jump-up">
    <q-card class="no-select q-pa-md column">
      <div class="column flex-center q-mb-md">
        <q-img width="64px" height="64px" src="favicon-128x128.png"/>
        <div class="text-weight-bold bigger-input-font q-mt-sm">Violet</div>
      </div>
      <div>Version: {{ $versions.violet }}</div>
      <div>Quasar: {{ $q.version }}</div>
      <div>Vue: {{ $versions.vue }}</div>
      <div>Electron: {{ $versions.electron }}</div>
      <div>Node: {{ $versions.node }}</div>
      <div>Chrome: {{ $versions.chrome }}</div>
      <div>V8: {{ $versions.v8 }}</div>
      <div>OS: {{ $versions.os }}</div>
    </q-card>
  </q-dialog>
</template>

<style></style>

<script>

export default {
  name: 'about',
  props: ['open'],
  computed: {
    $_open: {
      get () {
        return this.open;
      },
      set (val) {
        this.$emit('update:open', val);
      }
    }
  }
};
</script>
