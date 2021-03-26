<template>
  <div class="chat-panel relative-position column">

    <div class="bg-grey-1 text-black shadow-down">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar class="q-mr-md">
            <img src="cache/image/icon2@500x500.png">
          </q-avatar>
          <span>{{ name }}</span>
        </q-toolbar-title>
        <q-btn dense flat round icon="scatter_plot" />
      </q-toolbar>
    </div>

    <q-separator/>

    <div class="message-area bg-grey-3">
      <q-scroll-area class="no-scroll" style="height: 100%">
        <q-chat-message
          size="8"
          label="Hello from hell"
        />
        <q-chat-message
          size="8"
        >
          <template v-slot:default>
            <video
              controls
              width="100%"
              height="100%"
              src="https://cdn.violex.ml/static/0d5c221d9bae490c4fe8fde11e3c8292/application/0d21b0.mkv"
            />
          </template>
        </q-chat-message>
        <q-chat-message
          size="8"
        >
          <template v-slot:default>
            <v-embed :options="vOption">
              https://cdn.violex.ml/static/0d5c221d9bae490c4fe8fde11e3c8292/application/0d21b0.mkv
            </v-embed>
          </template>
        </q-chat-message>
        <q-chat-message
          label="Friday, 18th"
          :text="['hey, how are you?']"
          stamp="7 minutes ago"
          sent
          bg-color="amber-7"
        />
        <q-chat-message
          :text="[
          'doing fine, how r you?',
          'I just feel like typing a really, really, REALLY long message to annoy you...'
        ]"
          stamp="4 minutes ago"
          text-color="white"
          bg-color="primary"
        />
        <q-chat-message
          :text="['Did it work?', '']"
          text-color="white"
          bg-color="primary"
        />
        <q-chat-message
          :text="['Probably not worrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrk']"
          stamp="1 minutes ago"
          text-color="white"
          bg-color="primary"
        />
        <q-chat-message
          name="Jane"
          :text="['Did it work?']"
          stamp="1 minutes ago"
          size="8"
          text-color="white"
          bg-color="primary"
        >
          <template v-slot:default>
            <q-img src="cache/image/ryuuko.png" width="100%" @click="view"/>
          </template>
          <span class="icon icon-note"></span>
        </q-chat-message>
        <q-chat-message
          name="Jane"
          :text="['Did it work?']"
          stamp="1 minutes ago"
          size="8"
          text-color="white"
          bg-color="primary"
        >
          <template v-slot:default>
            <q-img src="cache/image/wp6664386.png" width="100%" @click="view"/>
          </template>
        </q-chat-message>

        <q-chat-message
          name="Jane"
          :text="['Did it work?', '合约，你们都把它回了😀😃']"
          stamp="1 minutes ago"
          size="8"
          text-color="white"
          sent
          bg-color="primary"
        >
          <template v-slot:default>
            <q-img src="cache/image/wp6664386.png" width="100%" @click="view" alt="Good"/>
          </template>
        </q-chat-message>

      </q-scroll-area>

    </div>

    <div class="input-area shadow-upup">
      <q-separator class="shadow-1"/>
      <div class="row no-wrap">
        <q-toolbar class="row bg-grey-3">
          <q-btn flat class="files-icon" size="16px" round dense icon="attach_file" @click="fileUploader = !fileUploader">
            <file-uploader :open.sync="fileUploader"/>
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
          <q-btn class="gif-icon" flat size="16px" round dense icon="gif" @click="gifBox = !gifBox">
            <giphy :open.sync="gifBox" @select="gifBox = false"></giphy>
          </q-btn>
          <textarea-autosize
            class="q-ma-sm input-box col-auto"
            placeholder="Type something here..."
            ref="MessageTextarea"
            v-model="text"
            rows="1"
            :min-height="30"
            :max-height="140"
          />
          <q-btn flat size="18px" round dense icon="send" />
        </q-toolbar>
      </div>
    </div>
  </div>
</template>

<style lang="scss" >
.chat-panel {
  height: 100%;

  #popper-container[data-show] {
    background: #efefef;
    border-radius: 8px;
    box-shadow: rgb(152, 152, 152) 0 1px 0px 1px;

    & > #emoji-popup {
      box-shadow:
        0 1px 20px rgba(0, 0, 0, 0.2),
        0 2px 20px rgba(0, 0, 0, 0.14),
        0 3px 20px -2px rgba(0, 0, 0, 0.12);

      border-radius: 8px;
    }

  }
  // eslint-disable
  .message-area {
    flex: 1118 1 auto;
    max-height: calc(100vh - 50px);
  }
  .q-message {
    font-size: 1.2em;
    margin-left: 25px;
    margin-right: 25px;
    position: relative;
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
import VEmbed from 'vue-embed';
import Giphy from './Giphy';
import { i18n } from 'boot/i18n';
const LANG = i18n.locale.split('-')[0].toLocaleLowerCase();
import { TwemojiPicker } from '@kevinfaguiar/vue-twemoji-picker';
import EmojiGroups from '@kevinfaguiar/vue-twemoji-picker/emoji-data/emoji-groups.json';
import FileUploader from 'components/ChatPanel/FileUploader';
let EmojiAllData = null;

// Loading Localized Datasets on Demand
try {
  EmojiAllData = require(`@kevinfaguiar/vue-twemoji-picker/emoji-data/${LANG}/emoji-all-groups.json`);
} catch (erorr) {
  // fallback en
  EmojiAllData = require('@kevinfaguiar/vue-twemoji-picker/emoji-data/en/emoji-all-groups.json');
}

export default {
  components: { FileUploader, VEmbed, Giphy, TwemojiPicker },
  data () {
    return {
      vOption: {
        plugins: [
          { name: 'url', escape: false },
          { name: 'media' }
        ]
      },
      files: [],
      fileUploader: false,
      name: 'Vergil',
      splitterModel: 70,
      gifBox: false,
      right: false,
      text: '',
      content: ''
    };
  },
  computed: {
    emojiDataAll () {
      return EmojiAllData;
    },
    emojiGroups () {
      return EmojiGroups;
    }
  },
  methods: {
    view () {
      this.$q.electron.shell.openPath('/home/violex/Dev/Nodejs/violet/client/public/cache/image/ryuuko.png');
    },
    onEnterKey (e) {
      console.log('ClickedEnter', e);
    },
    onEmojiSelectUni (emoji) {
      const messageArea = this.$refs.MessageTextarea.$el;
      const startPos = messageArea.selectionStart;
      const endPos = messageArea.selectionEnd;

      if (startPos === 0 && startPos === endPos) {
        this.text = emoji + this.text;
      } else {
        messageArea.setRangeText(emoji, startPos, endPos, 'select');
        messageArea.selectionStart = messageArea.selectionEnd;
        this.text = messageArea.value;
      }
      console.table({ model: this.content, value: this.text });
    }
  }
};
</script>
