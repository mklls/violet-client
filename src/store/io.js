/* eslint-disable */
import { io } from 'socket.io-client';
import rsa from 'src/encrypt/rsa';
import aes from 'src/encrypt/aes';
import crypto from 'crypto';
import md5 from 'md5';
import Client from "src/api/io";
let client = new Client();

const state = {
  publicKey:''
};

const mutations = {
  setPublicKey(state, key) {
    state.publicKey = key;
  }
};

const actions = {
  connect: async ({ state, rootGetters }, cb) => {
    client.init(rootGetters.getToken, state.publicKey);
    client.connect(cb);

    // 监听所有事件
    // for (const event in handlers) {
    //   socket.on(event, handlers[event]);
    // }
  },

  close: () => {
    client.globalTimeoutHandler = null;
    client.disconnect()
  },

  setTimeoutHandler:(ctx, handler) => {
    client.setGlobalTimeoutHandler(handler);
  }

};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
