<template>
  <div class="row full-height relative-position">

    <div
      v-if="groups.length === 0"
      class="no-select group-empty"
    >
      <img src="images/good_team.svg"/>
    </div>

    <q-scroll-area v-else class="col group-list">
      <q-list>
        <q-item
          v-for="group in groups"
          :key="group.groupname"
          :active="chatTo === group.groupname"
          @click="chat(group.groupname)"
          active-class="group-active"
          class="group-item no-select"
          style="padding: 8px 14px"
          clickable v-ripple
        >
          <context-menu
            :profile="group"
            @openProfileCard="$emit('openProfileCard', group)"
            @deleted="$emit('deleted', group.groupname)"
          />
          <q-item-section
            style="padding-right: 14px"
            avatar
          >
            <q-avatar size="60px" :color="$color(group.name)" text-color="white">
              <img class="avatar" v-if="group.avatar" :src="group.avatar"/>
              <div v-else>{{ group.name.split('')[0] }}</div>
            </q-avatar>
          </q-item-section>

          <q-item-section style="justify-content: space-around">
            <q-item-label lines="1" class="bigger-input-font-x text-weight-medium">
              {{ group.name }}
            </q-item-label>

            <q-item-label
              lines="1"
              class="bigger-input-font-x last-message"
            ><span class="overview-prefix" v-if="latest(group.groupname).prefix">{{ latest(group.groupname).prefix }}</span>{{ latest(group.groupname).content }}</q-item-label>
          </q-item-section>

          <q-item-section side style="justify-content:space-around">
            <q-item-label v-if=latest(group.groupname).time>{{ $time(latest(group.groupname).time)}}</q-item-label>

            <q-item-label>
              <q-badge rounded text-color="white" :class=activeNotification(group.groupname) v-if="unreadCount(group.groupname)">{{ unreadCount(group.groupname) }}</q-badge>
            </q-item-label>
          </q-item-section>
          <q-separator />
        </q-item>
      </q-list>
    </q-scroll-area>
  </div>
</template>

<style lang="scss" scoped>
.group-empty {
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

.group-list {
  max-width: 540px;
  height: calc(100vh - 44px);

  .group-item {
    & > div > div > div {
      font-size: 15px;
      padding: 4px 6px;
    }
  }

  .group-active {
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
</style>

<script>

import ContextMenu from 'components/ContextMenu';
export default {
  name: 'groups',
  components: { ContextMenu },
  props: ['to'],
  data () {
    return {
      open: false
    };
  },

  methods: {
    chat (groupname) {
      this.$emit('update:to', groupname);
      this.$emit('update:type', 'group');
    }
  },

  computed: {
    chatTo () {
      return this.to;
    },

    latest () {
      return function (groupname) {
        const messages = this.$store.getters['io/getMessagesFromGroupOrChannel'](groupname);

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
      return function (groupname) {
        return this.$store.getters['io/getUnreadCountFromGroupOrChannel'](groupname);
      };
    },

    activeNotification () {
      return function (channelname) {
        const enable = this.$store.getters['rel/findGroupByGroupname'](channelname).notification;
        return {
          'notification-disable': !enable,
          'notification-enable': enable
        };
      };
    },

    groups () {
      return this.$store.getters['rel/groups'];
    }
  },

  created () {
    this.debug = this.$debug.extend('group-list');
  }
};
</script>
