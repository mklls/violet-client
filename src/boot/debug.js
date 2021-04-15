import debug from 'debug';
import Vue from 'vue';

// eslint-disable-next-line
localStorage.debug = '*,-sockjs-client:*,-socket.io:*,-socket.io-client,:-socket.io-client:*,-engine.io-client:*,-socket.io-parser,-socket.io-manager';
Vue.prototype.$debug = debug('violet');
