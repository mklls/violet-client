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
      <q-checkbox v-model="silentMode" :label="$t('settings.silentMode')" />
    </div>

    <div class="text-h6 q-mt-sm">{{ $t('settings.language') }}</div>
    <q-select dense style="width: 200px; margin-left: 8px; margin-top: 8px" v-model="locale" :options="locales"></q-select>
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
      silentMode: ''
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
      this.$store.commit('setNotification', nVal);
      this.$EStore.set('notification', nVal);
      this.debug('Notification %s', nVal);
    },

    silentMode (nVal, oVal) {
      if (oVal === '') return;
      this.$store.commit('setSilentMode', nVal);
      this.$EStore.set('silentMode', nVal);
      this.debug('silent mode %s', nVal);
    }

  },

  computed: {
    locales () {
      return this.$i18n.availableLocales.map(loc => {
        return {
          label: this.map.get(loc),
          value: loc
        };
      });
    },
    locale: {
      get () {
        return this.map.get(this.$i18n.locale);
      },
      set (locale) {
        this.$root.$i18n.locale = locale.value;

        if (locale.includes('en')) {
          this.$i18n.locale = 'en-US';
          this.$moment.locale('en');
        } else if (locale.includes('zh')) {
          this.$i18n.locale = 'zh-CN';
          this.$moment.locale('zh-cn');
        } else if (locale.includes('ja')) {
          this.$i18n.locale = 'ja';
          this.$moment.locale = 'ja';
        } else {
          this.$i18n.locale = 'en-US';
          this.$moment.locale('en');
        }

        this.$EStore.set('locale', locale.value);
      }
    }
  },

  created () {
    this.autoLaunch = this.$EStore.get('autoLaunch');
    this.autoLogin = this.$EStore.get('autoLogin');
    this.enableNotification = this.$store.getters.notification;
    this.silentMode = this.$store.getters.silentMode;
    this.debug = this.$debug.extend('preferences');

    this.map = new Map();
    this.map.set('zh-CN', '简体中文');
    this.map.set('en-US', 'English');
    this.map.set('ja', '日本語');
  }
};
</script>
