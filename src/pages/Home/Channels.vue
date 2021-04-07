<template>
  <div class="row full-height relative-position">

    <div
      v-if="channels.length === 0"
      class="no-select empty"
    >
      <img src="images/post.svg"/>
    </div>

    <q-scroll-area v-else class="col channel-list">
      <q-list>
        <q-item
          exact-active-class="channel-active"
          :active="chatTo === channel.channelname"
          v-for="channel in channels"
          :key="channel.channel"
          @click="chat(channel.channelname)"
          active-class="channel-active"
          class="channel-item no-select"
          style="padding: 8px 14px"
          clickable v-ripple
        >
          <context-menu
            :profile="channel"
            @openProfileCard="$emit('openProfileCard', channel)"
            @deleted="$emit('deleted', channel.channelname)"
          />
          <q-item-section
            style="padding-right: 14px"
            avatar
          >
            <q-avatar size="60px" :color="$color(channel.name)" text-color="white">
              <img class="avatar" v-if="channel.avatar" :src="channel.avatar"/>
              <div v-else>{{ channel.name.split('')[0] }}</div>
            </q-avatar>
          </q-item-section>

          <q-item-section style="justify-content: space-around">
            <q-item-label lines="1" class="bigger-input-font-x text-weight-medium">
              {{ channel.name }}
            </q-item-label>

            <q-item-label
              lines="1"
              class="bigger-input-font-x text-grey-8 last-message"
            ><span v-if="latest(channel.channelname).prefix" class="overview-prefix">{{latest(channel.channelname).prefix}}</span>{{ latest(channel.channelname).content}}</q-item-label>
          </q-item-section>

          <q-item-section class="bigger-input-font" side style="justify-content:space-around">
            <q-item-label v-if="latest(channel.channelname).time">{{ $time(latest(channel.channelname).time)}}</q-item-label>

            <q-item-label >
              <q-badge
                v-if="unreadCount(channel.channelname)"
                rounded
                :class=activeNotification(channel.channelname)
                text-color="white"
              >
                {{ unreadCount(channel.channelname) }}
              </q-badge>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>

  </div>
</template>

<style lang="scss" scoped>
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

.channel-list {
  max-width: 540px;
  height: calc(100vh - 44px);

  .last-message {
    white-space: pre;
    font-family: Roboto, Arial, sans-serif, CTwemoji, "Noto Color Emoji", "Segoe UI Emoji" !important;
    margin: 0;
  }

  .channel-item {
    & > div > div > div {
      font-size: 15px;
      padding: 4px 6px;
    }
  }

  .channel-active {
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
  name: 'channels',
  components: { ContextMenu },

  props: {
    to: String
  },

  data () {
    return {
      open: false
    };
  },

  methods: {
    chat (channelname) {
      this.$emit('update:to', channelname);
      this.$emit('update:type', 'channel');
    }
  },

  computed: {
    chatTo () {
      return this.to;
    },

    activeNotification () {
      return function (channelname) {
        const enable = this.$store.getters['rel/findChannelByChannelname'](channelname).notification;
        return {
          'notification-disable': !enable,
          'notification-enable': enable
        };
      };
    },

    channels () {
      return this.$store.getters['rel/channels'];
    },

    latest () {
      return function (channelname) {
        const messages = this.$store.getters['io/getMessagesFromGroupOrChannel'](channelname);

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
      return function (channelname) {
        return this.$store.getters['io/getUnreadCountFromGroupOrChannel'](channelname);
      };
    }
  },

  created () {
    this.debug = this.$debug.extend('channel-list');
  }
};
</script>
