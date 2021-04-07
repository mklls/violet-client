<template>
  <q-menu max-width="280px">
    <div class="q-py-sm column avatar-menu">
      <div class="row  q-px-md menu-header">
        <q-avatar
          v-close-popup
          :color="$color(name)"
          font-size="32px"
          text-color="white"
          size="56px"
          class="q-mr-sm q-mb-sm cursor-pointer no-select flex flex-center"
          @click="$emit('openProfileCard', me)"
        >
          <q-img width="100%" height="100%" v-if="avatar" :src="avatar" :alt="avatar || name"/>
          <div v-else class="center">{{ name.split('')[0] }} </div>
        </q-avatar>

        <div class="profile-name column  ellipsis-2-lines justify-center content-center ">
          <div id="name" class="text-subtitle1 bigger-input-font">{{ name }}</div>
          <div id="username" class="caption">@{{ username }}</div>
        </div>

      </div>

      <q-list class="profile-header q-mt-sm no-select" dense>
        <q-item v-ripple clickable>
          <q-item-section style="flex: auto">
            <q-icon :name="statusIcon" :color="statusColor"/>
          </q-item-section>

          <q-item-section>{{$t(statusText)}}</q-item-section>

          <q-item-section class="q-pl-xl" side>
            <q-icon class="q-pl-xl" name="keyboard_arrow_right" />
          </q-item-section>

          <q-menu auto-close anchor="top end" self="top start">
            <q-list dense >
              <q-item
                @click="$store.dispatch('io/updateStatus', $status.IO_USER_ONLINE)"
                clickable>
                <q-item-section style="flex: auto">
                  <q-icon name="check_circle" color="green"/>
                </q-item-section>

                <q-item-section no-wrap>{{$t('avatarMenu.status.online')}}</q-item-section>
              </q-item>

              <q-item
                @click="$store.dispatch('io/updateStatus', $status.IO_USER_BUSY)"
                clickable>
                <q-item-section style="flex: auto">
                  <q-icon name="do_not_disturb_on" color="red"/>
                </q-item-section>

                <q-item-section no-wrap>{{$t('avatarMenu.status.doNotDisturb')}}</q-item-section>
              </q-item>

              <q-item
                @click="$store.dispatch('io/updateStatus', $status.IO_USER_OFFLINE)"
                clickable>
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
      openAbout: false
    };
  },
  watch: {
    slient (nVal, oVal) {
      if (oVal === '') { return; }

      this.$store.commit('setSlientMode', nVal);
      this.$EStore.set('slientMode', nVal);
    },
    statusIcon (nVal) {
      console.log('new icon', nVal);
      this.$emit('icon', nVal);
    },
    statusColor (nVal) {
      this.$emit('color', nVal);
    }
  },
  computed: {
    ...mapGetters({
      username: 'me/username',
      name: 'me/name',
      bio: 'me/bio',
      avatar: 'me/avatar',
      banner: 'me/banner',
      status: 'me/status'
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
        case this.$status.IO_USER_ONLINE: color = 'green'; break;
        case this.$status.IO_USER_BUSY: color = 'red'; break;
        case this.$status.IO_USER_OFFLINE: color = 'grey'; break;
      }

      return color;
    },
    statusText () {
      let text = 'online';
      switch (this.status) {
        case this.$status.IO_USER_ONLINE: text = 'online'; break;
        case this.$status.IO_USER_BUSY: text = 'doNotDisturb'; break;
        case this.$status.IO_USER_OFFLINE: text = 'appearOffline'; break;
      }

      return 'avatarMenu.status.' + text;
    },
    statusIcon () {
      let icon = 'check_circle';
      switch (this.status) {
        case this.$status.IO_USER_ONLINE: icon = 'check_circle'; break;
        case this.$status.IO_USER_BUSY: icon = 'do_not_disturb_on'; break;
        case this.$status.IO_USER_OFFLINE: icon = 'circle'; break;
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
