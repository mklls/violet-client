<template>
  <div id="q-app">
  <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    this.$initAxiosResponseCheck(this.$t('common'));
    const locale = this.$EStore.get('locale');

    if (locale) {
      this.$i18n.locale = locale;
      this.$moment.locale(locale);
    } else {
      this.$q.electron.ipcRenderer.on('locale', (e, locale) => {
        locale = locale.toString();
        if (locale) {
          this.$i18n.locale = 'en-us';
          return;
        }

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
      });

      this.$q.electron.ipcRenderer.send('get locale');
    }
  }
};
</script>
