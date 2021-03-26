<template>
  <div class="row main">
    <q-tabs
      vertical
      switch-indicator
      class="relative-position text-grey-9 shadow-1 tabs bg-grey-1"
      active-color="accent"
      outside-arrows
      v-model="tab"
    >
      <q-route-tab to="chat"
                   name="chat"
                   no-caps
                   :label="$t('tabs.chat')"
                   icon="chat" >
        <q-badge color="grey" rounded floating>2999</q-badge>
      </q-route-tab>

      <q-route-tab to="contacts"
                   name="contacts"
                   no-caps
                   :label="$t('tabs.contacts')"
                   icon="person"/>

      <q-route-tab to="groups"
                   name="groups"
                   no-caps
                   :label="$t('tabs.groups')"
                   icon="group"/>

      <q-route-tab to="channels"
                   name="channels"
                   no-caps
                   :label="$t('tabs.channels')"
                   icon="campaign"/>

      <q-separator />

      <q-route-tab to="search"
                   name="search"
                   no-caps
                   :label="$t('tabs.search')"
                   icon="search"/>

    </q-tabs>
    <q-separator vertical/>

    <div style="padding-top: 0; width: calc(100vw - 81px)" class="fixed-height row">
      <div class="left-panel"><slot name="left-panel"/></div>
      <div class="right-panel"><slot name="right-panel"/></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main {
  width: 100vw;

  .left-panel {
    flex:2 1 100px;
    max-width: 540px;
    min-width: 250px;
    height: calc(100vh - 44px);
  }

  .right-panel {
    flex: 3 1 420px
  }

  margin-top: 42px !important;
  height: calc(100vh - 43px) !important;
  position: relative;

  .fixed-height {
    height: calc(100vh - 43px) !important;
  }

  .tabs { width: 80px; }
}
</style>

<script>
export default {
  data () {
    return {
      tab: 'chat',
      chatTo: ''
    };
  }
};
</script>
