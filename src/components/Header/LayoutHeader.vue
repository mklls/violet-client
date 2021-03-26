<template>
  <q-header class="main-header bg-deep-purple text-white" v-if="$q.platform.is.electron">
    <q-bar class="q-electron-drag full-height" style="padding: 0" >
      <q-btn
        flat
        class="full-height force-square"
        size="md"
        icon="keyboard_arrow_left"
        @click="back"
        v-if="logged"
      />

      <q-btn
        flat
        class="full-height force-square"
        size="md"
        icon="keyboard_arrow_right"
        @click="forward"
        v-if="logged"
      />

      <q-space />

      <q-btn
        flat
        round
        padding="xs"
        no-caps
        class="q-mr-md inline-block"
        v-if="logged"
      >
        <q-avatar color="primary" size="30px" font-size="18px" class="relative-position" style="line-height: 1em">
          <q-img v-if="avatar" :src="avatar" :alt="avatar || name"/>
          <div v-else class="center">{{ name.split('')[0] }} </div>
        </q-avatar>

        <q-icon class="absolute-bottom-right" color="green" name="check_circle" size="12px"/>

        <avatar-menu
          @openSettings="args => $emit('openSettings', args)"
          @openProfileCard="args => $emit('openProfileCard', args)"
          @openAbout="openAbout = true"
        />
      </q-btn>

      <q-btn
        flat
        size="md"
        icon="minimize"
        class="full-height force-square"
        @click="$q.electron.ipcRenderer.send('minimize')"
      />

      <q-btn
        flat
        size="md"
        class="full-height force-square"
        :icon="icon"
        @click="resize"/>

      <q-btn
        flat
        size="md"
        class="full-height
        force-square"
        icon="close"
        @click="$q.electron.ipcRenderer.send('quit')"
      />

    </q-bar>
    <about :open.sync="openAbout"/>
  </q-header>

</template>
<style lang="scss" scoped>
.main-header {
  height: 42px;

  .force-square {
    border-radius: 0;
    &:nth-last-of-type(1) {
      transition: 0.3s background-color linear;
      &:hover { background: #C10015; }
    }
  }
}
</style>

<script>
import AvatarMenu from 'components/Header/AvatarMenu';
import About from 'components/About';

export default {
  name: 'layout-header',
  components: { About, AvatarMenu },
  props: ['logged'],
  data () {
    return {
      icon: 'open_in_full',
      openAbout: false
    };
  },
  created () {
    // 注意 this 指向
    this.$q.electron.ipcRenderer.on('window resize', (e, arg) => {
      this.icon = arg.toString() === 'max' ? 'close_fullscreen' : 'open_in_full';
    });
  },
  methods: {
    resize () {
      if (this.icon !== 'open_in_full') {
        this.$q.electron.ipcRenderer.send('unmaximize');
      } else {
        this.$q.electron.ipcRenderer.send('maximize');
      }
    },
    back () {
      console.log(window.history.length);
      window.history.back();
    },
    forward () {
      console.log(window.history.length);
      window.history.forward();
    },
    handler (args) {
      this.$emit('open-settings', args);
    }
  },
  computed: {
    avatar () {
      return this.$store.getters['me/avatar'];
    },
    name () {
      return this.$store.getters['me/name'];
    }
  }
};
</script>
