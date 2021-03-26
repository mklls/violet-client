import { io } from 'socket.io-client';
import crypto from 'crypto';
import md5 from 'md5';
import rsa from 'src/encrypt/rsa';
import aes from 'src/encrypt/aes';
import debug from 'debug';
// import uuid from 'uuid';

const log = debug('client-io');
const error = log.extend('client-io:error');

// const Type = {
//   STATUS: 'Status'
// };

class client {
  init (token, publicKey) {
    const url = process.env.prod ? process.env.API : '';
    this.IV = crypto.randomBytes(16);
    this.AESKey = md5(Buffer.from(token).toString('base64'));
    log('server: %s', url);

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

    this.socket.on('key', ack => {
      const cipher = rsa.encrypt(JSON.stringify({ AESKey: this.AESKey, IV: this.IV }));

      ack(cipher);
    });

    this.socket.on('logged', v => {
      log('ack: %O', v);
      log('greeting: %s', aes.decrypt(v, this.IV, this.AESKey));
    });

    this.socket.on('connect_error', error);
    this.socket.connect();
  }

  disconnect () {
    this.socket.offAny();
    this.socket.disconnect();
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
    const useGlobal = config.useGlobal || true;

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
   * @param {number} status
   * @param {function} onSuccess
   * @param {function} onTimeout
   * @param {object} config
   * @param {number} config.timeout
   * @param {boolean} config.useGloabl
   * @returns {Promise<unknown>}
   */
  setStatus (status, onSuccess, onTimeout, config) {
    this.socket.emit('update status', this.watchTimeout(
      function () {
        log('update status: %s', status);
        onSuccess && onSuccess();
      },
      function () {
        error('update status timeout');
        onTimeout && onTimeout();
      },
      config
    ));
  }

  /**
   * 设置用户状态
   * @param {object} message
   * @param {string} message.type
   * @param {object} message.content
   * @param {object} config
   * @param {number} config.timeout
   * @param {boolean} config.useGloabl
   * @returns {Promise<unknown>}
   */
  async setSendMessage (to, message, config) {
  }
}

export default client;
