import vue from 'vue';
import os from 'os';
import status from 'src/config/status';

vue.prototype.$versions = process.versions;
vue.prototype.$versions.os = os.type() + ' ' + os.release();
vue.prototype.$versions.violet = '1.0.0';
vue.prototype.$versions.vue = vue.version;
vue.prototype.$color = function (str) {
  // 生成伪随机颜色
  const pool = ['pink', 'purple', 'deep-purple', 'indigo', 'primary', 'secondary', 'green', 'teal'];
  let token = 0;
  for (let i = 0; i < str.length; i++) {
    token += str.charCodeAt(i);
  }
  return pool[token % pool.length];
};
vue.prototype.$userStatus = function (code) {
  let str;

  switch (code) {
    case status.IO_USER_ONLINE: str = 'common.online'; break;
    case status.IO_USER_BUSY: str = 'common.doNotDisturb'; break;
    case status.IO_USER_OFFLINE: str = 'common.offline'; break;
  }

  return str;
};

vue.prototype.$readableBytes = function (bytes, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

  return bytes.toFixed(dp) + ' ' + units[u];
};
