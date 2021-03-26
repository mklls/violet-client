<template>
  <div class="row">

    <q-scroll-area class="col chat-list">
      <q-list>
        <q-item
          exact-active-class="chat-active"
          :active="chatTo === xname(chat)"
          :key="xname(chat)"
          @click="$emit('update:to', xname(chat))"
          active-class="chat-active"
          class="chat-item no-select"
          style="padding: 8px 10px"
          v-for="chat in chats"
          clickable v-ripple
        >
          <q-item-section
            style="padding-right: 14px"
            avatar
          >
            <q-avatar size="60px" color="primary" text-color="white">
              <img class="avatar" v-if="chat.avatar" :src="chat.avatar"/>
              <div v-else>{{ chat.name.split('')[0] }}</div>
            </q-avatar>
          </q-item-section>

          <q-item-section style="justify-content: space-around">
            <q-item-label lines="1"
              class="bigger-input-font-x text-weight-medium">
              {{ chat.name }}
            </q-item-label>

            <q-item-label lines="1" class="bigger-input-font-x text-grey-8 last-message">{{ chat.lastMsg + "   dsjflkkadlsfjlksadjfasjdf"}}</q-item-label>
          </q-item-section>

          <q-item-section side
            style="justify-content:space-evenly">

            <q-item-label>{{ time(chat.time)}}</q-item-label>

            <q-item-label>
              <q-badge color="grey-13" rounded text-color="white">999</q-badge>
            </q-item-label>

          </q-item-section>

          <q-separator />
        </q-item>
      </q-list>
    </q-scroll-area>
    <q-separator vertical/>
  </div>
</template>

<style lang="scss" scoped>
.chat-list {
  max-width: 540px;
  height: calc(100vh - 44px);

  .last-message {
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
      }
    }
  }
}
</style>

<script>

export default {
  name: 'chats',
  props: ['to'],
  data () {
    return {
      chats: [
        {
          username: 'shinobu',
          avatar: 'https://wallpapercave.com/wp/wp6850699.jpg',
          banner: 'https://wallpapercave.com/wp/wp6850483.jpg',
          lastMsg: 'pretty    good',
          name: 'fuckyeah',
          time: Date.now(),
          alias: 'wakaarujisama',
          bio: 'fucyou'
        }, {
          username: 'araragi',
          name: 's',
          banner: 'https://images.pexels.com/photos/7196337/pexels-photo-7196337.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
          avatar: 'https://images.pexels.com/photos/2611817/pexels-photo-2611817.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
          time: '2020-3-22',
          lastMsg: 'Kjk jfkw nvm你nsdsddsdf㩐 赛        Wellff creepy crunchy fucking hard',
          bio: 'wokaka'
        }, {
          name: 'fuck',
          username: 'nichishiqub asdffaj',
          banner: '',
          bio: 'wokaka',
          time: '2021-2-12',
          avatar: '',
          lastMsg: ''
        }
      ]
    };
  },

  methods: {

    time (t) {
      const today = this.$moment(Date.now());
      const date = this.$moment(t);
      let format;

      if (date.isAfter(today.startOf('day'))) {
        format = 'HH:mm';
      } else if (date.isAfter(today.startOf('week'))) {
        format = 'ddd';
      } else if (date.isAfter(today.startOf('year'))) {
        format = 'MM-DD';
      } else {
        format = 'YYYY-MM-DD';
      }

      return date.format(format);
    },

    xname (who) {
      return who.username
        ? who.username
        : who.groupname
          ? who.groupname
          : who.channelname;
    }
  },

  computed: {
    chatTo () {
      return this.to;
    }
  },

  created () {
    this.debug = this.$debug.extend('conversation-list');
  }
};
</script>
