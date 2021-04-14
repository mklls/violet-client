import Client from 'src/api/io';
import status from 'src/config/status';

const client = new Client();

const state = {
  publicKey: '',
  messages: [],
  actionPool: [],
  messageHandler: function (message) {}
};

const mutations = {
  reset: state => {
    while (state.messages.pop());
    while (state.actionPool.pop());
    client.globalTimeoutHandler = null;
    client.disconnect();
  },
  setPublicKey (state, key) {
    state.publicKey = key;
  },

  messageHandler (state, fun) {
    state.messageHandler = fun;
  },

  addMessage: (state, message) => {
    state.messages.push(message);
  },

  addAllMessages: (state, messages) => {
    messages.forEach(m => state.messages.push(m));
    state.isNewMessage = true;
  },

  removeMessage: (state, messageID) => {
    const index = state.messages.findIndex(m => m._id === messageID);
    if (index === -1) return;

    state.messages.splice(index, 1);
  },

  updateMessageID: (state, { oldID, newID }) => {
    const index = state.messages.findIndex(m => m._id === oldID);
    if (index === -1) return;

    const newObj = { ...state.messages[index] };
    newObj.sent = true;
    newObj._id = newID;
    state.messages.splice(index, 1, newObj);
  },

  updateMessage: (state, { messageID, ...data }) => {
    const index = state.messages.findIndex(m => m._id === messageID);
    if (index === -1) return;

    const newObj = { ...state.messages[index] };
    for (const prop in Object.keys(data)) {
      newObj[prop] = data[prop];
    }

    state.messages.splice(index, 1, newObj);
  },

  readMessage: (state, { messageID }) => {
    const index = state.messages.findIndex(m => m._id === messageID);
    if (index === -1) return;
    const newObj = { ...state.messages[index] };
    newObj.read = true;

    state.messages.splice(index, 1, newObj);
  },

  markAsRead: (state, { from, to }) => {
    state.messages.forEach(m => {
      if (m.from === from && m.to === to) {
        m.read = true;
      }
    });
  },

  addAction: (state, action) => {
    const index = state.actionPool.findIndex(a => a.from === action.from && a.to === action.to);

    if (index === -1) {
      state.actionPool.push(action);
    } else {
      state.actionPool.splice(index, 1, action);
    }
  },
  removeAction: (state, action) => {
    const index = state.actionPool
      .findIndex(act => act.from === action.from && act.to === action.to);

    state.actionPool.splice(index);
  }
};

const actions = {
  connect: async ({ state, rootGetters, commit }, cb) => {
    client.init(rootGetters.getToken, state.publicKey);

    client.registerAPIEventHandler({
      onProfileUpdated: payload => commit('rel/updateFriend', payload, { root: true }),

      onUserDeleted: payload => commit('rel/deleteFriend', payload, { root: true }),

      onFriendAdded (payload) {
        console.log('friend added', payload);
        if (payload.friend.username === rootGetters['me/username']) {
          console.log('added');
          commit('rel/addFriend', { ...payload.user, notification: true, alias: '', tag: '' }, { root: true });
        } else if (payload.user.username === rootGetters['me/username']) {
          console.log('add');
          process.nextTick(() => {
            const timer = setTimeout(() => {
              commit('rel/updateFriend', { username: payload.friend.username, status: payload.friend.status }, { root: true });
              clearTimeout(timer);
            }, 300);
          });
        }
      },

      onFriendDeleted (payload) {
        console.log('fucking yeah deleted', payload);
      },

      onChannelDeleted: payload => commit('rel/unsubscribeChannel', payload, { root: true }),

      onChannelSubscribed: payload => {
        if (payload.user.username === rootGetters['me/username']) return;
        commit('rel/addChannelSubscriber', payload, { root: true });
      },

      onChannelUnsubscribed: payload => commit('rel/removeChannelSubscriber', payload, { root: true }),

      onChannelUpdated: payload => commit('rel/updateChannel', payload, { root: true }),

      onGroupDeleted: payload => commit('rel/leaveGroup', payload, { root: true }),

      onGroupJoined (payload) {
        if (payload.user.username === rootGetters['me/username']) return;

        commit('rel/addGroupMember', payload, { root: true });
      },
      onGroupUpdated: payload => commit('rel/updateGroup', payload, { root: true }),

      onGroupLeft: payload => commit('rel/removeGroupMember', payload, { root: true }),

      onStatusUpdate: payload => commit('rel/updateFriend', payload, { root: true })
    });

    client.registerServerEventHandler({
      onChatHistory: history => {
        commit('addAllMessages', history.messages);
      },
      onOnlineFriends: friends => {
        friends.forEach(f => {
          commit('rel/updateFriend', f, { root: true });
        });
      },
      onUserConnect: ({ username }) => {
        commit('rel/updateFriend', { username, status: status.IO_USER_ONLINE }, { root: true });
      },
      onPrivateAction: action => {
        commit('addAction', action);

        // 5s后移除action
        const timer = setTimeout(() => {
          commit('removeAction', action);
          clearTimeout(timer);
        }, 6 * 1000);

        console.log(action);
      },
      onGroupAction: action => {
        commit('addAction', action);

        // 5s后移除action
        const timer = setTimeout(() => {
          commit('removeAction', action);
          clearTimeout(timer);
        }, 5 * 1000);

        console.log(action);
      },

      onStatusUpdated: payload => {
        commit('rel/updateFriend', payload, { root: true });
      },

      onUserDisconnect: ({ username }) => {
        commit('rel/updateFriend', { username, status: status.IO_USER_OFFLINE }, { root: true });
      },

      onGroupMessage: message => {
        state.messageHandler(message);
        commit('removeAction', { from: message.from, to: message.to });
        commit('addMessage', message);
      },

      onChannelMessage: message => {
        state.messageHandler(message);
        commit('addMessage', message);
        console.log(message);
      },

      onPrivateMessage: message => {
        state.messageHandler(message);
        console.log(message);
        commit('removeAction', { from: message.from, to: message.to });
        commit('addMessage', message);
      },

      onReadMessage: message => {
        commit('readMessage', message);
      },

      onMarkAsRead: payload => {
        commit('markAsRead', payload);
      }

    });

    client.connect(cb);
  },

  setTimeoutHandler: (ctx, handler) => {
    client.setGlobalTimeoutHandler(handler);
  },

  sendMessage: ({ state, commit }, message) => {
    message.time = Date.now();
    message.read = false;

    const localID = Math.random().toString(32).substr(2, 10);
    const callback = ({ status, id }) => {
      console.log('get message id', id);
      process.nextTick(() => {
        if (status === 'ok') {
          commit('updateMessageID', { oldID: localID, newID: id });
        }
      });
    };

    console.log('prep send', message);
    if (message.messageType === 'group') {
      client.sendGroupMessage(message, callback);
    } else if (message.messageType === 'channel') {
      client.sendChannelMessage(message, callback);
    } else {
      client.sendPrivateMessage(message, callback);
    }

    message._id = localID;
    message.sent = false;
    commit('addMessage', message);
  },
  /**
   *
   * @param commit
   * @param action
   * @param {string} action.from
   * @param {string} action.to
   * @param {string} action.type upload_video upload_image upload_audio upload_file typing
   */
  sendPrivateAction: ({ _ }, action) => {
    client.sendPrivateAction(action);
  },

  sendGroupAction: ({ _ }, action) => {
    client.sendGroupAction(action);
  },

  readMessage: ({ state, commit }, payload) => {
    client.readMessage(payload);
    commit('readMessage', { messageID: payload.messageID });
  },

  updateStatus: ({ commit, rootGetters }, status) => {
    client.updateStatus({
      username: rootGetters['me/username'],
      status
    });

    commit('me/update', { status }, { root: true });
  }
};

const getters = {
  getAllMessages: state => state.messages,
  getMessageById: state => id => state.messages.find(m => m._id === id),

  getImagesFromUser: (state, getters, rootState, rootGetters) => username => {
    const me = rootGetters['me/username'];

    return state
      .messages
      .filter(m => m.contentType === 'image' && (
        (m.from === username && m.to === me) ||
        (m.from === me && m.to === username))
      )
      .map(m => {
        return {
          src: m.content,
          alt: m.attachment.name,
          caption: m.attachment.name,
          size: m.attachment.size
        };
      });
  },

  getImagesFromGroupOrChannel: (state) => xname =>
    state
      .messages
      .filter(m => m.to === xname && m.contentType === 'image')
      .map(m => {
        return {
          src: m.content,
          alt: m.attachment.name,
          size: m.attachment.size
        };
      }),

  getMessagesFromUser: (state, getters, rootState, rootGetters) =>
    username => {
      const me = rootGetters['me/username'];
      return state.messages.filter(m => (m.from === me && m.to === username) || (m.from === username && m.to === me));
    },

  getMessagesFromGroupOrChannel: state => xname => state.messages.filter(m => m.to === xname),

  getTotalUnreadCount: (state, getters, rootState, rootGetters) => state
    .message
    .filter(m => m.from !== rootGetters['me/username'] && !m.read)
    .length,

  getTotalGroupUnreadCount: (state, getters, rootState, rootGetters) => state
    .messages.filter(m => !m.read && m.from !== rootGetters['me/username'] && m.messageType === 'group')
    .length,

  getTotalChannelUnreadCount: (state, getters, rootState, rootGetters) => state
    .messages.filter(m => !m.read && m.from !== rootGetters['me/username'] && m.messageType === 'group')
    .length,

  getUnreadCountFromUser: (state, getters, rootState, rootGetters) => username => state
    .messages
    .filter(m => m.from === username && m.to === rootGetters['me/username'] && m.read === false)
    .length,

  getUnreadCountFromGroupOrChannel: (state, getters, rootState, rootGetter) => groupOrChannelname => state
    .messages
    .filter(m => m.from !== rootGetter['me/username'] && !m.read && m.to === groupOrChannelname)
    .length,

  getActionFromUser: (state, getters, rootState, rootGetters) => username =>
    state.actionPool.filter(act => act.from === username && act.to === rootGetters['me/username']),

  getActionFromGroup: state => groupname => state.actionPool.filter(act => act.to === groupname)
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
