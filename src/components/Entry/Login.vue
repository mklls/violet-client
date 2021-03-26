<template>
  <div class="q-gutter-y-sm" @keyup.enter="login">
    <q-input
      outlined
      ref="email"
      class="bigger-input-font"
      :placeholder="$t('email')"
      :rules="[
        val => !!val || this.$t('common.required'),
        val => RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
          .test(val) || this.$t('common.invalid')
      ]"
      v-model="$_email"
    >
      <template v-slot:prepend>
        <q-icon name="mail_outline"/>
      </template>
    </q-input>

    <q-input
      outlined
      ref="password"
      class="bigger-input-font"
      :label="$t('password')"
      :rules="[
        val => !!val || $t('common.required'),
        val => (val.length >= 8 && val.length <= 32) || $t('entry.passwordTips.length')
      ]"
      :type="isPwd ? 'password' : 'text'"
      v-model="$_password"
    >
      <template v-slot:prepend>
        <q-icon name="password"/>
      </template>
      <template v-slot:append>
        <q-icon
          class="cursor-pointer"
          :name="isPwd ? 'visibility_off' : 'visibility'"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>

    <q-btn
      @click='login'
      no-caps
      :loading="loading"
      class="q-mt-sm full-width bg-purple-6 text-white"
      :label="$t('entry.login')"
    />

    <q-btn
      @click='openReset = true'
      flat
      unelevated
      no-caps
      class="q-mt-sm full-width text-purple"
      :label="$t('entry.forgetPassword')"
    />

    <q-dialog v-model="openReset">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ $t('entry.passwordReset') }}</div>
        </q-card-section>

        <q-card-section>
          <q-input
            ref="resetEmail"
            autofocus
            filled
            style="width: 300px; font-size: 1.2em"
            v-model="email"
            :rules="[(val) => /^\w+@\w+\.\w+$/.test(val) || $t('common.invalid')]"
          >
            <template v-slot:prepend>
              <q-icon name="mail_outline" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-section class="text-teal" align="right">
          <q-btn flat no-caps :label="$t('common.cancel')" v-close-popup />

          <q-btn flat no-caps :label="$t('common.send')" :loading="requesting" @click="forgetPassword">
            <template v-slot:loading v-if="delay">
              {{ countdown }}
            </template>
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<style lang="scss" scoped>

</style>

<script>
export default {
  name: 'login-panel',
  props: ['email', 'password'],

  data () {
    return {
      isPwd: true,
      // 登录中
      loading: false,
      // 请求重置中
      requesting: false,
      // 开启延时
      delay: false,
      // 倒计时
      countdown: 60,
      openReset: false,
      disableBtn: false
    };
  },

  computed: {
    $_email: {
      get: function () { return this.email; },
      set: function (val) { this.$emit('update:email', val); }
    },
    $_password: {
      get: function () { return this.password; },
      set: function (val) { this.$emit('update:password', val); }
    }
  },

  methods: {
    async login () {
      if (!this.$refs.email.validate() ||
          !this.$refs.password.validate()) {
        return;
      }

      this.loading = true;

      const goHome = () => {
        this.loading = false;
        this.$router.replace('/home/chat');
      };

      const [status, code] = await this.$store.dispatch('login', {
        credential: {
          email: this.email,
          password: this.password
        },
        cb: goHome.bind(this)
      });

      this.loading = false;

      if (status !== 200) {
        return;
      }

      if (code === this.$status.UNVERIFIED) {
        this.$q.notify({ type: 'warning', message: this.$t('entry.unverified') });
      } else if (code === this.$status.INVALID_CREDENTIAL) {
        this.$q.notify({ type: 'negative', message: this.$t('entry.invalidCredential') });
      }
    },

    async forgetPassword () {
      this.requesting = true;
      const httpStatus = await this.$store.dispatch('forgetPassword', this.email);
      if (httpStatus === 200) {
        this.$q.notify({ type: 'positive', message: this.$t('entry.forgetDone') });
        this.delay = true;
        const timer = setInterval(() => {
          this.countdown--;

          if (this.countdown <= 0) {
            this.requesting = false;
            this.delay = false;
            this.countdown = 60;
            clearInterval(timer);
          }
        }, 1000);
      } else {
        this.requesting = false;
      }
    }
  },
  created () {
    this.log = this.$debug.extend('login');
  },
  mounted () {
    if (this.$EStore.get('autoLogin') && !this.$store.getters.manualLogout) {
      this.login();
    }
  }
};
</script>
