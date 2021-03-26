import Store from 'electron-store';
import vue from 'vue';
vue.prototype.$EStore = new Store({
  encryptionKey: '28c63ad13be1803097268faeeecdd5c1ddbe931e5a8e866581fcfbd9456d1421'
});
