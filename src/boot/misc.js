import vue from 'vue';
import os from 'os';

vue.prototype.$versions = process.versions;
vue.prototype.$versions.os = os.type() + ' ' + os.release();
vue.prototype.$versions.violet = '1.0.0';
vue.prototype.$versions.vue = vue.version;
