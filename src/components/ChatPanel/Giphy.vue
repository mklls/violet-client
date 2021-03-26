<template>
  <q-dialog transition-show="jump-up" transition-hide="jump-up" v-model="$_open">
    <q-card>
      <q-card-section>
        <q-input
          autofocus
          class="search-bar"
          :debounce="frequency"
          :loading="searching"
          @input="search"
          v-model="keyword"
          type="search"
          filled
        >
          <template v-slot:prepend>
            <q-icon name="search"></q-icon>
          </template>
        </q-input>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="row no-scroll">
        <q-scroll-area  style="height: 45vh; width: 416px; padding-bottom: 5px">
          <div class="flex row">
            <div class="flex column q-mr-sm">
              <div
                class="gif-item cursor-pointer"
                style="padding:2px"
                v-for="gif in gifs[0]"
                :key="gif.id"
                @click="$emit('select', gif)"
              >
                <img :src="gif.preview.url" />

                <q-tooltip
                  v-if="gif.title"
                  anchor="bottom middle"
                  :delay="500"
                  self="center middle"
                  content-style="font-size: 1.2em"
                >
                  {{ gif.title }}
                </q-tooltip>
              </div>
            </div>

            <div class="flex column">
              <div
                class="gif-item cursor-pointer"
                v-for="gif in gifs[1]"
                style="padding:2px"
                @click="$emit('select', gif)"
                :key="gif.id"
              >
                <img :src="gif.preview.url" />

                <q-tooltip
                  v-if="gif.title"
                  anchor="bottom middle"
                  :delay="500"
                  self="center middle"
                  content-style="font-size: 1.2em"
                >
                  {{ gif.title }}
                </q-tooltip>
              </div>
            </div>
          </div>
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.search-bar {
  font-size: 1.3em;
}

.gif-item {
  border-radius: 3px;
}
</style>

<script>

export default {
  name: 'giphy',
  data () {
    return {
      keyword: '',
      searching: false,
      frequency: 800,
      data: []
    };
  },
  props: {
    open: {
      type: Boolean,
      default: false
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

    allgifs () {
      return this.$store.getters['giphy/allGifs'].map(gif => ({
        id: gif.slug,
        title: gif.title,
        preview: {
          width: gif.images.fixed_width.width,
          height: gif.images.fixed_width.height,
          url: gif.images.fixed_width.url
        },
        original: {
          width: gif.images.original.width,
          height: gif.images.original.height,
          url: gif.images.original.url
        }
      }));
    },
    gifs: function () {
      const split = Math.ceil(this.allgifs.length / 2);
      return [this.allgifs.slice(0, split), this.allgifs.slice(split)];
    }
  },
  created () {
    this.$store.dispatch('giphy/init');
  },
  methods: {
    async search (keyword) {
      if (keyword === '') return;

      this.searching = true;
      await this.$store.dispatch('giphy/search', keyword);
      this.searching = false;
    }
  }
};
</script>
