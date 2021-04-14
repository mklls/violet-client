export default {
  username: '用户名',
  name: '名称',
  originalName: '名称',
  email: '电子邮件',
  password: '密码',

  entry: {
    login: '登录',
    register: '注册',
    forgetPassword: '忘记密码',
    passwordReset: '重置明码',

    nameTips: {
      length: '名称由1-50个字符组成。'
    },
    usernameTips: {
      be: '用户名仅由字母和数字组成。',
      startWith: '必须以字母开头。',
      length: '用户名由2-16个字符组成。',
      dup: '用户名已被使用。'
    },
    xnameTips: {
      be: '应该由字母和数字组成。',
      startWith: '必须以字母开头。',
      length: '由2-16个字母组成。',
      dup: '已被占用。'
    },
    passwordTips: {
      length: '密码由8-32个字符组成。',
      symbol: '值少包含一个特殊字符。',
      digit: '至少包含一个数字。',
      uppercase: '至少包含一个大写字母。',
      lowercase: '至少包含一个小写字母。'
    },
    emailTips: {
      dup: '已被占用。'
    },
    registerDone: '注册成功请检查您的收件箱激活帐号。',
    forgetDone: '一封包含密码重置链接的邮件已发送至您的收件箱。',
    registerAbort: '注册失败。',
    invalidCredential: '用户名或密码无效。',
    unverified: '请先验证您的邮箱。'
  },

  avatarMenu: {
    edit: '编辑个人信息',
    preferences: ' 首选项',
    logout: '注销',
    about: '关于',
    status: {
      online: '在线',
      doNotDisturb: '勿扰',
      appearOffline: '隐身'
    }
  },

  contextMenu: {
    delete: '删除好友',
    unsubscribe: '退订频道',
    leave: '退出群组',
    edit: '编辑',
    viewProfile: '查看信息',
    viewGroup: '查看群组信息',
    viewChannel: '查看频道信息',
    deleteChannel: '删除频道',
    deleteGroup: '删除群组',
    enableNotification: '开启通知',
    disableNotification: '关闭通知',
    markAsRead: '标记为已读'
  },

  search: {
    all: '全部',
    users: '用户',
    groups: '群组',
    channels: '频道',
    seconds: '秒',
    notFound: '搜索结果为空'
  },

  settings: {
    label: '设置',
    apply: '应用',
    OK: '确定',
    bio: '个人介绍',
    tabs: {
      profile: '帐号信息',
      security: '安全',
      storage: '存储',
      network: '网络',
      preferences: '首选项'
    },

    autoLaunch: '开机时启动',
    autoLogin: '自动登录',
    behavior: '行为',
    notification: '通知',
    creationDate: '注册日期',
    enableNotification: '桌面通知',
    silentMode: '安静模式',
    deleteAccount: '删除帐号',
    deleteAccountTips: '删除帐号后，无法再次找回。',
    confirmDeleteTitle: '请入你的用户名',
    deleted: '帐号已被删除',
    delete: '删除',
    invalidPassowrd: '密码无效',
    networkProxy: '网络代理',
    networkProxyDisable: '关闭代理',
    networkProxySystemSettings: '使用系统代理',
    networkProxyCustom: '自定义',
    passwordResetInfo: '我们会向你的邮箱发送一封含有重置密码链接的邮件。',
    language: '语言'
  },

  chatPanel: {
    send: '发送',
    message: '消息',
    typing: '输入中',
    upload_video: '正在上传视频',
    upload_audio: '正在上传音频',
    upload_file: '正在上传文件',
    textAreaPlaceholder: '在此处输入'
  },

  common: {
    ok: '确定',
    add: '添加',
    tag: '标签',
    send: '发送',
    cancel: '取消',
    video: '视频',
    audio: '音频',
    image: '图片',
    file: '文件',
    invalid: '无效',
    silentMode: '安静模式',
    required: '必需项',
    upload: '上传',
    unavailable: '不可用',
    connectError: '服务器连接失败。',
    serverError: '服务器内部错误。',
    frequency: '请求过于频繁，请稍候再试。',
    timeout: '请求超时，请检查网络链接是否正常.',
    accessDenied: '未受权',
    badRequest: '请求格式错误',
    fileSizeLimit: '你正在上传的文件超过了 {maxFileSize}',
    group: '群组',
    alias: '备注',
    createGroup: '创建群组',
    createChannel: '创建频道',
    groupname: '群组名',
    channelname: '频道名',
    description: '描述',
    name: '名称',
    online: '在线',
    doNotDisturb: '勿扰',
    offline: '离线',
    subscriber: '订阅者',
    member: '成员',
    you: '你'
  },

  tabs: {
    chat: '聊天',
    contacts: '联系人',
    groups: '群组',
    channels: '频道',
    search: '搜索'
  }
};
