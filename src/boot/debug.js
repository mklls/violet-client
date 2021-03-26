import debug from 'debug';
import vue from 'vue';

// eslint-disable-next-line
localStorage.debug = '*,-sockjs-client:*,-socket.io:*,-engine.io-client:*,-socket.io-parser,-socket.io-manager';
vue.prototype.$debug = debug('violet');
