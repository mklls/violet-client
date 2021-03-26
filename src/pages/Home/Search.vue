<template>
  <q-card class="column search-card">
    <q-input class="q-pa-sm bigger-input-font"
             style="max-width: 100%"
             v-model="keyword"
             autofocus
             outlined
             clearable
             clear-icon="clear"
             :bottom-slots="false"
             placeholder="Search something">
      <template v-slot:prepend>
        <q-icon name="search"/>
      </template>
    </q-input>

    <q-tabs
      style="max-width: 100%"
      active-color="primary"
      class="q-mb-sm q-px-sm text-grey-8"
      no-caps
      v-model="cate"
    >
      <q-tab name="all" :label="$t('search.all')" />
      <q-tab name="users" :label="$t('search.users')" />
      <q-tab name="groups" :label="$t('search.groups')" />
      <q-tab name="channels" :label="$t('search.channels')" />
    </q-tabs>

    <div class="result column col">
      <q-scroll-area class="col" :thumb-style="{'z-index': 2}">
        <q-list v-if="searching">
          <q-item v-for="n in 8" :key="n">

            <q-item-section avatar>
              <q-skeleton type="QAvatar" />
            </q-item-section>

            <q-item-section>
              <q-item-label>
                <q-skeleton type="text" />
              </q-item-label>

              <q-item-label caption>
                <q-skeleton type="text" />
              </q-item-label>

            </q-item-section>
          </q-item>
        </q-list>

        <q-list v-else>
          <div v-if="empty" style="font-size: 1.3em">
            <span class="q-mt-sm wrap">{{$t('search.notFound', {keyword})}}</span>
          </div>

          <q-item-label class="l-sticky bg-grey-3" header v-if="result.users.length !== 0">{{ $t('search.users') }}</q-item-label>
          <q-item
            @click="$emit('openProfileCard', u.item)"
            v-ripple
            clickable
            v-for="u in result.users"
            :key="u.item.username"
          >

            <q-item-section avatar>
              <q-avatar
                color="primary"
                text-color="white"
                size="42px"
                class="no-select flex flex-center"
              >
                <q-img v-if="u.item.avatar" :src="u.item.avatar" :alt="u.item.name"/>
                <span v-else>{{ u.item.name.split('')[0] }}</span>
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>
                {{ u.item.name }}
              </q-item-label>

              <q-item-label lines="1" caption>
                {{ u.match === u.item.name ? u.item.bio : u.match}}
              </q-item-label>

            </q-item-section>
          </q-item>

          <q-item-label class="l-sticky bg-grey-3" header v-if="result.groups.length !== 0">{{ $t('search.groups') }}</q-item-label>
          <q-item
            @click="$emit('openProfileCard', g.item)" v-ripple
            clickable
            v-for="g in result.groups"
            :key="g.item.groupname"
          >

            <q-item-section avatar>
              <q-avatar
                color="primary"
                text-color="white"
                size="42px"
                class="no-select flex flex-center"
              >
                <q-img v-if="g.item.avatar" :src="g.item.avatar" :alt="g.item.name"/>
                <span v-else>{{ g.item.name.split('')[0] }}</span>
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>
                {{ g.item.name }}
              </q-item-label>

              <q-item-label lines="1" caption>
                {{ g.match === g.item.name ? g.item.description : g.match }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item-label class="l-sticky bg-grey-3" header v-if="result.channels.length !== 0">{{ $t('search.channels') }}</q-item-label>
          <q-item
            @click="$emit('openProfileCard', c.item)"
            v-ripple
            clickable
            v-for="c in result.channels"
            :key="c.item.channelname"
          >

            <q-item-section avatar>
              <q-avatar
                color="primary"
                text-color="white"
                size="42px"
                class="no-select flex flex-center"
              >
                <q-img v-if="c.item.avatar" :src="c.item.avatar" :alt="c.item.name"/>
                <div v-else class="center">{{ c.item.name.split('')[0] }} </div>
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>
                {{ c.item.name }}
              </q-item-label>

              <q-item-label caption>
                {{ c.match === c.item.name ? c.item.description : c.match }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

      </q-scroll-area>
    </div>
  </q-card>
</template>

<style lang="scss" scoped>
.search-card {
  width: 100%;
  height: 100%;

  .q-img {
    height: 100%;
    width: 100%;
  }

  .l-sticky {
    color: #211e1e;
    z-index: 1;
    position: sticky;
    top: 0;
  }

  .result {
    width: 100%;
  }
}
</style>

<script>
export default {
  name: 'search',
  data () {
    return {
      keyword: '',
      empty: false,
      cate: 'all',
      searching: '',
      result: {
        count: 0,
        users: [],
        groups: [],
        channels: [],
        span: 0
      }
    };
  },

  watch: {
    cate () {
      this.empty = false;
      this.debounceSearch();
    },
    keyword (nVal, oVal) {
      this.empty = false;
      if (nVal === oVal) { return; }
      this.debounceSearch();
    }
  },

  methods: {
    async ext (category, data, matchKey, all = false) {
      const raw = all ? data.data[category] : data.data;

      raw.forEach(v => {
        let match;

        for (let i = 0; i < v.matches.length; i++) {
          match = v.matches[i].value;

          if (v.matches[i].key === matchKey) {
            match = '@' + match;
            break;
          }
        }

        this.result[category].push({ item: v.item, match });
      });
    },

    async search () {
      if (!this.keyword) { return; }

      const tempc = this.cate;
      this.searcing = true;
      const [httpStatus, data] = await this.$api.find({ c: this.cate, q: this.keyword });
      this.searching = false;

      while (this.result.users.pop());
      while (this.result.groups.pop());
      while (this.result.channels.pop());

      if (httpStatus !== 200 || tempc !== this.cate) { return; }

      this.result.span = data.span;

      switch (this.cate) {
        case 'all':
          this.result.count =
            data.data.users.length +
            data.data.groups.length +
            data.data.channels.length;

          this.ext('users', data, 'username', true);
          this.ext('groups', data, 'groupname', true);
          this.ext('channels', data, 'channelname', true);
          break;
        case 'users':
          this.ext('users', data, 'username');
          this.result.count = data.data.length;
          break;
        case 'groups':
          this.ext('groups', data, 'groupname');
          this.result.count = data.data.length;
          break;
        case 'channels':
          this.ext('channels', data, 'channelname');
          this.result.count = data.data.length;
          break;
      }

      this.empty = !this.result.count;

      this.debug('result %O', this.result);
    }
  },

  created () {
    this.debug = this.$debug.extend('search');
    this.debug('created');
  },

  mounted () {
    this.debounceSearch = this._.debounce(this.search, 800);
  }
};
</script>
