<template>
  <q-dialog
    class="friend-edit-dialog"
    v-model="$_open"
    transition-show="fade"
    transition-hide="fade"
    @keyup.enter="handleAction"
  >
    <q-card class="add-friend">
      <q-card-section>
        <q-input
          maxlength="10"
          type="text"
          class="bigger-input-font-1"
          list="tags"
          v-model="tag"
          :label="$t('common.tag')"/>
        <q-input class="bigger-input-font-1" v-model="alias" :label="$t('common.alias')"/>

        <datalist id="tags">
          <option v-for="tag in tags" :value="tag || $t('tabs.contacts')" :key="tag"/>
        </datalist>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          :label="$t(action)"
          :loading="loading"
          @click="handleAction"
          text-color="primary"
          unelevated
          no-caps
        />

        <q-btn
          :label="$t('common.cancel')"
          unelevated
          no-caps
          v-close-popup
          text-color="primary"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="scss">
.friend-edit-dialog {
  .add-friend {
    height: 200px;
  }
}
</style>

<script>
export default {
  name: 'friend-edit-dialog',
  props: {
    open: {
      default: false,
      type: Boolean
    },
    profile: {
      type: Object
    }
  },

  data () {
    return {
      loading: false,
      tag: '',
      alias: ''
    };
  },

  computed: {
    action () {
      return this.added ? 'common.ok' : 'common.add';
    },
    added () {
      return !!this.$store.getters['rel/findFriendByUsername'](this.profile.username);
    },

    $_open: {
      get () {
        return this.open;
      },
      set (val) {
        this.$emit('update:open', val);
      }
    },

    tags () {
      return this.$store.getters['rel/tags'];
    }
  },

  methods: {
    handleAction () {
      if (this.added) {
        this.updateFriend();
      } else {
        this.addFriend();
      }
    },

    async addFriend () {
      this.loading = true;

      const [httpStatus, code] = await this.$store.dispatch('rel/addFriend', {
        username: this.profile.username,
        alias: this.alias,
        tag: this.tag === this.$t('tabs.contacts') ? '' : this.tag
      });

      this.loading = false;

      if (httpStatus === 200 && code === this.$status.OK) {
        this.$_open = false;
      }
      this.alias = '';
    },

    async updateFriend () {
      this.loading = true;

      if (this.tag === this.$t('tabs.contacts')) {
        this.tag = '';
      }

      const [httpStatus, code] = await this.$store.dispatch('rel/updateFriend', {
        username: this.profile.username,
        alias: this.alias,
        tag: this.tag
      });

      if (httpStatus === 200 && code === this.$status.OK) {
        this.$_open = false;
      }

      this.loading = false;
      this.alias = '';
    }
  },

  created () {
    this.tag = this.profile.tag || this.$t('tabs.contacts');
    this.alias = this.profile.alias || '';
  }
};

</script>
