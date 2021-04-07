<template>
  <q-dialog v-model="$_open" transition-show="jump-up" transition-hide="jump-up">
    <q-card>
      <q-card-section style="padding-bottom:0">
        <q-file
          filled
          ref="picker"
          :max-file-size="maxFileSize"
          v-model="file"
          style="width: 250px;max-width: 280px"
          :loading="uploading"
          @rejected="reject"
          @input="$emit('select', file)"
        >
        </q-file>
      </q-card-section>

      <q-card-actions align="right" style="padding: 8px 16px 16px">
        <q-btn
          :disable="!file"
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
    },

    onUploadProgress: {
      type: Function,
      default: Function.prototype
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
      return parseInt(process.env.MAX_UPLOAD_FILE_SIZE, 10);
    }
  },

  methods: {
    reject (v) {
      this.$q.notify({
        type: 'negative',
        message: this.$t('common.fileSizeLimit', { maxFileSize: this.$readableBytes(this.maxFileSize) })
      });
    },
    async upload () {
      if (!this.file) {
        return;
      }

      const originalType = this.file.type.split('/')[0];
      this.file.fileType = originalType;

      if (originalType !== 'video' && originalType !== 'audio' && originalType !== 'image') {
        this.file.fileType = 'file';
      }

      this.$emit('start', this.file);

      const [httpStatus, data] = await this.$api.upload({ file: this.file }, this.onUploadProgress);

      data.file.fileType = this.file.fileType;

      if (httpStatus !== 201) {
        this.$emit('error', httpStatus);
      } else {
        this.$emit('uploaded', data.file);
      }

      this.file = null;
      this.uploading = false;
    }
  }
};
</script>
