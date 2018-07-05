const utils = {
  parseServerProxy: (url) => {
    var serverProxy;
    var serverProxyDefault = 'http://localhost:8000';
    if (url) {
      serverProxy = url;
    } else {
      serverProxy = serverProxyDefault;
    }
    return serverProxy;
  }
};
module.exports = utils;
