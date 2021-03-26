<template>
  <q-menu max-width="200px">
    <div class="q-py-sm column avatar-menu">
      <div class="row  q-px-md menu-header">
        <q-avatar
          v-close-popup
          color="primary"
          font-size="32px"
          text-color="white"
          size="56px"
          class="q-mr-sm q-mb-sm cursor-pointer no-select flex flex-center"
          @click="$emit('openProfileCard', me)"
        >
          <q-img v-if="avatar" :src="avatar" :alt="avatar || name"/>
          <div v-else class="center">{{ name.split('')[0] }} </div>
        </q-avatar>

        <div class="profile-name column  ellipsis-2-lines justify-center content-center ">
          <div id="name" class="text-subtitle1 bigger-input-font">{{ name }}</div>
          <div id="username" class="cursor-pointer">@{{ username }}</div>
        </div>

      </div>

      <q-list class="profile-header q-mt-sm no-select" dense>
        <q-item v-ripple clickable>
          <q-item-section style="flex: auto">
            <q-icon name="check_circle" :color="statusColor"/>
          </q-item-section>

          <q-item-section>{{$t(statusText)}}</q-item-section>

          <q-item-section class="q-pl-xl" side>
            <q-icon class="q-pl-xl" name="keyboard_arrow_right" />
          </q-item-section>

          <q-menu auto-close anchor="top end" self="top start">
            <q-list dense >
              <q-item clickable>
                <q-item-section style="flex: auto">
                  <q-icon name="check_circle" color="green"/>
                </q-item-section>

                <q-item-section no-wrap>{{$t('avatarMenu.status.online')}}</q-item-section>
              </q-item>

              <q-item clickable>
                <q-item-section style="flex: auto">
                  <q-icon name="do_not_disturb_on" color="red"/>
                </q-item-section>

                <q-item-section no-wrap>{{$t('avatarMenu.status.doNotDisturb')}}</q-item-section>
              </q-item>

              <q-item clickable>
                <q-item-section style="flex: auto">
                  <q-icon name="circle" color="grey"/>
                </q-item-section>

                <q-item-section no-wrap>{{$t('avatarMenu.status.appearOffline')}}</q-item-section>
              </q-item>

            </q-list>
          </q-menu>
        </q-item>

        <q-separator class="q-my-sm"/>

        <q-item clickable @click="$emit('openSettings', 'profile')" v-ripple v-close-popup>
          <q-item-section>{{ $t('avatarMenu.edit') }}</q-item-section>
        </q-item>

        <q-item clickable @click="$emit('openSettings', 'preferences')" v-ripple v-close-popup>
          <q-item-section>{{ $t('avatarMenu.preferences') }}</q-item-section>
        </q-item>

        <q-item clickable @click="$emit('openAbout')" v-ripple v-close-popup>
          <q-item-section>{{ $t('avatarMenu.about') }}</q-item-section>
        </q-item>

        <q-separator class="q-my-sm"/>

        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>{{ $t('common.slientMode') }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle size="xs" color="accent" v-model="slient" val="picture" />
          </q-item-section>
        </q-item>
        <q-separator class="q-my-sm"/>

        <q-item clickable v-ripple @click="logout">
          <q-item-section>{{ $t('avatarMenu.logout') }}</q-item-section>
          <q-item-section side style="flex: auto">
            <q-icon name="logout" size="24px" color="grey-7"/>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-menu>
</template>

<style lang="scss" scoped>
.avatar-menu {
  .menu-header {
    max-width: 100%;
  }
}
</style>

<script>
import { mapGetters } from 'vuex';

export default {
  data () {
    return {
      avatarLoaded: false,
      slient: '',
      status: 'Online',
      openAbout: false
    };
  },
  watch: {
    slient (nVal, oVal) {
      if (oVal === '') { return; }

      this.$EStore.set('slient', nVal);
    }
  },
  computed: {
    ...mapGetters({
      username: 'me/username',
      name: 'me/name',
      bio: 'me/bio',
      avatar: 'me/avatar',
      banner: 'me/banner'
    }),
    me () {
      return {
        username: this.username,
        name: this.name,
        bio: this.bio,
        avatar: this.avatar,
        banner: this.banner
      };
    },
    statusColor () {
      let color = 'green';
      switch (this.status) {
        case 'Online': color = 'green'; break;
        case 'Appear offline': color = 'grey'; break;
        case 'Do not disturb': color = 'red'; break;
      }

      return color;
    },
    statusText () {
      let text = 'online';
      switch (this.status) {
        case 'online': text = 'online'; break;
        case 'do not disturb': text = 'doNotDisturb'; break;
        case 'appear offline': text = 'appearOffline'; break;
      }

      return 'avatarMenu.status.' + text;
    },
    statusIcon () {
      let icon = 'check_circle';
      switch (this.status) {
        case 'Online': icon = 'check_circle'; break;
        case 'Do not disturb': icon = 'do_not_disturb_on'; break;
        case 'Appear offline': icon = 'circle'; break;
      }

      return icon;
    }
  },
  methods: {
    logout () {
      this.$store.commit('setManualLogout', true);
      this.$router.replace('/login');
      this.$store.dispatch('logout');
    }
  },
  created () {
    this.slient = this.$EStore.get('slient');
  }
};
</script>
