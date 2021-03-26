<template>
  <div class="column">
    <div class="text-h6">{{ $t('settings.behavior') }}</div>

    <div class="q-gutter-sm">
      <q-checkbox v-model="autoLaunch" :label="$t('settings.autoLaunch')" />
    </div>

    <div class="q-gutter-sm">
      <q-checkbox v-model="autoLogin" :label="$t('settings.autoLogin')" />
    </div>

    <div class="text-h6 q-mt-sm">{{ $t('settings.notification') }}</div>

    <div class="q-gutter-sm">
      <q-checkbox v-model="enableNotification" :label="$t('settings.enableNotification')" />
    </div>

    <div class="q-gutter-sm">
      <q-checkbox v-model="slientMode" :label="$t('settings.slientMode')" />
    </div>
  </div>
</template>

<style>

</style>

<script>
export default {
  name: 'preferences',
  data () {
    return {
      autoLaunch: '',
      autoLogin: '',
      enableNotification: '',
      slientMode: ''
    };
  },
  watch: {
    autoLaunch (nVal, oVal) {
      if (oVal === '') return;
      this.$EStore.set('autoLaunch', nVal);
      this.$q.electron.ipcRenderer.send('auto', nVal);
      this.debug('Auto launch %s', nVal);
    },

    autoLogin (nVal, oVal) {
      if (oVal === '') return;
      this.$EStore.set('autoLogin', nVal);
      this.debug('Auto login %s', nVal);
    },

    enableNotification (nVal, oVal) {
      if (oVal === '') return;
      this.$EStore.set('notification', nVal);
      this.debug('Notification %s', nVal);
    },

    slientMode (nVal, oVal) {
      if (oVal === '') return;
      this.$EStore.set('slient', nVal);
      this.debug('Slient mode %s', nVal);
    }
  },
  created () {
    this.autoLaunch = this.$EStore.get('autoLaunch');
    this.autoLogin = this.$EStore.get('autoLogin');
    this.enableNotification = this.$EStore.get('notification');
    this.slientMode = this.$EStore.get('slient');
    this.debug = this.$debug.extend('preferences');
  }
};
</script>
