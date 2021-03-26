<template>
  <div class="q-gutter-y-sm">
    <q-input
      ref="username"
      maxlength="16"
      counter
      outlined
      class="bigger-input-font"
      :placeholder="$t('username')"
      :loading="checkingUsername"
      :rules="usernameRules"
      type="text"
      v-model="$_username"
    >
      <template v-slot:prepend>
        <q-icon name="person"/>
      </template>
      <template v-slot:append v-if="usernameAvaliable">
        <q-icon name="done" color="green"/>
      </template>
    </q-input>

    <q-input
      ref="name"
      outlined
      maxlength="50"
      counter
      class="bigger-input-font"
      :placeholder="$t('name')"
      :rules="nameRules"
      type="text"
      v-model="$_name"
    >
      <template v-slot:prepend>
        <q-icon name="face"/>
      </template>
      <template v-slot:append v-if="nameAvaliable">
        <q-icon name="done" color="green"/>
      </template>
    </q-input>

    <q-input
      ref="email"
      outlined
      :placeholder="$t('email')"
      :rules="emailRules"
      :loading="checkingEmail"
      type="email"
      class="bigger-input-font"
      v-model="$_email"
    >
      <template v-slot:prepend>
        <q-icon name="mail_outline"/>
      </template>
      <template v-slot:append v-if="emailAvaliable">
        <q-icon color="green" name="done"/>
      </template>
    </q-input>

    <q-input
      outlined
      maxlength="32"
      ref="password"
      counter
      :placeholder="$t('password')"
      :rules="passwordRules"
      :type="isPwd ? 'password' : 'text'"
      class="bigger-input-font"
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
      class="full-width bg-purple-6 text-white q-mt-sm"
      :loading="loading"
      no-caps :label="$t('entry.register')"
      @click="register"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>

<script>
export default {
  name: 'login-panel',
  props: ['email', 'password', 'username', 'name'],
  data () {
    return {
      loading: false,
      nameAvaliable: false,
      usernameAvaliable: false,
      emailAvaliable: false,
      // 控制动画
      usernamePass: true,
      passwordPass: true,
      namePass: true,
      emailPass: true,
      // 是否显示密码
      isPwd: true,
      // 密码检查状态
      checkingUsername: false,
      checkingEmail: false,
      // 验证规则
      usernameRules: [
        val => !!val || this.$t('common.required'),
        val => RegExp(/^[a-zA-Z]/).test(val) || this.$t('entry.usernameTips.startWith'),
        val => RegExp(/^[a-zA-Z0-9]+$/).test(val) || this.$t('entry.usernameTips.be'),
        val => (val.length >= 2 && val.length <= 16) || this.$t('entry.usernameTips.length')
      ],
      passwordRules: [
        val => !!val || this.$t('common.required'),
        val => RegExp(/[a-z]/).test(val) || this.$t('entry.passwordTips.lowercase'),
        val => RegExp(/[A-Z]/).test(val) || this.$t('entry.passwordTips.uppercase'),
        val => RegExp(/[0-9]/).test(val) || this.$t('entry.passwordTips.digit'),
        val => RegExp(/['"~!@#$%^&*()_>+=<\-|,.:/\\]/).test(val) || this.$t('entry.passwordTips.symbol'),
        val => (val.length >= 8 && val.length <= 32) || this.$t('entry.passwordTips.length')
      ],
      emailRules: [
        val => !!val || this.$t('common.required'),
        val => RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
          .test(val) || this.$t('common.invalid')
      ],
      nameRules: [
        val => !!val || this.$t('common.required'),
        val => (val.length >= 1 && val.length <= 50) || this.$t('entry.nameTips.length')
      ]
    };
  },
  computed: {
    $_name: {
      get: function () { return this.name; },
      set: function (val) { this.$emit('update:name', val); }
    },
    $_username: {
      get: function () { return this.username; },
      set: function (val) { this.$emit('update:username', val); }
    },
    $_email: {
      get: function () { return this.email; },
      set: function (val) { this.$emit('update:email', val); }
    },
    $_password: {
      get: function () { return this.password; },
      set: function (val) { this.$emit('update:password', val); }
    }
  },
  watch: {
    username: function () {
      this.usernameAvaliable = false;
      this.debounceCheckUsername();
    },
    email: function () {
      this.emailAvaliable = false;
      this.debounceCheckEmail();
    },
    name: function () {
      this.nameAvaliable = false;
      this.$refs.name.validate() && (this.nameAvaliable = true);
    }
  },

  methods: {
    checkUsername () {
      if (!this.$refs.username.validate()) return;

      this.usernameAvaliable = false;
      this.checkingUsername = true;
      // 调用api检查用户名是否可用
      this.$api.checkXname(this.username).then(([code, data]) => {
        this.checkingUsername = false;

        if (code < 200 || code >= 300) return;

        if (data.code === 100) {
          this.usernameAvaliable = true;
        } else {
          // 由于检查可用性是异步操作，所以需要动态添加规则
          this.usernameRules.push(
            () => this.$t('entry.usernameTips.dup')
          );
          this.usernameAvaliable = false;
          this.$refs.username.validate();
          this.usernameRules.pop();
        }
      });
    },
    checkEmail () {
      if (!this.$refs.email.validate()) return;

      this.checkingEmail = true;
      this.emailAvaliable = false;
      this.$api.checkEmail(this.email).then(([code, data]) => {
        this.checkingEmail = false;
        if (code < 200 || code >= 300) return;

        if (data.code === 100) {
          this.emailAvaliable = true;
        } else {
          this.emailRules.push(
            () => this.$t('entry.emailTips.dup')
          );
          this.emailAvaliable = false;
          this.$refs.email.validate();
          this.emailRules.pop();
        }
      });
    },

    register () {
      if (!this.$refs.password.validate() ||
        !this.$refs.email.validate() ||
        !this.$refs.name.validate() ||
        !this.$refs.username.validate() ||
        !this.usernameAvaliable ||
        !this.emailAvaliable ||
        !this.nameAvaliable) {
        // 防止自动载入上次登录信息的情况下不显示邮箱重复
        this.debounceCheckEmail();
        this.debounceCheckUsername();
        this.checkEmail();
        return;
      }

      this.loading = true;
      this.$api.register({
        name: this.name,
        username: this.username,
        email: this.email,
        password: this.password
      }).then(([code]) => {
        this.loading = false;

        if (code === 201) {
          this.$q.notify({ type: 'positive', message: this.$t('entry.registerDone') });
        } else {
          this.$q.notify({ type: 'negative', message: this.$t('entry.registerAbort') });
        }
      });
    }
  },
  created () {
    this.debounceCheckUsername = this._.debounce(this.checkUsername, 800);
    this.debounceCheckEmail = this._.debounce(this.checkEmail, 800);
    if (this.email) {
      this.debounceCheckEmail();
    }
  }
};
</script>
