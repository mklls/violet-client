import _api from 'src/api';
const { api } = _api;
import status from 'src/config/status';

export default {
  namespaced: true,
  state: {
    username: '',
    email: '',
    bio: '',
    avatar: '',
    name: '',
    banner: '',
    _id: '',
    createdAt: '',
    updatedAt: '',
    status: status.IO_USER_ONLINE
  },

  getters: {
    username: state => state.username,
    name: state => state.name,
    email: state => state.email,
    bio: state => state.bio,
    avatar: state => state.avatar,
    banner: state => state.banner,
    id: state => state._id,
    status: state => state.status,
    createdAt: state => state.createdAt,
    updatedAt: state => state.updatedAt,
    me: state => ({
      username: state.username,
      name: state.name,
      email: state.me,
      bio: state.bio,
      avatar: state.avatar,
      banner: state.banner,
      id: state._id,
      createdAt: state.createdAt,
      updatedAt: state.updatedAt
    })
  },

  mutations: {
    update: (state, payload) => {
      for (const prop of Object.keys(payload)) {
        state[prop] = payload[prop];
      }
    },
    reset: state => {
      api.setAccessToken('');
      for (const prop of Object.keys(state)) {
        state[prop] = '';
      }
    }
  },

  actions: {
    refresh: async ({ commit }) => {
      const [httpStatus, data] = await api.getProfile();
      if (httpStatus === 200 && data.code === status.OK) {
        commit('update', data.profile);
      }

      return [httpStatus, data.code];
    },

    update: async ({ commit }, payload) => {
      const [httpStatus, data] = await api.updateProfile(payload);
      if (httpStatus === 200 && data.code === status.OK) {
        commit('update', payload);
      }

      return [httpStatus, data.code];
    },

    uploadAvatar: async ({ commit }, { image, cb }) => {
      const [httpStatus, data] = await api.upload({
        avatar: true,
        file: image
      }, cb);

      if (httpStatus === 201 && data.code === status.OK) {
        commit('update', { avatar: data.url });
      }

      return [httpStatus, data.code];
    },

    uploadBanner: async ({ commit }, { image, cb }) => {
      const [httpStatus, data] = await api.upload({
        banner: true,
        file: image
      }, cb);

      if (httpStatus === 201 && data.code === status.OK) {
        commit('update', { banner: data.url });
      }

      return [httpStatus, data.code];
    },

    deleteAccount: async () => {
      const [httpStatus, data] = await api.deleteAccount();
      if (httpStatus === 200) {
        api.setAccessToken('');
      }

      return [httpStatus, data.code];
    }
  }
};
