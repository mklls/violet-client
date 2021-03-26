<template>
  <q-dialog transition-show="jump-up" transition-hide="jump-up"  v-model="$_open" class="settings-dialog">
    <q-card
      class="settings-panel"
      style="width: 700px; max-width: 80vw; height: 720px; max-height: 80vh"
    >
      <div class="row q-pa-md">
        <nav class="col-auto">
          <q-tabs
            vertical
            align="left"
            class="text-grey"
            content-class="force-left"
            active-color="primary"
            indicator-color="primary"
            v-model="$_tab"
            dense
            no-caps
          >
            <q-tab name="profile" :label="$t('settings.tabs.profile')" />
            <q-tab name="security" :label="$t('settings.tabs.security')" />
            <q-tab name="network" :label="$t('settings.tabs.network')" />
            <q-tab name="preferences" :label="$t('settings.tabs.preferences')" />
          </q-tabs>
        </nav>

        <q-separator class="q-mr-md" vertical/>
        <q-tab-panels
          animated
          transition-prev="slide-down"
          transition-next="slide-up"
          class="settings-op flex col"
          :value="$_tab"
        >
          <q-tab-panel name="profile"><profile/></q-tab-panel>
          <q-tab-panel name="security"><security @logout="$emit('logout')" /></q-tab-panel>
          <q-tab-panel name="network"><network/></q-tab-panel>
          <q-tab-panel name="preferences"><preferences/></q-tab-panel>
        </q-tab-panels>
      </div>
    </q-card>
  </q-dialog>
</template>

<style lang="scss">
.settings-dialog {
  background: rgba(0,0,0,0.05);
}
.settings-panel {
  & > .row { height: 100%; }

  .force-left > .q-tab { justify-content: left; }

  .settings-op .q-tab-panel {
    padding: 0;
  }
}

</style>

<script>
import Profile from 'components/Settings/Profile';
import Security from 'components/Settings/Security';
import Network from 'components/Settings/Network';
import Preferences from 'components/Settings/Preferences';

export default {
  name: 'settings',
  components: { Preferences, Network, Security, Profile },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    tab: {
      type: String,
      default: 'home'
    }
  },
  data () {
    return {
      test: true
    };
  },
  created () {},
  computed: {
    $_open: {
      get () {
        return this.open;
      },
      set (val) {
        this.$emit('update:open', val);
      }
    },
    $_tab: {
      get () {
        return this.tab;
      },
      set (val) {
        this.$emit('update:tab', val);
      }
    }
  }
};
</script>
