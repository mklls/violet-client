import giphy from 'src/api/giphy';

const state = () => ({ gifs: [] });

const getters = {
  allGifs: state => state.gifs
};

const mutations = {
  setGifs: (state, payload) => {
    while (state.gifs.pop());
    payload.forEach(gif => state.gifs.push(gif));
  },
  reset: state => {
    while (state.gifs.pop());
  }
};

const actions = {
  init: async ctx => {
    const gifs = await giphy.trending();
    if (gifs) {
      ctx.commit('setGifs', gifs);
    }
  },
  search: async (ctx, q) => {
    const gifs = await giphy.search(q);
    if (gifs) {
      ctx.commit('setGifs', gifs);
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
