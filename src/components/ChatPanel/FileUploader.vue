<template>
  <q-dialog v-model="$_open" transition-show="jump-up" transition-hide="jump-up">
    <q-card>
      <q-card-section style="padding-bottom:0">
        <q-file
          filled
          ref="picker"
          :max-file-size="maxFileSize"
          :rules="[val => !!val || $t('common.required')]"
          v-model="file"
          style="width: 250px;max-width: 280px"
          :loading="uploading"
        >
        </q-file>
      </q-card-section>

      <q-card-actions align="right" style="padding: 8px 16px 16px">
        <q-btn
          flat
          no-caps
          class="q-px-sm text-white bg-teal"
          icon="cloud_upload"
          align="between"
          :label="$t('chatPanel.send')"
          :loading="uploading"
          @click="upload"
        >
          <template v-slot:loading>
            <q-spinner/>
          </template>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
// import fs from 'fs';
// import path from 'path';
export default {
  name: 'file-uploader',
  data () {
    return {
      file: null,
      uploading: false,
      cdn: process.env.CDN,
      percentage: 0
    };
  },

  props: {
    open: {
      type: Boolean,
      default: false,
      reqired: true
    },

    options: {
      avatar: {
        type: Boolean,
        default: false
      },
      banner: {
        type: Boolean,
        default: false
      },
      channel: {
        type: Boolean,
        default: false
      },
      group: {
        type: Boolean,
        default: false
      }
    }
  },

  computed: {
    $_open: {
      get: function () {
        return this.open;
      },
      set: function (val) {
        this.$emit('update:open', val);
      }
    },
    token: {
      get: function () {
        return process.env.accessToken;
      }
    },
    maxFileSize () {
      return process.env.MAX_UPLOAD_FILE_SIZE;
    }
  },

  methods: {
    upload () {
      if (!this.$refs.picker.validate()) {
        return;
      }

      console.log(this.token);
      console.log(this.file);
      this.uploading = true;
      // const url = this.cdn + '/static/0d5c221d9bae490c4fe8fde11e3c8292/application/0d21b0.mkv';
      const form = new FormData();
      form.append('file', this.files);
      this.file = null;
      this.$refs.picker.resetValidation();
      //
      // this.$axios
      //   .get(url, {
      //     onUploadProgress (e) {
      //       console.log(e);
      //     }
      //   })
      //   .then(response => {
      //     console.log(response);
      //   });

      setTimeout(() => (this.uploading = false), 3000);
    }
  }
};
</script>
