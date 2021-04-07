<template>
  <div class="chat-panel-container" style="height: 100%; padding-top: 0">
    <div v-if="!to" class="full-width full-height flex-center row items-center justify-center">
      <q-img src="images/void.svg" width="60%"></q-img>
    </div>

    <div v-else class="chat-panel relative-position column">
      <div class="bg-grey-1 text-black shadow-down non-selectable">
        <q-item>
          <q-item-section style="justify-content: flex-start">
            <q-item-label
              style="font-size: 20px"
              class="cursor-pointer"
              @click="$emit('openProfileCard', profile)"
            >
              {{ profile.alias || profile.name }}
            </q-item-label>

            <q-item-label
              :class="subColor"
              style="font-size: 20px"
              caption
            >
              {{ subtitle }}
            </q-item-label>

          </q-item-section>
          <q-item-section avatar side @click="openMenu">
            <q-btn class="more_action" dense flat round icon="more_vert" >
              <context-menu
                @openProfileCard="$emit('openProfileCard', profile)"
                @editFriend="$emit('editFriend', profile)"
                @deleted="$emit('deleted', to)"
                ref="contextMenu"
                :profile="profile"/>
            </q-btn>
          </q-item-section>
        </q-item>
      </div>

      <q-separator/>

      <div class="message-area bg-grey-3" ref="messageRoot">
        <q-scroll-area ref="messageArea" class="no-scroll" style="height: 100%">
          <q-intersection
            v-for="m in messages"
            once
            :key="m._id"
            :root="$refs.messageRoot"
            @visibility="readMessage(m._id)"
            style="min-height: 56px"
          >
            <q-chat-message
              :bg-color="m.from === myUsername ? 'green-11' : 'blue-grey-11'"
              :stamp="$ctime(m.time)"
              :sent="type === 'channel' ? false : m.from === myUsername"
            >
              <div
                v-if="type !== 'private' && m.from !== myUsername"
                class="message-username"
              >
                {{ type === 'group' ? findGroupMemberByUsername(m.from).name : profile.alias || profile.name }}
              </div>
              <template v-if="type === 'group' && m.from !== myUsername " v-slot:avatar>
                <q-avatar
                  style="margin-left: -10px; margin-right: 10px"
                  :color="$color(findGroupMemberByUsername(m.from).name)"
                  font-size="26px"
                  text-color="white"
                  @click="$emit('openProfileCard', findGroupMemberByUsername(m.from))"
                  class="non-selectable"
                >
                  <q-img
                    class="avatar"
                    v-if="findGroupMemberByUsername(m.from).avatar"
                    :src="findGroupMemberByUsername(m.from).avatar"
                  />
                  <div v-else>{{findGroupMemberByUsername(m.from).name.split('')[0]}}</div>
                </q-avatar>
              </template>
              <div v-if="m.contentType ==='text'" class="selectable-text message-text">{{ m.content }}</div>
              <img
                v-else-if="m.contentType ==='image'"
                :src="m.content"
                class="non-selectable message-image"
              />

              <video
                controls
                v-else-if="m.contentType ==='video'"
                :src="m.content"
                class="non-selectable message-video"
              />

              <audio
                controls
                v-else-if="m.contentType ==='audio'"
                :src="m.content"
                class="non-selectable message-audio"
              />

              <div v-else-if="m.contentType === 'file'" class="message-file">
                <div class="flex no-wrap">
                  <div class="file-avatar">
                    <q-icon name="folder"/>
                  </div>
                  <div class="file-info selectable-text">
                    <q-item-label lines="1" class="file-name">{{m.attachment.name}}</q-item-label>
                    <q-item-label lines="1" class="file-size grey">{{$readableBytes(m.attachment.size)}}</q-item-label>
                  </div>
                </div>
              </div>

              <q-icon v-if="m.from === myUsername && m.sent" class="read-flag" :name="m.read ? 'done_all':'done'"/>

              <q-spinner v-else-if="m.from === myUsername" class="read-flag"/>
            </q-chat-message>
          </q-intersection>

          <div
            :key="action.from"
            v-for = "action in actions">
            <q-chat-message
              bg-color="blue-grey-11"
            >
              <div
                v-if="type !== 'private'"
                class="message-username"
              >
                {{ findGroupMemberByUsername(action.from).name }}
              </div>

              <template v-if="type === 'group'" v-slot:avatar>
                <q-avatar
                  class="q-message-avatar"
                  text-color="white"
                  :color="$color(findGroupMemberByUsername(action.from).name)"
                >
                  <q-img
                    v-if="findGroupMemberByUsername(action.from).avatar"
                    :src="findGroupMemberByUsername(action.from).avatar"
                    :alt="action.from"
                  />
                  <div v-else>{{ findGroupMemberByUsername(action.from).name.split('')[0] }} </div>
                </q-avatar>
              </template>

              <q-spinner-dots size="2rem"/>
            </q-chat-message>
          </div>
        </q-scroll-area>
      </div>

      <div
        @keyup.enter.ctrl="sendText"
        v-if="enableInput"
        class="input-area">
        <q-separator/>
        <div class="row no-wrap">
          <q-toolbar class="row items-start">
            <q-btn
              flat
              class="files-icon"
              size="16px"
              round
              dense
              icon="attach_file"
              @click="openFileUploader = !openFileUploader">
              <file-uploader
                @start="sendFileAction"
                @uploaded="sendFile"
                :on-upload-progress="syncUploadProgress"
                :open.sync="openFileUploader"/>
            </q-btn>

            <twemoji-picker
              :pickerWidth=330
              :pickerArrowEnabled=false
              :emojiData="emojiDataAll"
              :emojiGroups="emojiGroups"
              :skinsSelection=false
              :searchEmojisFeat=true
              :recentEmojisFeat=true
              @emojiUnicodeAdded="onEmojiSelectUni"
              searchEmojiPlaceholder="Search here."
              isLoadingLabel="Loading..."
            >
              <template v-slot:twemoji-picker-button>
                <q-btn class="emjoji-icon" flat size="16px" round dense icon="sentiment_satisfied_alt" />
              </template>
            </twemoji-picker>

            <q-btn class="gif-icon" flat size="16px" round dense icon="gif" @click="openGifBox = !openGifBox">
              <giphy :open.sync="openGifBox" @select="sendGif"></giphy>
            </q-btn>

            <textarea-autosize
              class="q-ma-sm input-box col-auto"
              placeholder="Type something here..."
              ref="messageTextarea"
              v-model="text"

              rows="1"
              :min-height="30"
              :max-height="140"
            />

            <q-btn
              flat
              round
              dense
              @click="sendText"
              icon="send"
              size="18px"
            />
          </q-toolbar>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" >
.chat-panel {
  height: 100%;

  .more_action i {
    font-size: 2em;
  }

  #popper-container[data-show] {
    background: #efefef;
    border-radius: 8px;

    & > #emoji-popup {
      box-shadow:
        0 1px 20px rgba(0, 0, 0, 0.2),
        0 2px 20px rgba(0, 0, 0, 0.14),
        0 3px 20px -2px rgba(0, 0, 0, 0.12);

      border-radius: 8px;
    }

  }

  .q-message-avatar {
    margin-left: -10px;
    margin-right: 10px;
  }

  .q-message-container > div {
    position: relative;
    max-width: 86%;

    .message-username {
      margin: 0 0 3px;
      color: #1976d2;
    }

    .read-flag {
      color: #21BA45;
      position: absolute;
      bottom: 8px;
      right: 8px;
      font-size: 20px;
    }

    .q-message-stamp {
      font-size: 16px;
      margin-right: 30px;
    }

    .message-video,.message-image,.message-text {
      width: 100%;
      height: 100%;
    }

    .message-audio,.message-file {
      max-width: 320px;
    }

    .message-file {

      .file-avatar {
        color: darkslategrey;
        display: flex;
        margin-right: 10px;
        text-align: start;
        font-size: 40px;
      }

      .file-info {
        max-width: calc(100% - 50px);
      }

      .file-size {
        font-size: 18px;
      }
    }
  }

  .message-area {
    padding-top: 1px;
    flex: 1118 1 auto;
    max-height: calc(100vh - 50px);
  }
  .q-message {
    font-size: 19px;
    margin-left: 20px;
    margin-right: 20px;
    position: relative;
  }

  .q-message-text--sent {
    //background: teal;
    //&:before {
    //  background: teal;
    //}
  }

  .q-message-text--received {
    //background: aliceblue;
    //&:before {
    //  background: aliceblue;
    //}
  }

  .shadow-down {
    box-shadow: 15px -11px 20px 0px #333;
  }

  .input-area {
    max-height: 150px;
    min-height: 50px;
    flex: 1 1 auto;
    font-size: 1.5em;
    line-height: 0.9em;
    width: 100%;

    .files-icon .q-icon, .q-btn .q-spinner{
      font-size: 25px !important;
    }

    .gif-icon .q-icon, .q-btn .q-spinner {
      font-size: 40px !important;
    }

    .input-box {
      margin: 0.2em;
      flex: 1 1 auto;
      font-size: 0.89em;
      min-height: 30px;
      color: #212020;
      padding: 0.2em 0.4em;
      padding-top: 0.28em;
      min-width: 200px;
      outline: none;
    }
  }
}
</style>

<script>
import Giphy from './Giphy';
import { i18n } from 'boot/i18n';
const LANG = i18n.locale.split('-')[0].toLocaleLowerCase();
import { TwemojiPicker } from '@kevinfaguiar/vue-twemoji-picker';
import EmojiGroups from '@kevinfaguiar/vue-twemoji-picker/emoji-data/emoji-groups.json';
import FileUploader from 'components/ChatPanel/FileUploader';
import ContextMenu from 'components/ContextMenu';
let EmojiAllData = null;

// Loading Localized Datasets on Demand
try {
  EmojiAllData = require(`@kevinfaguiar/vue-twemoji-picker/emoji-data/${LANG}/emoji-all-groups.json`);
} catch (erorr) {
  EmojiAllData = require('@kevinfaguiar/vue-twemoji-picker/emoji-data/en/emoji-all-groups.json');
}

export default {
  components: { ContextMenu, FileUploader, Giphy, TwemojiPicker },
  props: {
    to: String,
    type: String
  },
  data () {
    return {
      fileUploaded: true,
      openFileUploader: false,
      splitterModel: 70,
      openGifBox: false,
      right: false,
      text: '',
      content: '',
      file: '',
      actionTimer: 9999999
    };
  },
  computed: {
    enableInput () {
      let enable = false;
      if (this.type === 'private' || this.type === 'group') {
        enable = true;
      }

      if (this.type === 'channel' && this.$store.getters['rel/isMyChannel'](this.to)) {
        enable = true;
      }

      return enable;
    },

    unreadPosition () {
      let height = 0;
      // scrollarea 自带三个孩子
      // 偏移
      const OFFSET = 3;
      let unreadBegin = this.messages.findIndex(msg => msg.from !== this.myUsername && msg.read === false);

      if (unreadBegin === -1) {
        unreadBegin = this.messages.length + 1;
      }

      let i = 0;

      this.$refs.messageArea.$children.every(child => {
        if (child.$el.clientHeight) {
          height += child.$el.clientHeight + 10;
          i++;
        }

        if (i === unreadBegin) return false;

        return true;
      });

      return height;
    },
    myUsername () {
      return this.$store.getters['me/username'];
    },
    emojiDataAll () {
      return EmojiAllData;
    },
    emojiGroups () {
      return EmojiGroups;
    },
    messages () {
      let msgs;

      if (this.type === 'private') {
        msgs = this.$store.getters['io/getMessagesFromUser'](this.to);
      } else {
        msgs = this.$store.getters['io/getMessagesFromGroupOrChannel'](this.to);
      }

      return msgs;
    },

    actions () {
      let acts = [];
      if (this.type === 'private') {
        acts = this.$store.getters['io/getActionFromUser'](this.to);
      } else if (this.type === 'group') {
        acts = this.$store.getters['io/getActionFromGroup'](this.to);
      }

      return acts;
    },

    profile () {
      let profile;
      switch (this.type) {
        case 'private':
          profile = this.$store.getters['rel/findFriendByUsername'](this.to);
          break;
        case 'channel':
          profile = this.$store.getters['rel/findChannelByChannelname'](this.to);
          break;
        case 'group':
          profile = this.$store.getters['rel/findGroupByGroupname'](this.to);
          break;
      }

      return profile;
    },

    subtitle () {
      let sub;

      if (this.actions.length === 0) {
        switch (this.type) {
          case 'private':
            sub = this.$t(this.$userStatus(this.profile.status));
            break;
          case 'channel': {
            const channel = this.profile;

            sub = channel.subscribers.length.toLocaleString() +
              ' ' + this.$t('common.subscriber');

            if (channel.subscribers.length > 1 && this.$i18n.locale === 'en-US') sub += 's';
            break;
          }
          case 'group': {
            const group = this.profile;

            sub = group.members.length.toLocaleString() +
              ' ' + this.$t('common.member');

            if (group.members.length > 1 && this.$i18n.locale === 'en-US') sub += 's';
            break;
          }
        }
      } else {
        if (this.type === 'private') {
          sub = this.$t('chatPanel.' + this.actions[0].type);
        } else {
          for (let i = 0; i < this.actions.length; i++) {
            console.log(this.actions[i]);
            sub += this.from + ' ' + this.$t('chatPanel.' + this.actions[i].type);

            if (i !== this.actions.length - 1) {
              sub += ',';
            }
          }
        }
      }

      return sub;
    },

    subColor () {
      return {
        'text-green': this.actions.length === 0 && this.type === 'private' &&
          this.$store
            .getters['rel/findFriendByUsername'](this.to)
            .status === this.$status.IO_USER_ONLINE,

        'text-red': this.type === 'private' &&
          this.$store
            .getters['rel/findFriendByUsername'](this.to)
            .status === this.$status.IO_USER_BUSY,

        'text-primary': this.actions.length > 0
      };
    }
  },
  watch: {
    text: function (newVal) {
      if (newVal) {
        this.throttleSendAction('typing');
      }
    },

    to: function (newVal, oldVal) {
      if (newVal) {
        setTimeout(() => {
          this.$refs.messageArea.setScrollPosition(this.unreadPosition, 400);
        }, 100);
      }
    },
    actions: function (n, o) {
      if (n.length === o.length && n.length === 0) return;

      setTimeout(() => {
        this.$refs.messageArea.setScrollPosition(999999999, 250);
      }, 100);
    },

    messages: function (newVal, oldVal) {
      if (newVal.length === 0) return;
      if (oldVal.length === 0) return;
      const latest = newVal[newVal.length - 1];
      const old = oldVal[oldVal.length - 1];
      // 最新消息和最后一条消息有同一人发送，但是可能有群组切换到了私聊，所以无需message来触发下拉，交由to即可
      if (old.to !== latest.to) {
        return;
      } else if (newVal.length === oldVal.length) {
        // 如果没有切换，则可能时消息被对方读取，此时也不需要下拉进度条
        return;
      }

      if (oldVal.length !== 0) {
        const latest = newVal[newVal.length - 1];

        if (latest.read === true && this.messages.from === this.myUsername) return;

        setTimeout(() => {
          // 啦呀啦
          this.$refs.messageArea.setScrollPercentage(1, 200);
        }, 350);
      }
    },

    fileUploaded: function (uploaded) {
      if (uploaded) {
        clearTimeout(this.actionTimer);
      }
    }
  },

  methods: {
    view () {
      this.$q.electron.shell.openPath('/home/violex/Dev/Nodejs/violet/client/public/cache/image/ryuuko.png');
    },

    findGroupMemberByUsername (username) {
      return this.profile.members.find(m => m.username === username);
    },

    onEnterKey (e) {
      console.log('ClickedEnter', e);
    },

    onEmojiSelectUni (emoji) {
      this.text += emoji;
      // 不知道怎么插入
      // const messageArea = this.$refs.messageTextarea.$el;
      // const startPos = messageArea.selectionStart;
      // const endPos = messageArea.selectionEnd;
      //
      // if (startPos === 0 && startPos === endPos) {
      //   this.text = emoji + this.text;
      // } else {
      //   messageArea.setRangeText(emoji, startPos, endPos, 'select');
      //   messageArea.selectionStart = messageArea.selectionEnd;
      //   this.text = messageArea.value;
      // }
      // console.table({ model: this.content, value: this.text });
    },

    send (contentType, content, attach) {
      const message = {
        from: this.myUsername,
        to: this.to,
        messageType: this.type,
        content: content,
        contentType: contentType,
        attachment: attach || {}
      };
      this.$store.dispatch('io/sendMessage', message);
      this.text = '';
      this.throttleSendAction = this._.debounce(this.sendAction, 5000, { leading: true, trailing: false });
    },

    sendText () {
      if (this.text) {
        this.send('text', this.text);
      }
    },

    sendGif (gif) {
      this.send('image', gif.original.url, { name: gif.title, size: gif.original.size });
      this.openGifBox = false;
    },

    sendFile (file) {
      this.fileUploaded = true;
      this.send(file.fileType, file.url, {
        name: file.originalname,
        size: file.size
      });
    },

    syncUploadProgress (percentage) {
      console.log(percentage);
    },

    sendAction (type) {
      const action = {
        from: this.$store.getters['me/username'],
        to: this.to,
        type
      };

      if (this.type === 'private') {
        this.$store.dispatch('io/sendPrivateAction', action);
      } else if (this.type !== 'channel') {
        this.$store.dispatch('io/sendGroupAction', action);
      }
    },

    sendFileAction (file) {
      this.fileUploaded = false;
      const actionType = `upload_${file.fileType}`;
      this.actionTimer = setInterval(() => {
        if (this.fileUploaded) {
          clearTimeout(this.actionTimer);
        } else {
          this.sendAction(actionType);
        }
      }, 4500);
    },

    readMessage (messageID) {
      const msg = this.$store.getters['io/getMessageById'](messageID);

      if (msg.from === this.myUsername) return;
      if (msg.read) return;

      console.log('read', msg.from, this.myUsername, msg._id, msg);
      this.$store.dispatch('io/readMessage', { from: msg.from, to: msg.to, messageID, type: this.type });
    },

    openMenu () {
      this.$refs.contextMenu.toggle();
    }
  },
  created () {
    this.throttleSendAction = this._.throttle(this.sendAction, 4500, { leading: true, trailing: false });
  },
  mounted () {
  }
};
</script>
