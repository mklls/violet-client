<template>
  <div class="settings__profile column no-scroll">
    <div class="banner shadow-6 no-select">
      <q-img class="bg" :src="banner || 'fall.png'">
        <div
          style="padding: 30px"
          class="banner-btn banner-btn absolute-right"
        >
          <q-icon
            v-if="!bannerUploading"
            size="40px"
            name="camera"
            class="cursor-pointer absolute-center"
            color="white"
            @click="!(isAvatar = false) && $refs.picker.pickFiles()"
          />

          <q-spinner
            v-else
            size="40px"
            style="position: absolute; bottom: 70px; left: 5px"
          />
        </div>
      </q-img>

      <q-avatar
        class="avatar shadow-6 relative-position"
        text-color="white"
        :color="$color(name)"
        square size="80px"
      >
        <q-img v-if="avatar" :src="avatar"/>
        <div v-else >{{name.split('')[0]}}</div>
        <div class="avatar-btn banner-btn">
          <q-icon
            @click="() => (isAvatar = true) && $refs.picker.pickFiles()"
            size="24px"
            name="camera"
            class="cursor-pointer absolute-center"
            color="white"
          />
        </div>

      </q-avatar>
    </div>

    <div class="q-mt-md profile column col">
      <q-scroll-area class="col">
        <q-item class="q-my-sm" clickable v-ripple>
          <q-item-section avatar>
            <q-avatar text-color="grey">
              <q-icon v-if="!updatingName"  name="person" size="md"/>
              <q-spinner v-else/>
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="bigger-input-font" lines="2">{{ name }}</q-item-label>
            <q-item-label caption lines="1">{{ $t('name') }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="edit" color="grey" />
          </q-item-section>

          <q-popup-edit v-model="newName" :validate="val => val.length > 0 && newName !== name" @before-show="newName = name">
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

        <q-item class="q-my-sm" clickable v-ripple>
          <q-item-section avatar>
            <q-avatar text-color="grey">
              <q-icon name="alternate_email" size="md"/>
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="bigger-input-font" lines="2">{{ username }}</q-item-label>
            <q-item-label caption lines="1">{{ $t('username') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item class="q-my-sm" clickable v-ripple>
          <q-item-section avatar>
            <q-avatar text-color="grey">
              <q-icon name="fingerprint" size="md"/>
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="bigger-input-font" lines="2">{{ id }}</q-item-label>
            <q-item-label caption lines="1">id</q-item-label>

          </q-item-section>
        </q-item>

        <q-item class="q-my-sm" clickable v-ripple>
          <q-item-section avatar>
            <q-avatar text-color="grey">
              <q-icon name="cake" size="md"/>
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="bigger-input-font" lines="2">{{ $moment(createdAt).format('YYYY-MM-DD') }}</q-item-label>
            <q-item-label caption lines="1">{{ $t('settings.creationDate') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-input
          counter
          autogrow
          v-model="newBio"
          maxlength="128"
          class="bigger-input-font"
          style="padding: 8px 16px"
          :label="$t('settings.bio')"
          @blur="setBio"
          :loading="loading"
        />
      </q-scroll-area>
    </div>

    <q-file
      ref="picker"
      style="display: none"
      @input="handlePick"
      v-model="file"
      accept="image/*"
      :max-file-size='8 * 1024 * 1024'
      @rejected="reject"
    />

    <q-dialog
      content-class="cropper-dialog flex flex-center relative"
      v-model="openCropper"
    >
      <div
        class="relative-position"
        style="overflow: hidden !important; height: 600px; max-width: 80vw; max-height: 75vh"
      >
        <cropper
          ref="cropper"
          class="cropper"
          :auto-zoom="true"
          :stencil-props="{ aspectRatio: 1 }"
          :src="image">
        </cropper>

        <div class="absolute-bottom cropper-control row flex flex-center justify-center content-center">
          <q-btn
            unelevated
            icon="flip"
            color="black"
            class="cropper-btn text-white q-ma-sm"
            size="md"
            dense
            @click="flip(true, false)"
          />

          <q-btn
            unelevated
            dense
            icon="flip"
            style="transform: rotate(90deg)"
            color="black"
            class="cropper-btn text-white q-ma-sm"
            size="md"
            @click="flip(false,true)"
          />

          <q-btn
            unelevated
            dense
            color="black"
            class="cropper-btn text-white q-ma-sm"
            size="md"
            icon="rotate_left"
            @click="rotate(-90)"
          />

          <q-btn
            unelevated
            dense
            color="black"
            class="cropper-btn text-white q-ma-sm"
            size="md"
            icon="rotate_right"
            @click="rotate(90)"
          />

          <q-btn
            unelevated
            dense
            color="black"
            class="cropper-btn text-white q-ma-sm"
            size="md"
            icon="camera"
            @click="$refs.picker.pickFiles()"
          />

          <q-btn
            unelevated
            dense
            color="black"
            @click="uploadAvatar"
            :loading="uploading"
            class="cropper-btn text-white q-ma-sm"
            size="md"
            icon="done"
          />

        </div>
      </div>
    </q-dialog>

  </div>
</template>

<style lang="scss">
.cropper-dialog {
  .cropper-control {
    min-height: 48px;

    .cropper-btn {
      margin-bottom: -75px;
      transition: all 0.5s;
      position: relative;
    }

    &:hover .cropper-btn { margin-bottom: 8px; }
  }

  //.cropper { &:hover + .cropper-control .cropper-btn { margin-bottom: 8px; }}
}

.settings__profile {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;

  .banner {
    flex-flow: row nowrap;
    height: 180px;
    width: 100%;
    justify-content: center;
    align-items: center;
    display: flex;
    position: relative;
    border-radius: 5px;

    & > .q-img { border-radius: 5px; }

    & > .q-avatar {
      border-radius: 50%;
      position: absolute;
      left: 8px;
      bottom: 8px;
    }

    .bg  {
      height: 180px;
      .banner-btn {
        transition: 0.5s all;
        transform: rotate(-45deg) translate(115px, -45px);
      }

      &:hover .banner-btn {
        transform: rotate(-45deg) translate(55px, -43px);
      }
    }

    .avatar {
      overflow: hidden;

      .avatar-btn {
        background: rgba(0, 0, 0, 0.47);
        position: absolute;
        padding: 16px 40px;
        bottom: -32px;
        transition: all 0.5s;
      }

      &:hover .avatar-btn {
        bottom: 0;
      }
    }
  }

  .profile {
      width: 100%;
      border-radius: 10px;
      background: #f5f5f5;
  }
}
</style>

<script>
import { mapGetters } from 'vuex';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

export default {
  name: 'profile',
  components: { Cropper },
  data () {
    return {
      openCropper: false,
      image: '',
      newName: '',
      file: [],
      // 修改名称中
      loading: false,
      updatingName: false,
      newBio: '',
      // 头像上传中
      uploading: false,
      // 收否上传头像
      isAvatar: true,
      // 横幅上传中
      bannerUploading: false
    };
  },

  computed: {
    ...mapGetters({
      id: 'me/id',
      avatar: 'me/avatar',
      banner: 'me/banner',
      bio: 'me/bio',
      email: 'me/email',
      name: 'me/name',
      username: 'me/username',
      createdAt: 'me/createdAt'
    })
  },

  methods: {
    async setName () {
      if (this.name === this.newName || this.newName.length === 0) return;

      this.updatingName = true;
      await this.$store.dispatch('me/update', { name: this.newName });
      this.updatingName = false;
    },

    async setBio () {
      if (this.newBio === this.bio) return;
      this.loading = true;
      await this.$store.dispatch('me/update', { bio: this.newBio });
      this.loading = false;
    },

    reject (e) {
      this.$q.notify({
        message: this.$t('common.fileSizeLimit', { maxFileSize: '8 MiB' }),
        type: 'negative'
      });
    },

    async handlePick (f) {
      this.image = f.path;
      if (this.isAvatar) {
        this.openCropper = true;
      } else {
        this.bannerUploading = true;
        await this.$store.dispatch('me/uploadBanner', { image: f });
        this.bannerUploading = false;
      }
    },

    rotate (angel) {
      this.$refs.cropper.rotate(angel);
    },

    flip (x, y) {
      this.$refs.cropper.flip(x, y);
    },

    uploadAvatar () {
      const { canvas } = this.$refs.cropper.getResult();
      if (!canvas) { return; }

      this.uploading = true;
      canvas.toBlob(blob => {
        this.$store
          .dispatch('me/uploadAvatar', { image: blob })
          .then(() => {
            this.uploading = false;
            this.openCropper = false;
          })
          .catch(() => {
            this.uploading = false;
          });
      });
    }
  },

  created () {
    this.newBio = this.bio;
  }
};
</script>
