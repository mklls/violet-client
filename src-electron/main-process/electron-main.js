import { app, BrowserWindow, nativeTheme, ipcMain, Tray, Menu } from 'electron';
import debug from 'debug';
import Store from 'electron-store';
import path from 'path';
import AutoLaunch from 'auto-launch';

const log = debug('violet');

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'));
  }
} catch (_) { }

const store = new Store({
  encryptionKey: '28c63ad13be1803097268faeeecdd5c1ddbe931e5a8e866581fcfbd9456d1421'
});

console.log('execPath', process.execPath);

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname;
  global.__cache = app.getPath('userData');
} else {
  global.__cache = __statics;
}

let mainWindow;

function setProxy (mode, proxyServer) {
  mode = mode || store.get('enableProxy');
  switch (mode) {
    case 'custom': {
      const { host, port, protocol } = store.get('proxy');
      log('Custom proxy %s:%s.', host, port);
      proxyServer = protocol + host + ':' + port;

      log(proxyServer);
      mainWindow.webContents.session.setProxy({
        proxyRules: proxyServer
      });
      break;
    }
    case 'system': {
      log('Auto detect proxy');
      mainWindow.webContents.session.setProxy({ mode: 'system' });
      break;
    }
    case 'disable':
    default:
      log('Disable proxy');
      mainWindow.webContents.session.setProxy({ mode: 'direct' });
      break;
  }
}

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1340,
    height: 800,
    minWidth: 860,
    minHeight: 600,
    useContentSize: true,
    frame: false, // <-- add this
    title: 'Violex',
    icon: path.resolve(__statics, 'favicon-128x128.png'),
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,
      webSecurity: process.env.NODE_ENV !== 'development'
      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  });

  console.log('cnni', process.env.APP_URL);
  mainWindow.loadURL(process.env.APP_URL);
  setProxy();

  mainWindow.on('maximize', () => mainWindow.webContents.send('window resize', 'max'));
  mainWindow.on('unmaximize', () => mainWindow.webContents.send('window resize', 'restore'));
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  console.log('___________________');
  console.log(__statics);
  console.log('___________________');
}
process.on('uncaughtException', function (error) {
  console.log(error);
});
// eslint-disable-next-line no-unused-vars
let tray = null;
app.on('ready', createWindow);
app.whenReady().then(() => {
  const icon = path.resolve(__statics, 'favicon-128x128.png');
  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    { role: 'close' },
  ]);
  tray.setContextMenu(contextMenu);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('minimize', () => mainWindow.minimize());
ipcMain.on('maximize', () => mainWindow.maximize());
ipcMain.on('unmaximize', () => mainWindow.unmaximize());
ipcMain.on('get locale', () => {
  mainWindow.webContents.send('locale', app.getLocale());
});

ipcMain.on('set proxy', (e, a) => {
  setProxy(a.mode, a.proxyServer);
});

ipcMain.on('auto', (e, enable) => {
  const auto = new AutoLaunch({
    name: 'Violet'
  });

  log('Auto launch %s', enable);

  if (enable) {
    auto.enable();
  } else {
    auto.disable();
  }
});

// see you
ipcMain.on('quit', () => {
  // do something;

  app.quit();
});
