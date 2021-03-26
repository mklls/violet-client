// This is just an example,
// so you can safely delete all default props below

export default {
  username: 'username',
  name: 'full name',
  email: 'email',
  password: 'password',

  entry: {
    login: 'Sign in',
    register: 'Sign up',
    forgetPassword: 'Forget password',
    passwordReset: 'Password reset',

    nameTips: {
      length: 'Name should be between 1-50 characters'
    },
    usernameTips: {
      be: 'Username should consist of letters and numbers.',
      startWith: 'Username should start with a letter.',
      length: 'Username should be between 2-16 characters.',
      dup: 'Username is already taken.'
    },
    passwordTips: {
      length: 'Password should be between 8-32 characters.',
      symbol: 'At least a special symbol.',
      digit: 'At least a number.',
      uppercase: 'At least a uppercase character.',
      lowercase: 'At least a lowercase character.'
    },
    emailTips: {
      dup: 'Eamil is already taken.'
    },
    registerDone: 'An email has been sent for verification.',
    forgetDone: 'An email with the password reset link has been sent your inbox',
    registerAbort: 'Failed to register a account.',
    invalidCredential: 'Invalid username or password.',
    unverified: 'Please verify your email first.'
  },

  avatarMenu: {
    edit: 'Edit profile',
    preferences: 'Preferences',
    logout: 'Sign out',
    about: 'About',
    status: {
      online: 'Online',
      doNotDisturb: 'Do not disturb',
      appearOffline: 'Appear offline'
    }
  },

  search: {
    all: 'All',
    users: 'Users',
    groups: 'Groups',
    channels: 'Channels',
    seconds: 'seconds',
    notFound: 'No results found for {keyword}'
  },

  settings: {
    label: 'Settings',
    apply: 'Apply',
    OK: 'OK',
    tabs: {
      profile: 'Profile',
      security: 'Security',
      storage: 'Storage',
      network: 'Network',
      preferences: 'Preferences'
    },

    autoLaunch: 'Launch at login',
    autoLogin: 'Auto login',
    behavior: 'Behavior',
    notification: 'Notification',
    enableNotification: 'Desktop notification',
    slientMode: 'Slient mode',
    deleteAccount: 'Delete account',
    deleteAccountTips: 'If you delete your account, there is no going back.',
    confirmDeleteTitle: 'Please enter your username',
    deleted: 'Your account has been deleted',
    delete: 'Delete',
    invalidPassowrd: 'Invalid password',
    networkProxy: 'Network proxy',
    networkProxyDisable: 'Disable proxy',
    networkProxySystemSettings: 'Use system proxy settings',
    networkProxyCustom: 'Use custom proxy',
    passwordResetInfo: 'We will send you an email with a link to reset your password.'
  },

  chatPanel: {
    send: 'Send',
    message: 'Mesasge'
  },

  common: {
    ok: 'Ok',
    add: 'Add',
    send: 'Send',
    cancel: 'Cancel',
    invalid: 'Invalid',
    slientMode: 'Slient mode',
    required: 'Required',
    upload: 'Upload',
    unavailable: 'Unavailable',
    connectError: 'Failed to connect to server.',
    serverError: 'Internal Server Error',
    frequency: 'Too many request, please try agin after a while.',
    timeout: 'Request timeout, please check your network connect status.',
    accessDenied: 'You are not authorized to perform this action.',
    badRequest: 'Bad Request',
    fileSizeLimit: 'The file you are trying to upload is over {maxFileSize}',
    group: 'Group',
    alias: 'Alias'
  },

  tabs: {
    chat: 'Chat',
    contacts: 'Contacts',
    groups: 'Groups',
    channels: 'Channels',
    search: 'Search'
  }
};
