<template>
  <q-layout class="vio-min" view="hHh LpR fFf" >
    <router-view/>
  </q-layout>
</template>

<style lang="scss" scoped>
.vio-min {
  min-width: 585px;
}
</style>
<script>
export default {
  data () {
    return {
      icon: 'open_in_full',
      status: 'Appear offline'
    };
  }

};
</script>
