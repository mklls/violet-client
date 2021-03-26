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
            @openProfileCard="handleOpenProfileCard"
            @openSettings="handleOpenSettings"
          />
        </keep-alive>
      </template>
      <template v-slot:right-panel>
        <chat-panel
          :to.sync="chatTo"
        />
      </template>
    </nav-tabs>

    <settings :open.sync="openSettings" @logout="logout" :tab.sync="tab"/>

    <profile-card
      :profile="profile"
      :open.sync="openProfileCard"
      @openSettings="handleOpenSettings"
    />
  </div>
</template>

<script>
import NavTabs from 'components/NavTabs';
import LayoutHeader from 'components/Header/LayoutHeader';
import Settings from 'components/Settings/Settings';
import ProfileCard from 'components/ProfileCard';
import ChatPanel from 'components/ChatPanel/ChatPanel';

export default {
  name: 'index',
  components: { ChatPanel, ProfileCard, Settings, NavTabs, LayoutHeader },
  data () {
    return {
      openSettings: false,
      openProfileCard: false,
      tab: 'preferences',
      chatTo: '',
      profile: {
        username: '',
        groupname: '',
        channelname: '',
        name: '',
        avatar: '',
        banner: '',
        bio: '',
        description: '',
        isUser: true
      }
    };
  },
  created () {
    this.debug = this.$debug.extend('home');
  },
  methods: {
    handleOpenSettings (tab) {
      this.tab = tab;
      this.openSettings = true;
    },

    handleOpenProfileCard (profile) {
      for (const k in this.profile) {
        this.profile[k] = profile[k];
      }

      this.profile.isUser = !!profile.username;
      this.openProfileCard = true;
    },

    logout () {
      this.openSettings = false;
      this.$router.replace('/login');
      this.$store.dispatch('logout');
    }
  }
};
</script>
