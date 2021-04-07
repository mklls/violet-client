<template>
 <q-menu ref="menu" context-menu>
   <q-list class="q-py-sm bigger-input-font-1" dense style="min-width: 100px">
     <q-item clickable v-close-popup @click="$emit('openProfileCard')">
       <q-item-section>{{ $t(view) }}</q-item-section>
     </q-item>

     <q-item clickable v-close-popup v-if="isUser" @click="edit">
       <q-item-section>{{ $t('contextMenu.edit') }}</q-item-section>
     </q-item>

     <q-item clickable v-close-popup @click="toggleNotificationSwitch">
       <q-item-section>{{ $t(switchNotification) }}</q-item-section>
     </q-item>

     <q-item clickable v-close-popup @click="handleAction">
       <q-item-section>{{ $t(action) }}</q-item-section>
     </q-item>

   </q-list>
 </q-menu>
</template>
<style>

</style>
<script>

export default {
  name: 'context-menu',
  props: {
    profile: Object
  },

  computed: {
    isUser () {
      return !!this.profile.username;
    },
    isGroup () {
      return !!this.profile.groupname;
    },
    isChannel () {
      return !!this.profile.channelname;
    },

    switchNotification () {
      let state;
      if (this.isChannel) {
        state = this
          .$store
          .getters['rel/findChannelByChannelname'](this.profile.channelname)
          .notification;
      } else if (this.isGroup) {
        state = this
          .$store
          .getters['rel/findGroupByGroupname'](this.profile.groupname)
          .notification;
      } else {
        state = this
          .$store
          .getters['rel/findFriendByUsername'](this.profile.username)
          .notification;
      }

      return state
        ? 'contextMenu.disableNotification'
        : 'contextMenu.enableNotification';
    },

    view () {
      let view = 'view';
      if (this.isUser) {
        view = 'contextMenu.viewProfile';
      }

      if (this.isChannel) {
        view = 'contextMenu.viewChannel';
      }

      if (this.isGroup) {
        view = 'contextMenu.viewGroup';
      }

      return view;
    },

    xname () {
      if (this.isChannel) {
        return this.profile.channelname;
      } else if (this.isGroup) {
        return this.profile.groupname;
      } else {
        return this.profile.username;
      }
    },

    action () {
      let action;
      if (this.isUser) {
        action = 'contextMenu.delete';
      }

      if (this.isChannel) {
        if (this.$store.getters['rel/isMyChannel'](this.profile.channelname)) {
          action = 'contextMenu.deleteChannel';
        } else {
          action = 'contextMenu.unsubscribe';
        }
      }

      if (this.isGroup) {
        if (this.$store.getters['rel/isMyGroup'](this.profile.groupname)) {
          action = 'contextMenu.deleteGroup';
        } else {
          action = 'contextMenu.leave';
        }
      }

      return action;
    }
  },

  methods: {
    clearUnread () {

    },

    toggleNotificationSwitch () {
      console.log(this.profile);

      if (this.isUser) {
        const state = !this
          .$store
          .getters['rel/findFriendByUsername'](this.profile.username)
          .notification;

        this.$store.dispatch('rel/updateFriend', {
          username: this.profile.username,
          notification: state
        });
      }

      if (this.isChannel) {
        const state = !this
          .$store
          .getters['rel/findChannelByChannelname'](this.profile.channelname)
          .notification;

        this.$store.dispatch('rel/setChannelNotification', {
          channelname: this.profile.channelname,
          notification: state
        });
      }

      if (this.isGroup) {
        const state = !this
          .$store
          .getters['rel/findGroupByGroupname'](this.profile.groupname)
          .notification;

        this.$store.dispatch('rel/setGroupNotification', {
          groupname: this.profile.groupname,
          notification: state
        });
      }
    },

    toggle () {
      this.$refs.menu.toggle();
    },

    handleAction () {
      if (this.isUser) {
        this.$store.dispatch('rel/deleteFriend', this.profile.username);
      }

      if (this.isChannel) {
        this.$store.dispatch('rel/unsubscribeChannel', this.profile.channelname);
      }

      if (this.isGroup) {
        this.$store.dispatch('rel/leaveGroup', this.profile.groupname);
      }

      this.$emit('deleted', this.xname);
    },

    edit () {
      this.$emit('editFriend');
    }
  }
};
</script>
