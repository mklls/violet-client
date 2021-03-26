import giphy from 'src/api/giphy';

const state = () => ({ gifs: [] });

const getters = {
  allGifs: state => state.gifs
};

const mutations = {
  setGifs: (state, payload) => {
    state.gifs = payload;
  }
};

const actions = {
  init: async ctx => {
    const gifs = await giphy.trending();
    ctx.commit('setGifs', gifs);
  },
  search: async (ctx, q) => {
    const gifs = await giphy.search(q);
    ctx.commit('setGifs', gifs);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
