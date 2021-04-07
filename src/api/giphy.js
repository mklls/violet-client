import retry from 'async-retry';
import axios from 'axios';
// eslint-disable-next-line
const api_key = process.env.GIPHY_KEY;
const limit = 40;
const rating = 'g';
const retryCodes = [408, 500, 502, 503, 504, 522, 524];
const giphy = axios.create({
  baseURL: process.env.GIPHY
});

export default {
  // giphy api 通用接口
  async fetchGif (url, q) {
    const params = { api_key, limit, rating };
    q && (params.q = q);

    let error = null;
    const gifs = retry(async bail => {
      try {
        const res = await giphy.get(url, { params });
        return res.data.data;
      } catch (err) {
        if (!retryCodes.includes(err.response.status)) {
          console.error(err);
          error = err;
          bail(err);
        }
      }
    }, {
      retries: 5,
      onRetry (e) {
        console.info('giphy', e);
      }
    });

    if (error) {
      return null;
    } else {
      return gifs;
    }
  },

  async trending () {
    return await this.fetchGif('/v1/gifs/trending');
  },

  async search (q) {
    return await this.fetchGif('/v1/gifs/search', q);
  }
};
