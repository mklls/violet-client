import axios from 'axios';
import axiosRetry from 'axios-retry';
import status from 'src/config/status';
import debug from 'debug';
import misc from 'src/config/misc';
const log = debug('api');
const error = log.extend('error');

const http = axios.create({
  baseURL: process.env.API
});

// 载入全局拦截器
http.interceptors.request = axios.interceptors.request;
http.interceptors.response = axios.interceptors.response;

axiosRetry(http, {
  retries: misc.AXIOS_RETRIES,
  retryDelay: retryCount => 500 * Math.pow(2, retryCount)
});

async function uniPost (url, payload) {
  let res;
  try {
    log('POST %s %o', url, payload);
    res = await http.post(url, payload);
  } catch (err) {
    res = err.response;
    error(err.response);
  }
  return [res.status, res.data];
}

async function uniPut (url, payload) {
  let res;
  try {
    log('PUT %s %O', url, payload);
    res = await http.put(url, payload);
  } catch (err) {
    res = err.response;
    error('%O', err.response);
  }
  return [res.status, res.data];
}

async function uniGet (url, query) {
  let res;
  try {
    log('GET %s q:%o', url, query);
    res = await http.get(url, {
      params: query
    });
  } catch (err) {
    res = err.response;
    error(err.response);
  }
  return [res.status, res.data];
}

async function uniDelete (url) {
  let res;
  try {
    log('DELETE %s', url);
    res = await http.delete(url);
  } catch (err) {
    res = err.response;
    error(err.response);
  }

  return [res.status, res.data];
}

async function uniUpload (payload, cb) {
  const formData = new FormData();
  for (const k in payload) {
    formData.append(k, payload[k]);
  }
  let res;

  try {
    log('UPLOAD %o', payload);

    res = await http.post('/v1/users/upload', formData, {
      onUploadProgress: function (progressEvent) {
        cb && cb(Math.round((progressEvent.loaded * 100) / progressEvent.total));
      }
      // headers: {
      //   ...formData.getHeaders()
      // }
    });
  } catch (err) {
    res = err.response;
    error(err.response);
  }

  return [res.status, res.data];
}

export default {
  checkStatus: async () => uniGet('/v1/status'),
  setAccessToken: token => (http.defaults.headers.Authorization = 'Bearer ' + token),
  // entry
  /**
   * 检查名称可用性
   * @param xname
   * @returns {Promise<[number, any]>}
   */
  checkXname: async xname => await uniGet('/v1/availability', {
    t: 'xname', q: xname
  }),

  /**
   * 检查地址可用性
   * @param email
   * @returns {Promise<[number, any]>}
   */
  checkEmail: async email => await uniGet('/v1/availability', {
    t: 'email', q: email
  }),

  /**
   * 注册帐号
   * @param payload 用于注册帐号的数据
   * @returns {Promise<[number, any]>}
   */
  register: async payload => await uniPost('/v1/register', payload),

  /**
   * 获取token,获取成功后，自动挂载到头部
   * @param crendital 邮箱和密码
   * @returns {Promise<(number|any)[]>}
   */
  getAccessToken: async function (crendital) {
    const [statusCode, data] = await uniPost('/v1/auth', crendital);
    if (statusCode === 200 && data.code === status.OK) {
      http.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
    }
    return [statusCode, data];
  },
  // 获取个人资料
  getProfile: async () => await uniGet('/v1/users/profile'),
  /**
   * 更新帐号资料
   * @param profile 通常包含name和bio
   * @returns {Promise<[number, any]>}
   */
  updateProfile: async profile => await uniPost('/v1/users/profile', profile),

  // profile
  /**
   * 忘记密码，通过邮件重置
   * @param email 收件地址
   * @returns {Promise<[number, any]>}
   */
  forgetPassword: async email => await uniGet(`/v1/users/password/forget?email=${email}`),

  /**
   * 重置密码
   * @returns {Promise<[number, any]>}
   */
  resetPassword: async () => await uniGet('/v1/users/password/startReset'),

  /**
   * 注销帐号
   * @returns {Promise<[number, any]>}
   */
  deleteAccount: async () => await uniDelete('/v1/users'),

  // friend
  /**
   * 添加好友
   * @param username 好友用户名
   * @returns {Promise<[number, any]>}
   */
  addFriend: async username => await uniPost('/v1/users/friends', { username }),

  /**
   * 获取好友列表
   * @returns {Promise<[number, any]>}
   */
  getFriends: async () => await uniGet('/v1/users/friends'),

  /**
   * 更新好友数据，用于修改别名和标签
   * @param payload 通常包含 alias 和 tag
   * @returns {Promise<[number, any]>}
   */
  updateFriend: async payload => await uniPut('/v1/users/friends', payload),

  /**
   * 删除好友
   * @param username
   * @returns {Promise<[number, any]>}
   */
  deleteFriend: async username => await uniDelete(`/v1/users/friends/${username}`),

  // group
  // payload {object} 群组数据
  createGroup: async payload => await uniPost('/v1/groups', payload),

  // 查询特定群组
  queryGroup: async groupname => await uniGet(`/v1/groups/${groupname}`),

  // 加入群组
  joinGroup: async groupname => await uniGet(`/v1/groups/join?target=${groupname}`),

  // 离开群组
  leaveGroup: async groupname => await uniGet(`/v1/groups/leave?target=${groupname}`),

  // 更新群组
  updateGroup: async (target, payload) => await uniPost(`/v1/groups/update?target=${target}`, payload),

  // 删除群组
  deleteGroup: async groupname => await uniDelete(`/v1/groups/${groupname}`),

  // 获取群组列表
  getGroups: async () => await uniGet('/v1/groups'),

  // channel
  createChannel: async payload => await uniPost('/v1/channels', payload),

  // 查询特定频道
  queryChannel: async channelname => await uniGet(`/v1/channels/${channelname}`),

  // 订阅频道
  subChannel: async channelname => await uniGet(`/v1/channels/subscribe?target=${channelname}`),

  // 退订频道
  unsubChannel: async channelname => await uniGet(`/v1/channels/unsubscribe?target=${channelname}`),

  // 更新频道
  updateChannel: async (target, payload) => await uniPost(`/v1/channels/update?target=${target}`, payload),

  // 删除频道
  deleteChannel: async channelname => await uniDelete(`/v1/channels/${channelname}`),

  // 获取频道列表
  getChannels: async () => await uniGet('/v1/channels'),

  // file
  // 文件上传
  upload: async (payload, cb) => await uniUpload(payload, cb),

  // 搜索
  find: async query => await uniGet('/v1/search', query)
};
