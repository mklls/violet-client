<template>
  <div id="contacts" class="row full-height relative-position">

    <div
      v-if="groups.length === 0"
      class="no-select empty"
    >
      <img src="images/well_done.svg"/>
    </div>

    <q-scroll-area v-else class="col contact-list">
        <q-list>
          <div v-for="(group, n) in groups" :key="group.label">
            <q-expansion-item
              header-class="text-capitalize"
              :label="group.label">

              <q-item
                v-for="friend in group.friends"
                :key="friend.username"
                :active="chatTo === friend.username"
                @click="chat(friend.username)"
                active-class="contact-active"
                class="contact-item no-select"
                style="padding: 8px 14px"
                clickable
                v-ripple
              >
                <context-menu
                  :profile="friend"
                  @openProfileCard="$emit('openProfileCard',friend)"
                  @editFriend="$emit('editFriend', friend)"
                  @deleted="$emit('deleted', friend.username)"
                />
                <q-item-section
                  style="padding-right: 14px"
                  avatar
                >
                  <q-avatar size="60px" font-size="30px" :color="$color(friend.name)" text-color="white">
                    <img class="avatar" v-if="friend.avatar" :src="friend.avatar"/>
                    <div v-else>{{ (friend.alias || friend.name).split('')[0] }}</div>
                  </q-avatar>
                </q-item-section>

                <q-item-section style="justify-content: space-around">
                  <q-item-label lines="1" class="bigger-input-font-x text-weight-medium">
                    {{ friend.alias || friend.name }}
                  </q-item-label>

                  <q-item-label
                    lines="1"
                    class="bigger-input-font-x text-grey-8 last-message"
                  >{{ latest(friend.username).content}}</q-item-label>
                </q-item-section>

                <q-item-section side style="justify-content:space-evenly" class="bigger-input-font">
                  <q-item-label v-if="latest(friend.username).time">{{ $time(latest(friend.username).time)}}</q-item-label>

                  <q-item-label>
                    <q-badge v-if=unreadCount(friend.username)
                             rounded
                             text-color="white">{{ unreadCount(friend.username)}}</q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-expansion-item>
            <q-separator v-if="n < groups.length - 1"/>
          </div>
       </q-list>
    </q-scroll-area>
  </div>
</template>

<style lang="scss" scoped>
#contacts {
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

  .contact-list {
    max-width: 540px;
    height: calc(100vh - 44px);

    .contact-item {
      & > div > div > div {
        font-size: 15px;
        padding: 4px 6px;
      }
    }

    .contact-active {
      color: white !important;
      background: dodgerblue;

      & > div > div {
        color: white !important;

        & > div {
          color: dodgerblue !important;
          background: white !important;
        }
      }
    }
  }
}
</style>

<script>

import ContextMenu from 'components/ContextMenu';
export default {
  name: 'contacts',
  components: { ContextMenu },
  props: ['to'],
  data () {
    return {
      open: false
    };
  },

  methods: {

    chat (username) {
      this.$emit('update:to', username);
      this.$emit('update:type', 'private');
    }
  },

  computed: {
    latest () {
      return function (username) {
        const messages = this.$store.getters['io/getMessagesFromUser'](username);

        // eslint-disable-next-line prefer-const
        if (messages.length === 0) {
          return { time: '', content: '', prefix: '' };
        }

        let time, content, prefix;
        const latest = messages[messages.length - 1];

        if (latest.contentType !== 'text') {
          prefix = latest.contentType + ', ';
          content = latest.attachment.name;
        } else {
          content = latest.content;
        }
        // eslint-disable-next-line prefer-const
        time = latest.time;

        return {
          time, content, prefix
        };
      };
    },

    unreadCount () {
      return function (username) {
        return this.$store.getters['io/getUnreadCountFromUser'](username);
      };
    },

    activeNotification () {
      return function (username) {
        const enable = this.$store.getters['rel/findFriendByUsername'](username).notification;
        return {
          'notification-disable': !enable,
          'notification-enable': enable
        };
      };
    },
    chatTo () {
      return this.to;
    },

    tags () {
      return this.$store.getters['rel/tags'];
    },

    // 这里的group是指根据用户tag划分的群组不是多人群组
    groups () {
      const friends = this.$store.getters['rel/friends'];

      const groups = this.tags.map(t => {
        return {
          label: t,
          friends: friends.filter(f => t === f.tag)
        };
      });

      for (let i = 0; i < groups.length; i++) {
        if (groups[i].label === '') {
          groups[i].label = this.$t('tabs.contacts');
          break;
        }
      }

      return groups;
    }
  },

  created () {
    this.debug = this.$debug.extend('conversation-list');
  }
};
</script>
