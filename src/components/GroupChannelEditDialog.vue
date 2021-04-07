<template>
  <q-dialog v-model="$_open" class="edit-dialog bigger-input-font" transition-show="jump-right" transition-hide="jump-right">
    <q-card class="column" style="width: 380px; max-height: 90vh;">
      <q-img
        class="avatar-banner"
        height="200px"
        :src="profile.avatar || image || 'fall.png'">
          <q-icon
            v-if="!uploading"
            class="absolute-top-right tr-btn"
            size="md"
            color="white"
            @click="$refs.picker.pickFiles()"
            name="camera"
          />
          <q-spinner
            v-else
            class="absolute-top-right tr-btn"
            size="lg"
            color="white"
            name="camera"
          />
      </q-img>

      <q-scroll-area class="col q-py-xs" style="height: 300px">
        <q-list class="q-mr-md" v-if="create">

          <q-item class="q-py-none">
            <q-item-section avatar>
              <q-avatar text-color="grey">
                <q-icon size="32px" name="face"/>
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-input
                ref="name"
                :label="$t('common.name')"
                v-model="name"
                :rules="nameRules"
                maxlength="50"
                input-class="bigger-input-font"
                type="text"
              >
                <template v-slot:append v-if="nameAvailable">
                  <q-icon name="check" color="green"/>
                </template>
              </q-input>
            </q-item-section>
          </q-item>

          <q-item class="q-py-none">
            <q-item-section avatar>
              <q-avatar text-color="grey">
                <q-btn @click="createGroup = !createGroup">
                  <q-icon size="32px" :name="createGroup ? 'group': 'campaign'"/>
                </q-btn>
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-input
                ref="xname"
                v-model="xname"
                :rules="xnameRules"
                :loading="checkingXname"
                :label="$t(createGroup ? 'common.groupname' : 'common.channelname')"
                maxlength="16"
                input-class="bigger-input-font"
                type="text"
              >
                <template v-slot:append v-if="xnameAvailable">
                  <q-icon name="check" color="green"/>
                </template>
              </q-input>
            </q-item-section>
          </q-item>

          <q-item class="q-py-none q-pb-sm">
            <q-item-section avatar style="justify-content: flex-start">
              <q-avatar text-color="grey">
                <q-icon size="32px" name="info"/>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-input
                class="shrink-textarea-padding"
                autogrow
                :label="$t('common.description')"
                v-model="description"
                maxlength="255"
                counter
                type="textarea"
                input-class="full-width bigger-input-font"
              />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section class="relative-position">
              <q-btn
                color="primary"
                no-caps
                unelevated
                :label="$t(createGroup ? 'common.createGroup': 'common.createChannel')"
                text-color="white"
                class="absolute-right"
                @click="submit"
                style="right: 0"
              />
            </q-item-section>
          </q-item>
        </q-list>

        <q-list v-else class="q-my-sm">
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-avatar>
                <q-avatar text-color="grey">
                  <q-icon v-if="!updatingName" :name="isGroup ? 'group': 'campaign'" size="md"/>
                  <q-spinner v-else/>
                </q-avatar>
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="bigger-input-font" lines="2">{{ profile.name }}</q-item-label>
              <q-item-label caption lines="1">{{ $t('name') }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="edit" color="grey" />
            </q-item-section>

            <q-popup-edit
              v-model="newName"
              :validate="val => val.length > 1 && newName !== profile.name"
              @before-show="newName = profile.name"
            >
              <template v-slot="{ initialValue, value, emitValue, validate, set }">
                <q-input
                  @keyup.enter="set && setName()"
                  autofocus
                  dense
                  maxlength="50"
                  counter
                  class="bigger-input-font-1"
                  :value="newName"
                  :rules="[ val => validate(value) || $t('common.invalid') ]"
                  @input="emitValue"
                >
                  <template v-slot:after>
                    <q-btn
                      icon="done"
                      unelevated
                      text-color="positive"
                      dense
                      v-close-popup
                      @click.stop="set && setName()"
                      :disable="validate(value) === false || initialValue === value"
                    />
                  </template>
                </q-input>
              </template>
            </q-popup-edit>
          </q-item>

          <q-input
            counter
            autogrow
            v-model="newDescription"
            maxlength="255"
            class="bigger-input-font"
            style="padding: 8px 16px"
            :label="$t('common.description')"
            @blur="setDescription"
            :loading="updatingDescription"
          />

          <q-item
            v-for="u in users"
            :key="u.username"
          >
            <q-item-section avatar>
              <q-avatar :color="$color(u.name)">
                <q-img v-if="u.avatar" :src="u.avatar"/>
                <div v-else>{{ u.name.split('')[0] }}</div>
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label style="font-size: 17px">{{ u.username }}</q-item-label>
              <q-item-label lines="1" caption>{{ u.bio }}</q-item-label>
            </q-item-section>

          </q-item>
        </q-list>

      </q-scroll-area>
    </q-card>

    <q-file
      ref="picker"
      style="display: none"
      @input="handlePick"
      v-model="file"
      accept="image/*"
      :max-file-size='8 * 1024 * 1024'
      @rejected="reject"
    />
  </q-dialog>
</template>

<style lang="scss">

.avatar-banner:hover .tr-btn {
  transform: rotate(360deg);
}

.tr-btn {
  padding: 6px;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  display: inline-block;
  transition: all 1.2s;
  filter: drop-shadow(0 0 1px black);
}

.shrink-textarea-padding {
  textarea {padding: 5px 0 !important};
}
</style>

<script>
export default {
  name: 'group-channel-edit-dialog',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    profile: Object
  },

  data () {
    return {
      xname: '',
      file: [],
      uploading: false,
      xnameAvailable: false,
      nameAvailable: false,
      creating: false,
      createGroup: false,
      image: '',
      name: '',
      description: '',
      checkingXname: false,
      updatingName: false,
      updatingDescription: false,
      newName: '',
      newDescription: '',
      xnameRules: [
        val => !!val || this.$t('common.required'),
        val => RegExp(/^[a-zA-Z]/).test(val) || this.$t('entry.xnameTips.startWith'),
        val => RegExp(/^[a-zA-Z0-9]+$/).test(val) || this.$t('entry.xnameTips.be'),
        val => (val.length >= 2 && val.length <= 16) || this.$t('entry.xnameTips.length')
      ],
      nameRules: [
        val => !!val || this.$t('common.required'),
        val => (val.length >= 1 && val.length <= 50) || this.$t('entry.nameTips.length')
      ]
    };
  },

  computed: {
    isGroup: {
      get () {
        return !!this.profile.groupname;
      }
    },
    $_open: {
      get () {
        return this.open;
      },
      set (val) {
        this.$emit('update:open', val);
      }
    },

    type () {
      return this.isGroup ? this.$t('tabs.group') : this.$t('tabs.channel');
    },

    nameProp () {
      return this.isGroup ? 'groupname' : 'channelname';
    },

    create () {
      return !this.profile.groupname && !this.profile.channelname;
    },

    users () {
      let type, xname, users;

      if (this.isGroup) {
        type = 'rel/findGroupByGroupname';
        xname = this.profile.groupname;
        users = 'members';
      } else {
        type = 'rel/findChannelByChannelname';
        xname = this.profile.channelname;
        users = 'subscribers';
      }

      return this.$store.getters[type](xname)?.[users];
    }
  },

  watch: {
    xname: function () {
      this.xnameAvailable = false;
      this.debounceCheckXname();
    },
    name: function () {
      this.nameAvailable = false;
      if (this.name.length >= 1 && this.name.length <= 50) {
        this.nameAvailable = true;
      }
    }
  },

  methods: {
    reject (e) {
      this.$q.notify({
        message: this.$t('common.fileSizeLimit', { maxFileSize: '8 MiB' }),
        type: 'negative'
      });
    },

    async handlePick (file) {
      this.uploading = true;
      if (this.create) {
        const [httpState, data] = await this.$api.upload({ file });
        if (httpState === 201 && data.code === this.$status.OK) {
          this.image = data.file.url;
        }
      } else {
        const type = this.isGroup ? 'rel/setGroupAvatar' : 'rel/setChannelAvatar';
        const payload = {
          image: file,
          [this.nameProp]:
            this.profile.groupname || this.profile.channelname
        };

        await this.$store.dispatch(type, payload);
      }

      this.uploading = false;
    },

    checkXname () {
      if (this.xname === '') return;

      this.xnameAvailable = false;
      this.checkingXname = true;
      // 调用api检查用户名是否可用
      this.$api.checkXname(this.xname).then(([code, data]) => {
        this.checkingXname = false;

        if (code < 200 || code >= 300) return;

        if (data.code === 100) {
          this.xnameAvailable = true;
        } else {
          // 由于检查可用性是异步操作，所以需要动态添加规则
          this.xnameRules.push(() => this.$t('entry.xnameTips.dup'));
          this.xnameAvailable = false;
          this.$refs.xname.validate();
          this.xnameRules.pop();
        }
      });

      this.checkingXname = false;
    },

    async setName () {
      if (this.newName === this.profile.name || this.newName.length === 0) return;
      let type, key;

      if (this.isGroup) {
        type = 'rel/updateGroup';
        key = 'groupname';
      } else {
        type = 'rel/updateChannel';
        key = 'channelname';
      }
      // vuex 会把变量删除？？？？？？？？？？？？？？？？？？？？？？？
      // console.log('1', this.newName);
      // this.updatingName = true;
      // const [httpStatus, code] = await this.$store.dispatch(type, {
      //   [key]: this.profile[key], payload: { name: 'fuck' }
      // });
      // if (httpStatus === 200 && code === this.$status.OK) {
      // this.newName 值被丢掉了
      //   console.log('2', this.newName); => 2
      //   this.$emit('updateProfileName', this.newName);
      // }
      // this.updatingName = false;

      const back = this.newName;
      this.updatingName = true;
      const [httpStatus, code] = await this.$store.dispatch(type, {
        [key]: this.profile[key], payload: { name: back }
      });
      if (httpStatus === 200 && code === this.$status.OK) {
        this.$emit('updateProfileName', back);
      }
      this.updatingName = false;
    },

    async setDescription () {
      if (this.newDescription === this.profile.description) return;
      let payload, type;

      if (this.isGroup) {
        type = 'rel/updateGroup';
        payload = {
          groupname: this.profile.groupname
        };
      } else {
        type = 'rel/updateChannel';
        payload = {
          channelname: this.profile.channelname
        };
      }

      this.updatingDescription = true;
      payload.payload = { description: this.newDescription };
      const [httpStatus, code] = await this.$store.dispatch(type, payload);
      const back = this.newDescription;

      if (httpStatus === 200 && code === this.$status.OK) {
        this.$emit('updateProfileDescription', back);
      }

      this.updatingDescription = false;
    },

    async submit () {
      if (!this.xnameAvailable || !this.nameAvailable || this.checkXname()) {
        return;
      }

      this.creating = true;
      const type = this.createGroup ? 'rel/createGroup' : 'rel/createChannel';
      const key = this.createGroup ? 'groupname' : 'channelname';
      const payload = {
        [key]: this.xname,
        name: this.name,
        description: this.description,
        avatar: this.image
      };

      const [httpState, code] = await this.$store.dispatch(type, payload);
      this.creating = false;
      if (httpState === 201 && code === this.$status.OK) {
        this.nameAvailable = this.xnameAvailable = false;
        this.name = this.xname = this.image = this.description = '';
        this.$_open = false;
      }
    }
  },

  created () {
    if (this.create) {
      this.xname = this.image = this.description = this.name = '';
    }

    this.debounceCheckXname = this._.debounce(this.checkXname, 800);
  }
};
</script>
