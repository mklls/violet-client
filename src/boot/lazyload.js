import VueLazyload from 'vue-lazyload';
import vue from 'vue';

import loadimage from './eclipse.svg';
import errorimage from './placeholder.png';

vue.use(VueLazyload, {
  preLoad: 0.6,
  observer: false,
  error: errorimage,
  loading: loadimage,
  attempt: 3
});
