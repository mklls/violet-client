/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
/* eslint-env node */

const SocksProxyAgent = require('socks-proxy-agent');
// const HttpProxyAgent = require('http-proxy-agent');
const agent = new SocksProxyAgent('socks://127.0.0.1:1089');
// const hv = new HttpProxyAgent('http://127.0.0.1:8889');

module.exports = function (ctx) {
  return {
    // https://quasar.dev/quasar-cli/supporting-ts
    supportTS: false,

    // https://quasar.dev/quasar-cli/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://quasar.dev/quasar-cli/boot-files
    boot: [
      'electron-store',
      'textarea',
      'moment',
      'lodash',
      'tinybox',
      'status',
      'debug',
      'axios',
      'misc',
      'i18n'
    ],
    dark: 'auto',

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: [
      'app.scss',
      'animate.css'
    ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      // 'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons' // optional, you are not bound to it
    ],

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      vueRouterMode: 'history', // available values: 'hash', 'history'

      // transpile: false,
      // azure服务器
      env: {
        GIPHY: ctx.dev ? '/giphy' : 'http://api.giphy.com',
        // API: 'https://localhost',
        // IO: 'https://localhost',
        // CDN: 'https://localhost',
        API: ctx.dev ? '/api' : 'https://api.violex.ml',
        IO: ctx.dev ? '' : 'https://api.violex.ml',
        CDN: ctx.dev ? '/cdn' : 'https://cdn.violex.ml',
        SECURE_SOCKETIO: !ctx.dev,
        GIPHY_KEY: 'sjhyEsmgTMw2QJNX2nY7eJQ5VXMoBipr',
        MAX_UPLOAD_FILE_SIZE: 1024 * 1024 * 50,
        // socketio
        IO_PATH: '/ced3acA1F'
      },

      // 本地服务器
      // env: {
      //   GIPHY: ctx.dev ? '/giphy' : 'http://api.giphy.com',
      //   // API: 'https://localhost',
      //   // IO: 'https://localhost',
      //   // CDN: 'https://localhost',
      //   API: 'https://localhost',
      //   IO: 'https://localhost',
      //   CDN: 'https://localhost',
      //   SECURE_SOCKETIO: false,
      //   GIPHY_KEY: 'sjhyEsmgTMw2QJNX2nY7eJQ5VXMoBipr',
      //   MAX_UPLOAD_FILE_SIZE: 1024 * 1024 * 50,
      //   // socketio
      //   IO_PATH: '/ced3acA1F'
      // },

      // Add dependencies for transpiling with Babel (Array of string/regex)
      // (from node_modules, which are by default not transpiled).
      // Applies only if "transpile" is set to true.
      // transpileDependencies: [],

      // rtl: false, // https://quasar.dev/options/rtl-support
      // preloadChunks: true,
      // showProgress: false,
      // gzip: true,
      // analyze: true,

      // Options below are automatically set depending on the env, set them if you want to override
      // extractCSS: false,

      // https://quasar.dev/quasar-cli/handling-webpack
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/
        });
      }
    },

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      https: false,
      host: '127.0.0.1',
      port: 8080,
      open: true, // opens browser window automatically
      proxy: {
        '/giphy': {
          // agent,
          target: 'http://api.giphy.com',
          changeOrigin: true,
          pathRewrite: {
            '^/giphy': ''
          }
        },

        '/api': {
          target: 'https://localhost',
          pathRewrite: { '^/api': '' },
          secure: false,
          changeOrigin: true
        },

        '/ced3acA1F': {
          target: 'https://localhost',
          ws: true,
          pathRewrite: { '^/api': '' },
          secure: false,
          changeOrigin: true
        },
        '/home/violex': {
          target: 'http://localhost:3200',
          secure: false,
          changeOrigin: true,
          pathRewrite: { '^/home/violex': '' }
        },
        // '/api': {
        //   agent,
        //   ws: true,
        //   secure: true,
        //   target: 'https://api.violex.ml',
        //   changeOrigin: true,
        //   pathRewrite: {
        //     '^/api': '/'
        //   }
        //
        // },

        '/cdn': {
          agent,
          target: 'https://cdn.violex.ml',
          changeOrigin: true,
          pathRewrite: {
            '^/cdn': ''
          }
        },
        '/test': {
          target: 'https://cdn.violex.ml',
          changeOrigin: true,
          pathRewrite: {
            '^/test': ''
          }
        }
      }
    },

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      iconSet: 'material-icons', // Quasar icon set
      lang: 'en-us', // Quasar language pack
      config: {
        notify: { position: 'bottom', classes: 'bigger-input-font-2' }
      },

      // Possible values for "importStrategy":
      // * 'auto' - (DEFAULT) Auto-import needed Quasar components & directives
      // * 'all'  - Manually specify what to import
      importStrategy: 'auto',

      // For special cases outside of where "auto" importStrategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: ['Notify']
    },

    animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false
    },

    // https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
      workboxOptions: {}, // only for GenerateSW
      manifest: {
        name: 'Violex',
        short_name: 'Violex',
        description: 'A Quasar Framework app',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
    electron: {
      bundler: 'builder', // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        icon: require('path').join(__dirname, 'src-electron', 'icons', 'icon.ico'),
        name: 'Violex'
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration
        productName: 'Violet',
        appId: 'ml.violex.client',
        directories: {
          output: 'dist'
        },
        compression: 'maximum',
        asar: true,
        linux: {
          target: 'AppImage'
        },
        win: {
          target: '7z',
          icon: './public/icons/icon.ico'
        }
      },

      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: true,

      extendWebpack (/* cfg */) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      }
    }
  };
};
