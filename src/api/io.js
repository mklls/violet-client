import { io } from 'socket.io-client';
import crypto from 'crypto';
import md5 from 'md5';
import rsa from 'src/encrypt/rsa';
import aes from 'src/encrypt/aes';
import debug from 'debug';

const log = debug('api-io');
const error = log.extend('error');

class client {
  init (token, publicKey) {
    const url = process.env.IO;
    // -------aes---------
    // 初始化向量 16 bytes
    this.AESIV = crypto.randomBytes(16);
    // 密钥长度 32 * 8 = 256 bit --> aes-256-ctr
    this.AESKey = md5(Buffer.from(token).toString('utf-8'));
    log('server: %s', url);

    // ----------rsa-------
    // 读取公钥
    rsa.init(publicKey);

    this.socket = io(url, {
      path: process.env.IO_PATH,
      secure: process.env.SECURE_SOCKETIO,
      autoConnect: false,
      extraHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  connect (onconnect) {
    this.socket.on('connect', onconnect);

    // 用于群组和频道通信的共用AES密钥
    // 此处采用共享的AES密钥，由于socketio限制，采用广播转发群组或频道的消息，
    // 一次将消息发给所有在目标频道或者群组的成员，无法用各自客户端的密钥一一加密
    // 只能使用共有的AES密钥
    this.socket.on('common key', (common, cb) => {
      const plain = this.decrypt(common);
      this.commonAESKey = plain.AESKey;
      this.commonAESIV = Buffer.from(plain.AESIV);
      console.log('common IV', plain.AESIV);
      console.log('common IV', plain.AESKey);
      cb();
    });

    // 以下环境已开启SSL/TLS保证通信过程的安全性
    // 在SSL/TLS的基础上再次加密
    // 客户端预埋服务器公钥,可以解决非对称加密中密钥交换问题。
    // 客户端用服务器公钥加密AES密钥
    // 每个客户端的AES密钥各不相同
    this.socket.on('key', ack => ack(rsa.encrypt(JSON.stringify({ AESKey: this.AESKey, AESIV: this.AESIV }))));

    // 确认连接状态，服务器会用客户端密钥加密一条消息并发送给客户端
    this.socket.on('greet', v => {
      log('ack: %O', v);
      log('greeting: %o', this.decrypt(v));
    });

    const APIEventHandlers = {
      'user deleted': arg => {
        arg = this.decrypt(arg, this.commonAESIV, this.commonAESKey);
        if (typeof this.onUserDeleted === 'function') {
          this.onUserDeleted(arg);
        }
        log('[event] user deleted %o', arg);
      },
      'profile updated': arg => {
        arg = this.decrypt(arg, this.commonAESIV, this.commonAESKey);
        this.onProfileUpdated(arg);
        log('[event] profile updated %o', arg);
      },
      'friend added': arg => {
        arg = this.decrypt(arg, this.commonAESIV, this.commonAESKey);
        if (typeof this.onFriendAdded === 'function') {
          this.onFriendAdded(arg);
        }
        log('[event] friend added %o', arg);
      },
      'friend deleted': arg => {
        arg = this.decrypt(arg, this.commonAESIV, this.commonAESKey);
        if (typeof this.onFriendDeleted === 'function') {
          this.onFriendDeleted(arg);
        }
        log('[event] friend deleted %o', arg);
      },
      'group updated': arg => {
        arg = this.decrypt(arg, this.commonAESIV, this.commonAESKey);
        if (typeof this.onGroupUpdated === 'function') {
          this.onGroupUpdated(arg);
        }
        log('[event] group updated %o', arg);
      },
      'group joined': arg => {
        arg = this.decrypt(arg, this.commonAESIV, this.commonAESKey);
        console.log(arg);
        this.onGroupJoined(arg);
        log('[event] group joined %o', arg);
      },
      'group left': arg => {
        arg = this.decrypt(arg, this.commonAESIV, this.commonAESKey);
        if (typeof this.onGroupLeft === 'function') {
          this.onGroupLeft(arg);
        }
        log('[event] group left %o', arg);
      },
      'group deleted': arg => {
        arg = this.decrypt(arg, this.commonAESIV, this.commonAESKey);
        if (typeof this.onGroupDeleted === 'function') {
          this.onGroupDeleted(arg);
        }
        log('[event] group deleted %o', arg);
      },
      'channel updated': arg => {
        arg = this.decrypt(arg, this.commonAESIV, this.commonAESKey);
        if (typeof this.onChannelUpdated === 'function') {
          this.onChannelUpdated(arg);
        }
        log('[event] channel updated %o', arg);
      },
      'channel subscribed': arg => {
        arg = this.decrypt(arg, this.commonAESIV, this.commonAESKey);
        this.onChannelSubscribed(arg);
        log('[event] channel subscribed %o', arg);
      },
      'channel unsubscribed': arg => {
        arg = this.decrypt(arg, this.commonAESIV, this.commonAESKey);
        this.onChannelUnsubscribed(arg);
        log('[event] channel unsubscribed %o', arg);
      },
      'channel deleted': arg => {
        arg = this.decrypt(arg, this.commonAESIV, this.commonAESKey);
        this.onChannelDeleted(arg);
        log('[event] channel deleted %o', arg);
      }
    };

    // 注册API事件
    log('register API event handlers');
    for (const event in APIEventHandlers) {
      this.socket.on(event, APIEventHandlers[event]);
    }
    // 连接错误
    this.socket.on('connect_error', err => {
      error(err);
    });

    // ~~~~~~~~~~~~~~~~~~~server 事件~~~~~~~~~~~~~~~~~~

    this.socket.on('private message', message => {
      message = this.decrypt(message);
      console.log('received', message);
      this.onPrivateMessage(message);
    });

    this.socket.on('group message', message => {
      message = this.decrypt(message, this.commonAESIV, this.commonAESKey);
      this.onGroupMessage(message);
    });

    this.socket.on('channel message', message => {
      message = this.decrypt(message, this.commonAESIV, this.commonAESKey);
      this.onChannelMessage(message);
    });

    this.socket.on('private action', action => {
      action = this.decrypt(action);
      console.log('received private action', action);
      this.onPrivateAction(action);
    });

    this.socket.on('group action', action => {
      action = this.decrypt(action, this.commonAESIV, this.commonAESKey);
      log('group action %o', action);
      this.onGroupAction(action);
    });

    this.socket.on('mark as read', payload => {
      payload = this.decrypt(payload);
      log('mark as read %o', payload);
      this.onMarkAsRead(payload);
    });

    this.socket.on('read message', payload => {
      payload = this.decrypt(payload);
      log('read message %o', payload);
      this.onReadMessage(payload);
    });

    this.socket.on('read common message', payload => {
      payload = this.decrypt(payload, this.commonAESIV, this.commonAESKey);
      log('read common message %o', payload);
      this.onReadMessage(payload);
    });

    this.socket.on('status update', payload => {
      payload = this.decrypt(payload, this.commonAESIV, this.commonAESKey);
      log('status update %o', payload);
      this.onStatusUpdate(payload);
    });

    this.socket.on('online friends', friends => {
      friends = this.decrypt(friends);
      this.onOnlineFriends(friends.user);
    });

    this.socket.on('new friend', friend => {
      friend = this.decrypt(friend);
      this.onNewFriend(friend);
    });

    this.socket.on('user disconnect', user => {
      user = this.decrypt(user, this.commonAESIV, this.commonAESKey);
      this.onUserDisconnect(user);
    });

    this.socket.on('user connected', user => {
      user = this.decrypt(user, this.commonAESIV, this.commonAESKey);
      this.onUserConnect(user);
    });

    this.socket.on('chat history', history => {
      history = this.decrypt(history);
      history.messages.forEach(m => {
        m.sent = true;
      });
      this.onChatHistory(history);
    });

    this.socket.connect();
  }

  sendPrivateMessage (message, cb) {
    this.socket.emit('private message', this.encrypt(message), (response) => cb(this.decrypt(response)));
  }

  /**
   *
   * @param message
   * @param {string} message.from
   * @param {string} message.to
   * @param {string} message.time
   * @param {string} message.messageType
   * @param {string} message.contentType
   * @param {string} message.replyTo
   * @param {string} message.content
   * @param cb
   */
  sendGroupMessage (message, cb) {
    this.socket.emit('group message',
      this.encrypt(message, this.commonAESIV, this.commonAESKey),
      (response) => {
        if (typeof cb === 'function') {
          cb(this.decrypt(response));
        }
      });
  }

  sendChannelMessage (message, cb) {
    this.socket.emit('channel message',
      this.encrypt(message, this.commonAESIV, this.commonAESKey),
      (response) => {
        if (typeof cb === 'function') {
          cb(this.decrypt(response));
        }
      });
  }

  /**
   * @param action
   * @param {string} action.from
   * @param {string} action.to
   * @param {string} action.type
   * 'upload_video'
   * 'upload_audio'
   * 'upload_file'
   * 'upload_image'
   * 'typing'
   */
  sendPrivateAction (action) {
    console.log('send privateAction', action);
    this.socket.emit('private action', this.encrypt(action));
  }

  /**
   * @param action
   * @param {string} action.from
   * @param {string} action.to
   * @param {string} action.type
   * 'upload_video'
   * 'upload_audio'
   * 'upload_file'
   * 'typing'
   */
  sendGroupAction (action) {
    console.log('send group action', action);
    this.socket.emit('group action', this.encrypt(action, this.commonAESIV, this.commonAESKey));
  }

  /**
   *
   * @param {string} message.from sender username
   * @param {string} message.to my username
   * @param {string} message.messageID message id
   * @param {string} message.type message id
   */
  readMessage (message) {
    if (message.type === 'private') {
      this.socket.emit('read message', this.encrypt(message));
    } else {
      this.socket.emit('read common message', this.encrypt(message, this.commonAESIV, this.commonAESKey));
    }
  }

  /**
   * @param {string} range.from username
   * @param {string} range.to username
   */
  // 只适用于private message.
  // group channel，想不到很好的解决放方案
  markAsRead (range) {
    this.socket.emit('mark as read', this.encrypt(range));
  }

  disconnect () {
    if (this.socket) {
      this.socket.offAny();
      this.socket.disconnect(true);
    }
  }

  /**
   *
   * @param handlers
   * @param {function} handlers.onUserDeleted
   * @param {function} handlers.onProfileUpdated
   * @param {function} handlers.onFriendAdded
   * @param {function} handlers.onFriendDeleted
   * @param {function} handlers.onGroupUpdated
   * @param {function} handlers.onGroupJoined
   * @param {function} handlers.onGroupLeft
   * @param {function} handlers.onGroupDeleted
   * @param {function} handlers.onChannelUpdated
   * @param {function} handlers.onChannelSubscribed
   * @param {function} handlers.onChannelUnsubscribed
   * @param {function} handlers.onChannelDeleted
   *
   */

  registerAPIEventHandler (handlers) {
    for (const handler in handlers) {
      this[handler] = handlers[handler];
    }
  }

  /**
   * @param {function} handlers.onPrivateMessage
   * @param {function} handlers.onGroupMessage
   * @param {function} handlers.onChannelMessage
   * @param {function} handlers.onPrivateAction
   * @param {function} handlers.onGroupAction
   * @param {function} handlers.onStatusUpdated
   * @param {function} handlers.onReadMessage
   * @param {function} handlers.onMarkAsRead
   * @param {function} handlers.onChatHistory
   * @param {function} handlers.onUserConnect
   * @param {function} handlers.onUserDisconnect
   * @param {function} handlers.onOnlineFriends
   */
  registerServerEventHandler (handlers) {
    for (const handler in handlers) {
      this[handler] = handlers[handler];
    }
  }

  /**
   *
   * @param plain
   * @param IV
   * @param secretKey
   * @returns {*}
   */
  encrypt (plain, IV, secretKey) {
    IV = IV || this.AESIV;
    secretKey = secretKey || this.AESKey;

    if (!this.AESKey) {
      throw new Error('Secret key not found');
    } else if (Object.prototype.toString.call(plain) !== '[object Object]') {
      throw new Error('Plain must be an Object');
    } else {
      return aes.encrypt(JSON.stringify(plain), IV, secretKey);
    }
  }

  decrypt (cipher, IV, secretKey) {
    IV = IV || this.AESIV;
    secretKey = secretKey || this.AESKey;

    if (!this.AESKey) {
      throw new Error('Secret key not found');
    } else if (Object.prototype.toString.call(cipher) !== '[object String]') {
      throw new Error('Cipher must be a string');
    } else {
      return JSON.parse(aes.decrypt(cipher, IV, secretKey));
    }
  }

  /**
   * 超时检测
   * @param {function} onSuccess
   * @param {function} onTimeout
   * @param {object} config
   * @param {number} config.timeout
   * @param {boolean} config.useGlobal
   * @returns {function(...[*]=): function}
   */
  watchTimeout (onSuccess, onTimeout, config) {
    let called = false;
    const timeout = config.timeout || 20 * 1000;
    // const useGlobal = config.useGlobal || true;

    const timer = setTimeout(() => {
      if (called) return;
      called = true;
      this.setGlobalTimeoutHandler() && this.globalTimeoutHandler();
      onTimeout();
    }, timeout);

    return (...args) => {
      if (called) return;
      called = true;
      clearTimeout(timer);
      onSuccess.apply(this, args);
    };
  }

  setGlobalTimeoutHandler (handler) {
    this.globalTimeoutHandler = handler;
  }
  //
  // /**
  //  * 获取在线用户
  //  * @param {object} config
  //  * @param {number} config.timeout
  //  * @param {boolean} config.useGloabl
  //  * @returns {Promise<unknown>}
  //  */
  // getOnlineUser (onSuccess, onTimeout, config) {
  //   this.socket.emit('online users',
  //     this.watchTimeout(onSuccess, onTimeout, config));
  // }

  /**
   * 设置用户状态
   * @param {string} payload.username
   * @param {number} payload.status
   */
  updateStatus (payload) {
    this.socket.emit('status update', this.encrypt(payload));
  }
}

export default client;
