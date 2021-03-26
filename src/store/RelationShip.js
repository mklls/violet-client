import api from 'src/api/api';
import status from 'src/config/status';

export default {
  namespaced: true,

  state: {
    tags: [],
    friends: [],
    channels: [],
    groups: []
  },

  mutations: {
    initFriends: (state, friends) => {
      friends.forEach(f =>
        state.friends.push({
          ...f.friend,
          alias: f.alias,
          tag: f.tag
        }));
    },

    initGroups: (state, groups) => groups.forEach(g => state.groups.push(g)),

    initChannels: (state, channels) => channels.forEach(c => state.channels.push(c)),

    addFriend: (state, friend) => state.friends.push(friend),

    updateFriend: (state, { username, alias, tag }) => {
      const index = state.friends.findIndex(f => f.username === username);
      if (index === -1) {
        console.warn('friend not exists');
        return;
      }
      if (typeof alias === 'string') {
        state.friends[index].alias = alias;
      }
      if (typeof tag === 'string') {
        state.friends[index].tag = tag;
      }
    },

    deleteFriend: (state, username) => {
      const index = state.friends.findIndex(v => v.username === username);
      state.friends.splice(index, 1);
    },

    joinGroup: (state, group) => state.groups.push(group),

    updateGroup: (state, { groupname, member, name, avatar, description }) => {
      const index = state.groups.findIndex(g => g.groupname === groupname);
      if (typeof member !== 'undefined') {
        state.groups[index].members.push(member);
      }

      if (typeof name === 'string') {
        state.groups[index].name = name;
      }

      if (typeof avatar === 'string') {
        state.groups[index].avatar = avatar;
      }

      if (typeof description === 'string') {
        state.groups[index].description = description;
      }
    },

    leaveGroup: (state, groupname) => {
      const index = state.groups.findIndex(v => v.groupname === groupname);
      state.groups.splice(index, 1);
    },

    subscribeChannel: (state, channel) => state.channels.push(channel),

    updateChannel: (state, { channelname, subscriber, name, avatar, description }) => {
      const index = state.channels.findIndex(g => g.channelname === channelname);
      if (typeof subscriber !== 'undefined') {
        state.channels[index].subscribers.push(subscriber);
      }

      if (typeof name === 'string') {
        state.channels[index].name = name;
      }

      if (typeof avatar === 'string') {
        state.channels[index].avatar = avatar;
      }

      if (typeof description === 'string') {
        state.channels[index].description = description;
      }
    },

    unsubscribeChannel: (state, channelname) => {
      const index = state.channels.findIndex(v => v.channelname === channelname);
      state.channels.splice(index, 1);
    }
  },

  actions: {
    init: async ({ rootGetters, commit }) => {
      api.setAccessToken(rootGetters.getToken);

      let [httpStatus, data] = await api.getFriends();
      if (httpStatus === 200 && data.code === status.OK) {
        commit('initFriends', data.friends);
      };

      [httpStatus, data] = await api.getChannels();
      if (httpStatus === 200 && data.code === status.OK) {
        commit('initChannels', data.channels);
      }

      [httpStatus, data] = await api.getGroups();
      if (httpStatus === 200 && data.code === status.OK) {
        commit('initGroups', data.groups);
      }
    },

    addFriend: async ({ commit }, { username, alias, tag }) => {
      const [httpStatus, data] = await api.addFriend(username);

      if (httpStatus === 200 && data.code === status.OK) {
        commit('addFriend', {
          ...data.friend,
          alias,
          tag
        });

        const [httpStatus2, data2] = await api.updateFriend({ alias, tag });
        return [httpStatus2, data2.code];
      } else {
        return [httpStatus, data.code];
      }
    },

    updateFriend: async ({ commit }, { username, alias, tag }) => {
      const payload = {};

      if (typeof alias === 'string') payload.alias = alias;
      if (typeof tag === 'string') payload.tag = tag;

      const [httpStatus, data] = await api.updateFriend(payload);

      if (httpStatus === 200) {
        commit('updateFriend', payload);
      }
      return [httpStatus, data.code];
    },

    deleteFriend: async ({ state, commit }, username) => {
      const index = state.friends.findIndex(f => f.username === username);
      if (index === -1) {
        console.warn('not found in store', username);
      }

      const [httpStatus, data] = await api.deleteFriend(username);
      if (httpStatus === 200) {
        state.friends.splice(index, 1);
      }
      return [httpStatus, data.code];
    },

    joinGroup: async ({ commit }, groupname) => {
      let [httpStatus, data] = await api.joinGroup(groupname);

      if (httpStatus === 200 && data.code === status.OK) {
        [httpStatus, data] = await api.queryGroup(groupname);
        if (httpStatus === 200 && data.code === status.OK) {
          commit('joinGroup', data.group);
        } else {
          console.warn('Group query aborted');
        }
      }
      return [httpStatus, data.code];
    },

    leaveGroup: async ({ commit }, groupname) => {
      const [httpStatus, data] = await api.leaveGroup(groupname);

      if (httpStatus === 200 && data.code === 100) {
        commit('leaveGroup', groupname);
      }
      return [httpStatus, data.code];
    },

    createGroup: async ({ commit, rootGetters }, payload) => {
      const [httpStatus, data] = await api.createGroup(payload);
      if (httpStatus === 200 && data.code === status.OK) {
        const { bio, username, name, avatar, banner } = rootGetters['me/me'];
        commit('joinGroup', {
          ...payload,
          owner: { bio, username, name, avatar, banner },
          admins: [],
          subscribers: []
        });
      }
      return [httpStatus, data.code];
    },

    updateGroup: async ({ commit }, { groupname, payload }) => {
      const [httpStatus, data] = await api.updateGroup(groupname, payload);

      if (httpStatus === 200 && data.code === 100) {
        commit('updateGroup', { groupname, ...payload });
      }
      return [httpStatus, data.code];
    },

    deleteGroup: async ({ commit }, groupname) => {
      const [httpStatus, data] = await api.deleteGroup(groupname);

      if (httpStatus === 200 && data.code === status.OK) {
        commit('leaveGroup', groupname);
      }
      return [httpStatus, data.code];
    },

    subscribeChannel: async ({ commit }, channelname) => {
      let [httpStatus, data] = await api.subChannel(channelname);

      if (httpStatus === 200 && data.code === status.OK) {
        [httpStatus, data] = await api.queryChannel(channelname);
        if (httpStatus === 200 && data.code === status.OK) {
          commit('subscribeChannel', data.channel);
        } else {
          console.warn('Channel query aborted');
        }
      }
      return [httpStatus, data.code];
    },

    unsubscribeChannel: async ({ commit }, channelname) => {
      const [httpStatus, data] = await api.unsubChannel(channelname);

      if (httpStatus === 200 && data.code === 100) {
        commit('unsubscribeChannel', channelname);
      }
      return [httpStatus, data.code];
    },

    createChannel: async ({ commit, rootGetters }, payload) => {
      const [httpStatus, data] = await api.createChannel(payload);
      if (httpStatus === 200 && data.code === status.OK) {
        const { bio, username, name, avatar, banner } = rootGetters['me/me'];
        commit('subscribeChannel', {
          ...payload,
          owner: { bio, username, name, avatar, banner },
          admins: [],
          subscribers: []
        });
      }

      return [httpStatus, data.code];
    },

    updateChannel: async ({ commit }, { channelname, payload }) => {
      const [httpStatus, data] = await api.updateChannel(channelname, payload);

      if (httpStatus === 200 && data.code === 100) {
        commit('updateChannel', { channelname, ...payload });
      }
      return [httpStatus, data.code];
    },

    deleteChannel: async ({ commit }, channelname) => {
      const [httpStatus, data] = await api.deleteChannel(channelname);

      if (httpStatus === 200 && data.code === status.OK) {
        commit('leaveChannel', channelname);
      }
      return [httpStatus, data.code];
    }
  },

  getters: {
    friends: state => state.friends,
    groups: state => state.groups,
    channels: state => state.channels
  }
};
