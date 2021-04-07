import Vue from 'vue';
import Vuex from 'vuex';

import giphy from './giphy';
import me from './me';
import status from 'src/config/status';
import io from './io';
import rel from './RelationShip';
// import debug from 'debug';
// const log = debug('store');

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    state: {
      isAuthenticated: false,
      accessToken: '',
      config: {},
      manualLogout: false,
      silentMode: false,
      notification: false
    },

    modules: {
      giphy, io, me, rel
    },

    mutations: {
      setNotification: (state, enable) => {
        state.notification = enable;
      },
      setsilentMode: (state, enable) => {
        state.silentMode = enable;
      },
      reset: state => {
        state.isAuthenticated = false;
        state.accessToken = '';
      },
      setAccessToken: function (state, token) {
        this._vm.$api.setAccessToken(token);
        state.accessToken = token;
      },
      setAuthenticated: (state, value) => (state.isAuthenticated = value),
      setManualLogout: function (state, manual) {
        state.manualLogout = manual;
      }
    },

    getters: {
      authenticated: state => state.isAuthenticated,
      getToken: state => state.accessToken,
      manualLogout: state => state.manualLogout,
      silentMode: state => state.silentMode,
      notification: state => state.notification
    },

    actions: {
      reset: function ({ commit, dispatch }) {
        commit('reset');
        commit('me/reset');
        commit('rel/reset');
        commit('io/reset');
      },

      login: async function ({ commit, dispatch }, { credential, cb }) {
        commit('setsilentMode', this._vm.$EStore.get('silentMode'));
        commit('setNotification', this._vm.$EStore.get('notification'));
        const [httpStatus, data] = await this._vm.$api.getAccessToken(credential);
        if (httpStatus === 200 && data.code === status.OK) {
          this._vm.$EStore.set('entry', { ...credential, accessToken: data.accessToken });
          commit('setAccessToken', data.accessToken);
          commit('me/update', { email: this._vm.$EStore.get('entry.email') });
          dispatch('rel/init');

          const onconnect = function () {
            cb && cb();
            // 登录成功，显示avatar和arrow
            commit('setAuthenticated', true);
            dispatch('me/refresh');
          };
          dispatch('io/connect', onconnect);
        }
        return [httpStatus, data.code];
      },

      logout: function ({ commit, dispatch }) {
        this._vm.$EStore.set('entry.accessToken', '');
        this._vm.$api.setAccessToken('');
        dispatch('reset');
      },

      forgetPassword: async function ({ state }, email) {
        const [httpStatus] = await this._vm.$api.forgetPassword(email);

        return httpStatus;
      }
    },
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING,
    plugins: [Vuex.createLogger()]
  });

  return Store;
}
