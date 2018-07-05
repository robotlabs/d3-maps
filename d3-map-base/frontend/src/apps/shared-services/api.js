//** hook an xhr, to have power to cancel a request
import xhr from './utils/xhr.js';

const api = {
  fetchData(apiName, resolve, reject, token, params) {
    var fetchPromise = xhr(apiName, token, 'json', params)
      .then(resolve)
      .catch(function(e) {
        return Promise.reject(e);
      });

    return fetchPromise;
  }
};

export default api;
