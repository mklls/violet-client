<template>
  <q-layout class="row justify-center full-width">
    <layout-header :logged=false />
    <q-img
      src="https://w.wallhaven.cc/full/ey/wallhaven-eyogzr.jpg"
      class="absolute full-height"
    >
    </q-img>
    <div class="row margin-top justify-center">
      <q-card class="login-window shadow-3">
        <q-tabs v-model="tab" class="text-purple">
          <q-tab name="register" no-caps :label="$t('entry.register')"/>
          <q-tab name="login"  no-caps :label="$t('entry.login')"/>
        </q-tabs>

        <q-separator />

        <q-tab-panels
          v-model="tab"
          class="text-teal animate__animated animate__fadeIn"
          keep-alive
        >
          <q-tab-panel name="register" class="animate__animated animate__fadeIn">
            <register :name.sync="name" :email.sync="email" :password.sync="password" :username.sync="username"/>
          </q-tab-panel>
          <q-tab-panel name="login" class="animate__animated animate__fadeIn">
            <login :email.sync="email" :password.sync="password"/>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>

    </div>
  </q-layout>
</template>

<style lang="scss" scoped>
.margin-top {
  margin-top: 42px;
}
.login-window {
  width: 350px;
  margin: 10vh auto auto;
  height: fit-content;
  .q-input {
    font-size: 1.3em;
  }
}
</style>

<script>
import LayoutHeader from 'components/Header/LayoutHeader';
import Login from 'components/Entry/Login';
import Register from 'components/Entry/Register';
import fs from 'fs';
import path from 'path';

export default {
  name: 'auth',
  components: { LayoutHeader, Login, Register },
  data () {
    return {
      name: '',
      username: '',
      email: '',
      password: '',
      tab: 'register'
    };
  },
  methods: {
    push: function () {
      this.$router.replace('/home/chat');
      this.$store.commit('setAuthenticated', true);
    }
  },
  created () {
    this.email = this.$store.commit('io/setPublicKey', fs.readFileSync(path.join(__statics, 'public.pem')));
    this.email = this.$EStore.get('entry.email') || '';
    this.password = this.$EStore.get('entry.password') || '';
    this.tab = this.$EStore.get('entry') ? 'login' : 'register';
  }
};
</script>
