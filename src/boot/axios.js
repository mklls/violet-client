import vue from 'vue';
import axios from 'axios';
import _api from 'src/api';
import debug from 'debug';

const log = debug('axios');
const error = log.extend('error');
const info = log.extend('info');

/**
 * 检查请求是否失败
 * @param code
 * @returns {boolean}
 */

let strings;
function responseCheck (code) {
  let noti;
  let httpError = true;

  const map = {
    serverError: {
      type: 'negative', message: strings.serverError
    },
    limit: {
      type: 'warning', message: strings.frequency
    },
    unauthorized: {
      type: 'negative', message: strings.accessDenied
    },
    badRequest: {
      type: 'negative', message: strings.badRequest
    },
    timeout: {
      type: 'negative', message: strings.timeout
    },
    failed: {
      type: 'negative', message: strings.failed
    }
  };

  if (code === 429 || code === 503) {
    noti = map.limit;
  } else if (code === 403 || code === 401) {
    noti = map.unauthorized;
  } else if (code === 408) {
    noti = map.timeout;
  } else if (code >= 400 && code < 500) {
    noti = map.badRequest;
    console.log('bad_____________request');
  } else if (code >= 500) {
    noti = map.serverError;
  } else if (code >= 200 && code < 300) {
    httpError = false;
  } else {
    console.log(code, 'unknow');
    noti = map.badRequest;
  }

  httpError && vue.prototype.$q.notify(noti);
  return httpError;
};

function debounce (fn) {
  const timer = new Map();

  return function (timestamp, code) {
    let currentTimer = timer.get(timestamp);
    clearTimeout(currentTimer);
    currentTimer = setTimeout(() => {
      fn(code);
      clearTimeout(currentTimer);
      timer.delete(timestamp);
    }, 180);
    timer.set(timestamp, currentTimer);
  };
}

// 仅在重试最后一次失败时,检查响应结果
const handler = debounce(responseCheck);

axios.interceptors.request.use(config => {
  log('Request %s %s %O', config.method, config.url, config);
  return config;
}, err => {
  console.log('bad REQUEST', err);
  return Promise.reject(err);
});

axios.interceptors.response.use(function (res) {
  info('Response %s %s %O', res.config.method, res.config.url, res.data);
  return res;
}, function (err) {
  error('$o', err);
  if (err.config['axios-retry']) {
    handler(err.config['axios-retry'].lastRequestTime, err.response.status);
  } else {
    handler((new Date()).getTime(), err.response.status);
  }

  return Promise.reject(err);
});

vue.prototype.$ResponseErrorCheck = responseCheck;
vue.prototype.$api = _api.api;
vue.prototype.$giphy = _api.giphy;
vue.prototype.$axios = axios;
vue.prototype.$initAxiosResponseCheck = i18nStrings => (strings = i18nStrings);
