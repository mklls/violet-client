<template>
  <div class="row full-height relative-position">

    <div
      v-if="chats.length === 0"
      class="no-select empty"
    >
      <img src="images/group_chat.svg"/>
    </div>

    <q-scroll-area v-else class="col chat-list" >
      <q-list>
        <q-item
          exact-active-class="chat-active"
          :active="chatTo === xname(chat)"
          v-for="chat in chats"
          :key="xname(chat)"
          @click="realChat(chat)"
          active-class="chat-active"
          class="chat-item no-select"
          style="padding: 8px 14px"
          clickable v-ripple
        >
          <context-menu
            :profile="chat"
            @openProfileCard="$emit('openProfileCard', chat)"
            @editFriend="$emit('editFriend', chat)"
            @deleted="$emit('deleted', xname(chat))"
          />
          <q-item-section
            style="padding-right: 14px"
            avatar
          >
            <q-avatar size="60px" :color="$color(chat.name)" text-color="white">
              <img class="avatar" v-if="chat.avatar" :src="chat.avatar"/>
              <div v-else>{{ chat.name.split('')[0] }}</div>
            </q-avatar>
          </q-item-section>

          <q-item-section style="justify-content: space-around">
            <q-item-label lines="1"
              class="bigger-input-font-x text-weight-medium">
              {{ chat.alias || chat.name }}
            </q-item-label>

            <q-item-label
              lines="1"
              class="bigger-input-font-x text-grey-8 latest-message"
            ><span class="overview-prefix" v-if="latest(chat).prefix">{{ latest(chat).prefix}}</span>{{ latest(chat).content}}</q-item-label>
          </q-item-section>

          <q-item-section
            v-if="latest(chat).time"
            side
            style="justify-content:space-around">

            <q-item-label style="font-size: 18px">{{ $time(latest(chat).time)}}</q-item-label>

            <q-item-label>
              <q-badge
                v-if="unreadCount(chat)"
                rounded
                :multi-line="false"
                :class=activeNotification(chat)
                text-color="white"
              >
                {{ unreadCount(chat) }}
              </q-badge>
            </q-item-label>

          </q-item-section>

          <q-separator />
        </q-item>
      </q-list>
    </q-scroll-area>

    <q-fab
      class="chat-fab"
      color="primary"
      icon="add"
      padding="11px"
      direction="up"
    >
      <q-fab-action
        :color="$color('alert')"
        @click="subChannel"
        icon="add_alert"
      />

      <q-fab-action
        :color="$color('groupxa')"
        @click="joinGroup"
        icon="group_add"
      />

      <q-fab-action
        :color="$color('person')"
        @click="addFriend"
        icon="person_add"
      />
      <q-fab-action
        :color="$color('plus')"
        @click="$emit('newGroupOrChannel')"
        icon="plus_one"
      />
    </q-fab>
  </div>
</template>

<style lang="scss" scoped>

.chat-fab {
  position: absolute;
  bottom: 12px;
  right: 12px;
}

.empty {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  width: 100%;

  img {
    display: inline-block;
    position: absolute;
    top: 5%;
    object-position: center;
    object-fit: cover;
    width: 80%;
  }
}

.chat-list {
  max-width: 540px;
  height: calc(100vh - 44px);

  .latest-message {
    white-space: pre;
    font-family: Roboto, Arial, sans-serif, CTwemoji, "Noto Color Emoji", "Segoe UI Emoji" !important;
    margin: 0;
  }

  .chat-item {
    & > div > div > div {
      font-size: 15px;
      padding: 4px 6px;
    }
  }

  .chat-active {
    color: white !important;
    background: dodgerblue;

    & > div > div {
      color: white !important;

      & > div {
        color: dodgerblue !important;
        background: white !important;
      }

      & > .prefix {
        color: white !important;
      }
    }
  }
}
</style>

<script>

import ContextMenu from 'components/ContextMenu';
export default {
  name: 'chats',
  components: { ContextMenu },
  props: ['to'],
  data () {
    return {
    };
  },

  methods: {
    xname (who) {
      return who.username || who.groupname || who.channelname;
    },

    addFriend () {
      this.$emit('update:cate', 'users');
      this.$router.push('/home/search');
    },

    joinGroup () {
      this.$emit('update:cate', 'groups');
      this.$router.push('/home/search');
    },

    subChannel () {
      this.$emit('update:cate', 'channels');
      this.$router.push('/home/search');
    },

    realChat (profile) {
      let type, xname;
      if (profile.groupname) {
        type = 'group';
        xname = profile.groupname;
      } else if (profile.channelname) {
        type = 'channel';
        xname = profile.channelname;
      } else if (profile.username) {
        type = 'private';
        xname = profile.username;
      }

      this.$emit('update:to', xname);
      this.$emit('update:type', type);
    }
  },

  computed: {
    chatTo () {
      return this.to;
    },

    unreadCount () {
      return function (chat) {
        if (chat.username) {
          return this.$store.getters['io/getUnreadCountFromUser'](chat.username);
        } else {
          return this.$store.getters['io/getUnreadCountFromGroupOrChannel'](chat.groupname || chat.channelname);
        }
      };
    },

    latest () {
      return function (chat) {
        let prefix = '';
        let type = '';

        if (chat.username) type = 'io/getMessagesFromUser';
        else type = 'io/getMessagesFromGroupOrChannel';

        const messages = this.$store.getters[type](this.xname(chat));
        if (messages.length === 0) {
          return { prefix: '', content: '', time: '' };
        }
        const latest = messages[messages.length - 1];
        let content;
        if (latest.contentType === 'text') {
          content = latest.content;
        } else {
          content = latest.attachment.name;
        }

        if (latest.contentType !== 'text') {
          prefix = this.$t('common.' + latest.contentType) + ', ';
        }

        if (latest.messageType === 'group') {
          const member = this.$store.getters['rel/findGroupMemberByUsername'](latest.to, latest.from);

          if (member.username === this.$store.getters['me/username']) {
            prefix = this.$t('common.you') + ': ' + prefix;
          } else {
            prefix = member.name + ': ' + prefix;
          }
        }

        return { prefix, content, time: latest.time };
      };
    },

    activeNotification () {
      return function (chat) {
        let enabled;
        if (chat.username) {
          enabled = this.$store.getters['rel/findFriendByUsername'](chat.username).notification;
        } else if (chat.groupname) {
          enabled = this.$store.getters['rel/findGroupByGroupname'](chat.groupname).notification;
        } else {
          enabled = this.$store.getters['rel/findChannelByChannelname'](chat.channelname).notification;
        }

        return {
          'notification-enable': enabled,
          'notification-disable': !enabled
        };
      };
    },

    chats () {
      const personal = this.$store.getters['rel/friends'];
      const groups = this.$store.getters['rel/groups'];
      const channels = this.$store.getters['rel/channels'];

      return [...personal, ...groups, ...channels];
    }
  },

  created () {
    this.debug = this.$debug.extend('conversation-list');
  }
};
</script>
