<template>
  <div class="column">
    <div class="text-h6 q-mb-sm">{{ $t('settings.networkProxy') }}</div>
    <div class="column bigger-input-font-1">
      <q-radio v-model="proxy" val="disable" :label="$t('settings.networkProxyDisable')"/>
      <q-radio v-model="proxy" val="system" :label="$t('settings.networkProxySystemSettings')"/>
      <q-radio v-model="proxy" val="custom" :label="$t('settings.networkProxyCustom')"/>
    </div>
    <div class="q-gutter-md bigger-input-font column items-start">
      <div class="row q-gutter-md">
        <q-select
          class="protocol bottom"
          v-model="protocol"
          :disable="proxy !== 'custom'"
          :options="protocolOptions"
          style="width: 90px"
        />

        <q-input
          class="bigger-input-font-2"
          placeholder="Hostname"
          type="text"
          maxlength="15"
          :disable="proxy !== 'custom'"
          style="width: 180px"
          v-model="host"
        />

        <q-input
          class="bigger-input-font-2"
          style="width: 110px"
          maxlength="5"
          type="text"
          :hide-bottom-space=true
          :bottom-slots=false
          :disable="proxy !== 'custom'"
          placeholder="Port"
          v-model="port"
        />
      </div>
    </div>

    <div class="absolute-bottom-right row q-gutter-md">
      <q-btn color="primary" no-caps :label="$t('settings.apply')" @click="setProxy"/>
      <q-btn color="primary" no-caps :label="$t('settings.OK')" v-close-popup/>
    </div>
  </div>
</template>

<style lang="scss">
</style>

<script>
export default {
  name: 'network',
  data () {
    return {
      group: ['proxy'],
      proxy: this.$EStore.get('enableProxy'),
      host: this.$EStore.get('proxy.host'),
      port: this.$EStore.get('proxy.port'),
      protocol: this.$EStore.get('proxy.protocol') || 'http',
      protocolOptions: ['http', 'socks4', 'socks5']
    };
  },
  watch: {
    port (nVal, oVal) {
      // 防止手动修改port后再次调用watch port而陷入无限循环
      if (nVal === oVal) { return; }
      const n = parseInt(nVal, 10);

      if (!isNaN(n)) {
        if (n > 65535) {
          this.port = '65535';
        } else if (n < 0) {
          this.port = '0';
        }
        return;
      }

      // 端口号仅有数字组成
      if (!/^\d*$/.test(nVal)) {
        this.port = oVal;
      }
    }
  },
  methods: {
    setProxy () {
      let args;
      let protocol;

      if (this.proxy === 'custom') {
        switch (this.protocol) {
          case 'socks4':
            protocol = 'socks4://';
            this.debug('socks4 proxy server:', this.host);
            break;
          case 'socks5':
            protocol = 'socks://';
            this.$EStore.set('proxy.protocol', 'socks5');
            this.debug('socks5 proxy server:', this.host);
            break;
          case 'http':
          default:
            protocol = '';
            this.debug('http proxy server:', this.host);
            break;
        }

        this.$EStore.set('proxy', { host: this.host, port: this.port, protocol });
        this.debug('proxy server %s:%s', this.host, this.port);
        args = { mode: 'custom', proxyServer: this.host + this.port };
      } else if (this.proxy === 'system') {
        args = { mode: 'system' };
      } else {
        args = { mode: 'direct' };
      }

      this.$EStore.set('enableProxy', this.proxy);
      console.log(this.$EStore.get());

      this.debug(args);
      this.$q.electron.ipcRenderer.send('set proxy', args);
    }
  },
  created () {
    this.debug = this.$debug.extend('network');
  }
};
</script>
