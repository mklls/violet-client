import api from 'src/api/api';
import status from 'src/config/status';
import debug from 'debug';

const logger = debug('store:rs');

export default {
  namespaced: true,

  state: {
    friends: [],
    channels: [],
    groups: []
  },

  mutations: {
    reset: state => {
      api.setAccessToken('');
      while (state.friends.pop());
      while (state.channels.pop());
      while (state.groups.pop());
    },

    loaded: state => (state.loaded = true),

    initFriends: (state, friends) => {
      friends.forEach(f =>
        state.friends.push({
          ...f.friend,
          alias: f.alias,
          tag: f.tag,
          status: status.IO_USER_OFFLINE,
          notification: f.notification
        }));
    },

    initGroups: (state, groups) => groups.forEach(g => {
      state.groups.push({
        ...g.group,
        notification: g.notification
      });
    }),

    initChannels: (state, channels) => channels.forEach(c => {
      state.channels.push({
        ...c.channel,
        notification: c.notification
      });
    }),

    addFriend: (state, friend) => state.friends.push(friend),

    updateFriend: (state, { username, ...data }) => {
      console.log(data);
      const index = state.friends.findIndex(f => f.username === username);
      if (index === -1) return;
      const newObj = { ...state.friends[index] };

      for (const prop of Object.keys(data)) {
        newObj[prop] = data[prop];
      }

      state.friends.splice(index, 1, newObj);

      // 如果群组中有也需要更新
      for (let i = 0; i < state.groups.length; i++) {
        const mindex = state.groups[i].members.findIndex(m => m.username === username);
        if (mindex === -1) continue;

        const newObj = { ...state.groups[i].members[mindex] };

        for (const prop of Object.keys(data)) {
          newObj[prop] = data[prop];
        }

        state.groups[i].members.splice(mindex, 1, newObj);
      }
    },

    deleteFriend: (state, username) => {
      const index = state.friends.findIndex(v => v.username === username);
      if (index === -1) return;

      state.friends.splice(index, 1);
    },

    joinGroup: (state, group) => state.groups.push(group),

    updateGroup: (state, { groupname, ...data }) => {
      const index = state.groups.findIndex(g => g.groupname === groupname);
      if (index === -1) return;

      const newObj = { ...state.groups[index] };
      for (const prop of Object.keys(data)) {
        newObj[prop] = data[prop];
      }

      state.groups.splice(index, 1, newObj);
    },

    addGroupMember: (state, { groupname, user }) => {
      const index = state.groups.findIndex(g => g.groupname === groupname);

      if (index === -1) return;

      state.groups[index].members.push(user);

      logger.info('Add %s to group:%s', user.username, groupname);
    },

    removeGroupMember: (state, { groupname, username }) => {
      const index = state.groups.findIndex(g => g.groupname === groupname);
      if (index === -1) return;

      const fIndex = state.groups.members.findIndex(m => m.username === username);
      if (fIndex === -1) return;

      state.groups.members.splice(fIndex, 1);
      logger.info('Remove %s from group:%s', username, groupname);
    },

    leaveGroup: (state, groupname) => {
      const index = state.groups.findIndex(v => v.groupname === groupname);
      if (index === -1) return;

      state.groups.splice(index, 1);
    },

    subscribeChannel: (state, channel) => state.channels.push(channel),

    updateChannel: (state, { channelname, ...data }) => {
      const index = state.channels.findIndex(g => g.channelname === channelname);
      if (index === -1) return;

      const newObj = { ...state.channels[index] };
      for (const prop of Object.keys(data)) {
        newObj[prop] = data[prop];
      }

      state.channels.splice(index, 1, newObj);
    },

    addChannelSubscriber: (state, { channelname, user }) => {
      const index = state.channels.findIndex(v => v.channelname === channelname);
      if (index === -1) return;

      state.channels[index].subscribers.push(user);
      logger.info('Add subscriber %s to channel:%s', user.username, channelname);
    },

    removeChannelSubscriber: (state, { channelname, username }) => {
      const index = state.channels.findIndex(v => v.channelname === channelname);
      if (index === -1) return;

      const sindex = state.channels[index].subscribers.findIndex(v => v.username === username);
      if (sindex === -1) return;

      state.channels[index].subscribers.splice(sindex, 1);
      logger.info('Remove subscriber %s from channel:%s', username, channelname);
    },

    unsubscribeChannel: (state, channelname) => {
      const index = state.channels.findIndex(v => v.channelname === channelname);
      if (index === -1) return;

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

    addFriend: async ({ commit }, payload) => {
      const [httpStatus, data] = await api.addFriend(payload);

      if (httpStatus === 200 && data.code === status.OK) {
        commit('addFriend', {
          ...data.friend,
          alias: payload.alias,
          tag: payload.tag,
          status: status.IO_USER_OFFLINE,
          notification: true
        });
      }
      return [httpStatus, data.code];
    },

    updateFriend: async ({ commit }, { username, alias, tag, notification }) => {
      const payload = { username };

      if (typeof alias === 'string') payload.alias = alias;
      if (typeof tag === 'string') payload.tag = tag;
      if (typeof notification === 'boolean') payload.notification = notification;

      const [httpStatus, data] = await api.updateFriend(payload);

      if (httpStatus === 200) {
        commit('updateFriend', payload);
      }
      return [httpStatus, data.code];
    },

    deleteFriend: async ({ state, commit }, username) => {
      const [httpStatus, data] = await api.deleteFriend(username);
      if (httpStatus === 200) {
        commit('deleteFriend', username);
      }
      return [httpStatus, data.code];
    },

    joinGroup: async ({ commit }, groupname) => {
      let [httpStatus, data] = await api.joinGroup(groupname);

      if (httpStatus === 200 && data.code === status.OK) {
        [httpStatus, data] = await api.queryGroup(groupname);
        if (httpStatus === 200 && data.code === status.OK) {
          commit('joinGroup', {
            ...data.group,
            notification: true
          });
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
      if (httpStatus === 201 && data.code === status.OK) {
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

      console.log('dispatch', payload);
      if (httpStatus === 200 && data.code === 100) {
        commit('updateGroup', { groupname, ...payload });
      }

      console.log('after', payload);
      return [httpStatus, data.code];
    },

    setGroupAvatar: async ({ commit }, { groupname, file }) => {
      const [httpStatus, data] = await api.upload({ target: groupname, group: true, file });

      if (httpStatus === 201 && data.code === 100) {
        commit('updateGroup', { groupname, avatar: data.url });
      }
    },

    setGroupNotification: async ({ commit }, { groupname, notification }) => {
      const [httpStatus, data] = await api.setGroupNotification(groupname, notification);
      if (httpStatus === 200 && data.code === 100) {
        commit('updateGroup', { groupname, notification });
      }
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
          commit('subscribeChannel', {
            ...data.channel,
            notification: true
          });
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
      if (httpStatus === 201 && data.code === status.OK) {
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

    setChannelAvatar: async ({ commit }, { channelname, file }) => {
      const [httpStatus, data] = await api.upload({ target: channelname, channel: true, file });

      if (httpStatus === 201 && data.code === 100) {
        commit('updateChannel', { channelname, avatar: data.url });
      }
    },

    setChannelNotification: async ({ commit }, { channelname, notification }) => {
      const [httpStatus, data] = await api.setChannelNotification(channelname, notification);

      if (httpStatus === 200 && data.code === 100) {
        commit('updateChannel', { channelname, notification });
      }
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
    channels: state => state.channels,
    findFriendByUsername: state => username => state.friends.find(f => f.username === username),
    findGroupByGroupname: state => groupname => state.groups.find(g => g.groupname === groupname),
    findChannelByChannelname: state => channelname => state.channels.find(c => c.channelname === channelname),
    tags: state => [...new Set(state.friends.map(f => f.tag))],
    isMyGroup: (state, getters, rootState, rootGetters) => groupname => rootGetters['me/username'] ===
      state.groups.find(g => g.groupname === groupname)?.owner?.username,
    isMyChannel: (state, getters, rootState, rootGetters) => channelname => rootGetters['me/username'] ===
      state.channels.find(c => c.channelname === channelname)?.owner?.username,
    isMyFriend: state => username => !!state.friends.find(f => f.username === username),
    findGroupMemberByUsername: state => (groupname, username) => {
      const group = state.groups.find(g => g.groupname === groupname);
      if (!group) return '';
      const members = group.members.find(m => m.username === username);
      return members;
    },

    enableNotification: state => xname => {
      const u = state.friends.find(f => f.username === xname);
      if (u) return u.notification;

      const g = state.groups.find(g => g.groupname === xname);
      if (g) return g.notification;

      const c = state.channels.find(c => c.groupname === xname);
      if (c) return c.notification;
    }
  }
};
