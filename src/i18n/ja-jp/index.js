export default {
  username: 'ユーザー名 ',
  name: '名前',
  originalName: '名前',
  email: 'Eメール ',
  password: 'パスワード ',

  entry: {
    login: 'ログイン',
    register: 'サインアップ',
    forgetPassword: 'パスワードを忘れました',
    passwordReset: 'パスワードリセット',

    nameTips: {
      length: '名前は1～50文字でお願いします。'
    },
    usernameTips: {
      be: 'ユーザー名はアルファベットと数字で構成してください。',
      startWith: 'ユーザー名はアルファベットで始めてください。',
      length: 'ユーザー名は2～16文字の間にしてください。',
      dup: 'ユーザー名はすでに使われています。'
    },
    xnameTips: {
      be: 'アルファベットと数字で構成されているべきです。',
      startWith: '文字で始まるべきです。',
      length: '2～16文字の間で設定してください。',
      dup: '利用できません。'
    },
    passwordTips: {
      length: 'パスワードは8～32文字の間にしてください。',
      symbol: '最低でも特殊な記号を。',
      digit: '最低でも数字を入力してください。',
      uppercase: '最低でも大文字の文字。',
      lowercase: '最低でも小文字の文字。'
    },
    emailTips: {
      dup: '電子メールはすでに取得済みです。'
    },
    registerDone: '確認のためのメールが送信されました。',
    forgetDone: 'パスワード再設定用のリンクが記載されたメールが受信箱に届きました。',
    registerAbort: 'アカウントの登録に失敗しました。',
    invalidCredential: 'ユーザー名またはパスワードが無効です。',
    unverified: 'まずはメールの確認をお願いします。'
  },

  avatarMenu: {
    edit: 'プロフィール編集',
    preferences: 'プリファレンス',
    logout: 'ログアウト',
    about: 'に関しては',
    status: {
      online: 'オンライン',
      doNotDisturb: '邪魔しないでください',
      appearOffline: 'オフラインで表示'
    }
  },

  contextMenu: {
    delete: '友達を削除',
    unsubscribe: 'チャンネル登録解除',
    leave: 'グループを離れる',
    edit: '編集',
    viewProfile: 'プロファイルの表示',
    viewGroup: 'グループ情報を表示',
    viewChannel: 'チャンネル情報を表示',
    deleteChannel: 'チャネルの削除',
    deleteGroup: 'グループの削除',
    enableNotification: '通知を有効にする',
    disableNotification: '通知を無効にする',
    markAsRead: '既読としてマーク'
  },

  search: {
    all: 'すべて',
    users: 'ユーザー',
    groups: 'グループ',
    channels: 'チャネル',
    seconds: '秒',
    notFound: '結果が見つかりません'
  },

  settings: {
    label: '設定',
    apply: '適用',
    OK: 'はい',
    bio: 'バイオ',
    tabs: {
      profile: 'プロファイル',
      security: 'セキュリティ',
      storage: 'ストレージ',
      network: 'ネットワーク',
      preferences: 'プリファレンス'
    },

    autoLaunch: 'ログイン時に起動',
    autoLogin: '自動ログイン',
    behavior: '行動',
    notification: '通知',
    creationDate: '作成日',
    enableNotification: 'デスクトップ通知',
    silentMode: 'サイレントモード',
    deleteAccount: 'アカウントの削除',
    deleteAccountTips: 'アカウントを削除すると、元に戻すことはできません。',
    confirmDeleteTitle: 'ユーザー名を入力してください',
    deleted: 'アカウントが削除されました',
    delete: '削除',
    invalidPassowrd: '無効なパスワード',
    networkProxy: 'ネットワークプロキシ',
    networkProxyDisable: 'プロキシを無効にする',
    networkProxySystemSettings: 'システムプロキシ設定を使用する',
    networkProxyCustom: 'カスタムプロキシを使用する',
    passwordResetInfo: 'パスワードをリセットするためのリンクが記載されたメールをお送りします。',
    language: '言語'
  },

  chatPanel: {
    send: '送信',
    message: 'メッセージ',
    typing: 'タイピング',
    upload_video: '動画のアップロード',
    upload_audio: 'オーディオのアップロード',
    upload_file: 'ファイルのアップロード'
  },

  common: {
    ok: 'はい',
    add: '追加',
    tag: 'タグ',
    send: '送信',
    cancel: 'キャンセル',
    video: 'ビデオ',
    audio: 'オーディオ',
    image: ' 画像',
    file: 'ファイル',
    invalid: '無効',
    silentMode: '静かなモード',
    required: '必須アイテム',
    upload: 'アップロード',
    unavailable: '利用不可',
    connectError: 'サーバー接続に失敗しました。',
    serverError: 'サーバー内部エラー。',
    frequency: 'リクエストの頻度が高すぎます。しばらくしてからもう一度お試しください。',
    timeout: 'リクエストがタイムアウトしました。ネットワーク接続が正常かどうかを確認してください。',
    accessDenied: '許可されていません',
    badRequest: 'リクエストフォーマットエラー',
    fileSizeLimit: 'アップロードしているファイルが {maxFileSize} を超えています',
    group: 'グループ',
    alias: '備考',
    createGroup: 'グループを作成',
    createChannel: 'チャンネルの作成',
    groupname: 'グループ名',
    channelname: 'チャネル名',
    description: '説明',
    name: '名前',
    online: 'オンライン',
    doNotDisturb: 'サイレント',
    offline: 'オフライン',
    subscriber: 'サブスクライバー',
    member: 'メンバー',
    you: 'あなた'
  },

  tabs: {
    chat: 'チャット',
    contacts: '連絡先',
    groups: 'グループ',
    channels: 'チャネル',
    search: '検索'
  }
};
