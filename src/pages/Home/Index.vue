<template>
  <div >
    <layout-header
      :logged=true
      @openProfileCard="handleOpenProfileCard"
      @openSettings="handleOpenSettings"
    />
    <nav-tabs>
      <template v-slot:left-panel>
        <keep-alive>
          <router-view
            :to.sync="chatTo"
            :cate.sync="cate"
            :type.sync="chatType"
            @openProfileCard="handleOpenProfileCard"
            @editFriend="handleEditFriend"
            @openSettings="handleOpenSettings"
            @newGroupOrChannel="createGroupOrChannel"
            @deleted="handleDelete"
          />
        </keep-alive>
      </template>

      <template v-slot:right-panel>
        <chat-panel
          :to.sync="chatTo"
          :type="chatType"
          @deleted="handleDelete"
          @openProfileCard="handleOpenProfileCard"
          @editFriend="handleEditFriend"
          @openViewer="handleOpenViewer"
        />
      </template>
    </nav-tabs>

    <settings :open.sync="openSettings" @logout="logout" :tab.sync="tab"/>

    <profile-card
      :profile="profile"
      :open.sync="openProfileCard"
      :type.sync="chatType"
      :to.sync="chatTo"
      @addFriend="handleAddFriend"
      @openSettings="handleOpenSettings"
      @editGroupOrChannel= "handleOpenGroupOrChannelDialog"
    />

    <friend-edit-dialog
      :profile="profile"
      :open.sync="openFriendEditDialog"
    />

    <group-channel-edit-dialog
      :profile="profile"
      :open.sync="openGroupOrChannelEditDialog"
      @updateProfileName="v => profile.name = v"
      @updateProfileDescription="v => profile.description = v"
    />

    <tinybox
      v-if="openViewer"
      :images="gallery"
      :index="currentImage"
      no-thumbs
      @close="openViewer = false"
      @prev="val => currentImage = val"
      @next="val => currentImage = val"
    />

  </div>
</template>

<style lang="scss">
  .tinybox {
    margin-top: 42px;
    height: calc(100vh - 42px);

    .tinybox__thumbs {
      overflow: hidden;
    }
  }
</style>

<script>
import NavTabs from 'components/NavTabs';
import LayoutHeader from 'components/Header/LayoutHeader';
import Settings from 'components/Settings/Settings';
import ProfileCard from 'components/ProfileCard';
import ChatPanel from 'components/ChatPanel/ChatPanel';
import FriendEditDialog from 'components/FriendEditDialog';
import GroupChannelEditDialog from 'components/GroupChannelEditDialog';
import path from 'path';

export default {
  name: 'index',
  components: { GroupChannelEditDialog, FriendEditDialog, ChatPanel, ProfileCard, Settings, NavTabs, LayoutHeader },
  data () {
    return {
      // 弹出设置面板
      chatType: '',
      openViewer: false,
      openSettings: false,

      // 弹出资料卡片
      openProfileCard: false,

      // 弹出修改联系人资料对话框
      openFriendEditDialog: false,

      // ....
      openGroupOrChannelEditDialog: false,
      // 设置tab
      tab: 'preferences',

      // 和谁聊天
      chatTo: '',

      // 搜索tab
      cate: 'all',

      // 图片
      gallery: [],
      currentImage: 0,

      // 资料卡片数据
      profile: {
        username: '',
        groupname: '',
        channelname: '',
        members: '',
        subscribers: '',
        name: '',
        avatar: '',
        banner: '',
        bio: '',
        description: ''
      }
    };
  },
  watch: {
    messages (newVal) {
    }
  },

  computed: {
    messages () {
      return this.$store.getters['io/getAllMessages'];
    }
  },

  created () {
    this.$store.commit('io/messageHandler', this.messageHandler);
    this.debug = this.$debug.extend('home');
  },

  methods: {
    messageHandler (message) {
      let from, body;
      body = '';
      if (!this.$store.getters.notification) return;

      // 判断是否为发送方开启通知
      if (message.messageType === 'private' &&
        !this.$store.getters['rel/findFriendByUsername'](message.from).notification) {
        return;
      } else if (message.messageType === 'channel' &&
        !this.$store.getters['rel/findChannelByChannelname'](message.to).notification) {
        return;
      } else if (message.messageType === 'group' &&
        !this.$store.getters['rel/findGroupByGroupname'](message.to).notification) {
        return;
      }

      // 判断时候开启勿扰模式

      if (this.$store.getters['me/status'] === this.$status.IO_USER_BUSY) {
        return;
      }

      if (message.messageType === 'group') {
        from = this.$store.getters['rel/findGroupByGroupname'](message.to);
        body = message.from + ': ';
      } else if (message.messageType === 'channel') {
        from = this.$store.getters['rel/findChannelByChannelname'](message.to);
      } else {
        from = this.$store.getters['rel/findFriendByUsername'](message.from);
      }

      if (message.contentType === 'text') {
        body = body + message.content;
      } else {
        body = body + message.contentType + ', ' + message.attachment.name;
      }

      const notification = {
        title: from.alias || from.name,
        icon: from.avatar || path.join(__statics, 'favicon-128x128.png'),
        body,
        silent: this.$store.getters.silentMode
      };

      console.log(notification);

      const noti = new Notification(notification.title, notification);
      noti.onclick = () => {
        console.log(message.from);
      };
    },

    handleDelete (who) {
      if (who === this.chatTo) this.chatTo = '';
    },
    handleOpenSettings (tab) {
      this.tab = tab;
      this.openSettings = true;
    },

    handleOpenProfileCard (profile) {
      for (const k in this.profile) {
        this.profile[k] = profile[k];
      }

      this.openProfileCard = true;
    },

    handleAddFriend (profile) {
      for (const k in this.profile) {
        this.profile[k] = profile[k];
      }

      this.openFriendEditDialog = true;
    },

    handleOpenGroupOrChannelDialog (profile) {
      for (const k in this.profile) {
        this.profile[k] = profile[k];
      }

      this.openGroupOrChannelEditDialog = true;
    },

    handleOpenViewer (arg) {
      while (this.gallery.pop());

      arg.images.forEach(image => this.gallery.push(image));
      console.log('current gallery ', this.gallery);

      this.currentImage = this.gallery.findIndex(image => arg.currentImage === image.src);
      this.openViewer = true;
    },

    handleEditFriend (profile) {
      for (const k in this.profile) {
        this.profile[k] = profile[k];
      }

      this.openFriendEditDialog = true;
    },

    createGroupOrChannel () {
      for (const k in this.profile) {
        this.profile[k] = '';
      }

      this.openGroupOrChannelEditDialog = true;
    },

    logout () {
      this.openSettings = false;
      this.$router.replace('/login');
      this.$store.dispatch('logout');
    }
  }
};
</script>
