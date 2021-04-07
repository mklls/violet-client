<template>
  <q-dialog transition-show="jump-right" transition-hide="jump-right" v-model="$_open">
    <q-card class="column relative-position profile-card no-scroll">
      <div class="banner no-select" v-if="isUser">
        <div class="actions row absolute-top">
          <q-btn
            class="action-btn"
            :loading="loading"
            @click="handleAction"
            unelevated
            dense
          >
            <q-icon :name="isMe ? 'edit' : need ? 'add' : 'chat'"/>
          </q-btn>
        </div>

        <img class='bg' :src="profile.banner || 'fall.png'" alt="banner"/>
        <q-avatar
          v-if="profile.avatar || profile.name"
          class="profile-card__avatar non-selectable shadow-1"
          :color="$color(profile.name)"
          text-color="white"
          size="100px"
        >
          <q-img v-if="profile.avatar" :src="profile.avatar"/>
          <span v-else>{{ profile.name.split('')[0] }}</span>
        </q-avatar>
        <q-skeleton v-else size="100px"/>
      </div>

      <div v-else class="group-channel-banner">
        <q-img height="100%"
               width="100%"
               class='bg'
               alt="banner"
               :src="profile.avatar || 'fall.png'"
        />

        <div class="actions row absolute-top-right" v-close-popup>
          <q-btn
            class="action-btn"
            unelevated
            dense
            v-if="isMine"
            @click="handleAction"
          >
            <q-icon name="edit"/>
          </q-btn>

          <q-btn
            v-else
            class="action-btn"
            unelevated
            dense
            @click="handleAction"
          >
            <q-icon :name="need ? 'add' : 'chat'"/>
          </q-btn>

        </div>
      </div>

      <q-list class="q-my-xs q-px-sm q-mb-sm">
        <q-item>
          <q-item-section>
            <q-item-label class="text-h5 text-grey-10 ellipsis text-weight-medium">
              <span>{{ profile.name }}</span>
            </q-item-label>

            <q-item-label caption>
              @{{ profile.username || profile.groupname || profile.channelname }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label class="bigger-input-font-2 text-grey-10" lines="10">
              {{ isUser ? profile.bio : profile.description }}
            </q-item-label>
          </q-item-section>
        </q-item>

      </q-list>
    </q-card>

  </q-dialog>
</template>

<style lang="scss">

.profile-card {

  position: absolute;
  width: 380px;
  background: #EFEFEF;

  &__avatar {
    position: absolute;
    bottom: 15px;
    z-index: 2;
    left: 5%;
  }

  .group-channel-banner {
    height: 250px;
    overflow: hidden;

    &:hover .actions .action-btn{
      top: 0;
    }
  }

  .banner {
    height: 250px;
    position: relative;
    overflow: hidden;

    &:after {
      content: '';
      position: absolute;
      bottom: -35px;
      height: 80px;
      left:0;
      width: 100%;
      background: #EFEFEF;
      transform: skewY(10deg);
      box-shadow: 0 0 20px 5px #33333370;
    }

    & > .bg {
      width: 100%;
      height: 100%;
      object-position: center;
      object-fit: cover;
    }

    &:hover .actions .action-btn{
      top: 0;
    }
  }

  & > .q-list {
    width: 100%;
  }

  .actions {
    //height: 45px;
    z-index: 1;
    top: 0;
    background: transparent;
    position: absolute;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    margin: 10px;

    .action-btn {
      position: absolute;
      transition: all 0.5s;
      top: -50px;
      background: rgba(0, 0, 0, 0.3);
      color: #FFF;
    }
  }
  .q-img {
    height: 100%;
    width: 100%;
  }

}
</style>

<script>
export default {
  name: 'profile-card',
  props: {
    profile: Object,
    open: Boolean
  },
  data () {
    return {
      openInnerDialog: false,
      isJoinOrSub: false,
      options: ['bruh', 'homie', 'loc'],
      group: '',
      alias: '',
      loading: false,
      innerLoading: false
    };
  },
  computed: {
    $_open: {
      get () {
        return this.open;
      },
      set (val) {
        this.$emit('update:open', val);
      }
    },
    isMe () {
      return this.$store.getters['me/username'] === this.profile.username;
    },

    isUser () {
      return !!this.profile.username;
    },

    isGroup () {
      return !!this.profile.groupname;
    },

    isMyGroupOrChannel () {
      return false;
    },

    isChannel () {
      return !!this.profile.channelname;
    },

    need () {
      if (this.isGroup) {
        return !this
          .$store
          .getters['rel/findGroupByGroupname'](this.profile.groupname);
      }

      if (this.isChannel) {
        return !this
          .$store
          .getters['rel/findChannelByChannelname'](this.profile.channelname);
      }

      if (this.isUser) {
        return !this
          .$store
          .getters['rel/findFriendByUsername'](this.profile.username);
      }
      return false;
    },

    isMine () {
      if (this.isGroup) {
        return !!this
          .$store
          .getters['rel/isMyGroup'](this.profile.groupname);
      } else {
        return !!this
          .$store
          .getters['rel/isMyChannel'](this.profile.channelname);
      }
    },

    tags () {
      return this.$store.getters['rel/tags'];
    }
  },

  methods: {
    async joinGroup () {
      this.loading = true;
      await this.$store.dispatch('rel/joinGroup', this.profile.groupname);
      this.loading = false;
    },

    async subscribeChannel () {
      this.loading = true;
      await this.$store.dispatch('rel/subscribeChannel', this.profile.channelname);
      this.loading = false;
    },

    chat () {
      let type, xname;

      if (this.isUser) {
        type = 'private';
        xname = this.profile.username;
      } else if (this.isChannel) {
        type = 'channel';
        xname = this.profile.channelname;
      } else if (this.isGroup) {
        type = 'group';
        xname = this.profile.groupname;
      }

      this.$emit('update:to', xname);
      this.$emit('update:type', type);
      console.log(xname, type);
    },

    async handleAction () {
      if (this.isMe) {
        this.$_open = false;
        this.$emit('openSettings', 'profile');
        return;
      } else if (this.isMine) {
        this.$_open = false;
        this.$emit('editGroupOrChannel', this.profile);
        return;
      }

      if (this.need) {
        // 如果已经添加则直接发起聊天请求
        if (this.isUser) {
          this.$_open = false;
          this.$emit('addFriend', this.profile);
        } else if (this.isGroup) {
          this.joinGroup();
        } else if (this.isChannel) {
          this.subscribeChannel();
        }
      } else {
        this.$_open = false;
        this.chat();
      }
    }
  }
};
</script>
