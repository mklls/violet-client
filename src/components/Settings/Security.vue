<template>
  <div class="column">
    <div class="q-mb-sm text-h6">{{$t('entry.passwordReset')}}</div>

    <div class="caption q-mb-sm text-grey-10 bigger-input-font-1">
      {{ $t('settings.passwordResetInfo') }}
    </div>

    <div class="action">
      <q-btn
        no-caps
        text-color="primary"
        unelevated
        outline
        :loading="loading"
        @click="resetPassword"
        :label="$t('common.send')"
      >
        <template v-slot:loading>
          {{ countdownForResetPassword }}
        </template>
      </q-btn>
    </div>

    <div class="q-mt-md q-mb-sm text-h6">{{$t('settings.deleteAccount')}}</div>

    <div class="caption q-mb-sm text-grey-10 bigger-input-font-1">
      {{ $t('settings.deleteAccountTips') }}
    </div>

    <div class="action">
      <q-btn
        no-caps
        text-color="red"
        unelevated
        outline
        @click="confirmDeleteAccount"
        :label="$t('settings.delete')"
      >
        <template v-slot:loading>
          {{ countdownForDeleteAccount }}
        </template>
      </q-btn>
    </div>

    <q-dialog v-model="openDialog">
      <q-card>
        <q-card-section class="bigger-input-font-x">
          {{ $t('settings.confirmDeleteTitle') }}
        </q-card-section>

        <q-card-section class="q-py-none">
          <q-input
            ref="username"
            color="red"
            prefix="@"
            class="bigger-input-font"
            v-model="username"
            outlined
            :rules="[val => this.$store.getters['me/username'] === val || $t('common.invalid')]"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            dense
            no-caps
            color="red"
            @click="deleteAccount"
            :label="$t('settings.delete')"
          />

          <q-btn
            dense
            flat
            v-close-popup
            no-caps
            :label="$t('common.cancel')"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<style lang="scss">

</style>

<script>
export default {
  name: 'security',
  data () {
    return {
      loading: false,
      nextEmail: false,
      isPwd: true,
      countdownForResetPassword: 60,
      username: '',
      openDialog: false,
      password: '',
      confirmCountdown: 10
    };
  },

  computed: {
    email: {
      get () {
        return this.$store.getters['me/email'];
      }
    }
  },

  methods: {
    async resetPassword () {
      this.loading = true;
      const [httpStatus] = await this.$api.resetPassword();

      if (httpStatus === 200) {
        this.$q.notify({ message: this.$t('entry.forgetDone'), type: 'positive' });
        this.nextEmail = true;
        const timer = setInterval(() => {
          this.countdownForResetPassword--;

          if (this.countdownForResetPassword <= 0) {
            this.countdownForResetPassword = 60;
            this.nextEmail = false;
            this.loading = false;

            clearInterval(timer);
          }
        }, 1000);
      } else {
        this.loading = false;
      }
    },
    async confirmDeleteAccount () {
      this.openDialog = true;
    },
    async deleteAccount () {
      if (!this.$refs.username.validate()) {
        return;
      }
      const [httpStatus] = await this.$store.dispatch('me/deleteAccount');

      if (httpStatus === 200) {
        this.$EStore.delete('entry.email');
        this.$EStore.delete('entry.password');
        this.$q.notify({ message: this.$t('settings.deleted'), type: 'info' });
        this.openDialog = false;
        this.$emit('logout');
      }
    }
  }
};
</script>
