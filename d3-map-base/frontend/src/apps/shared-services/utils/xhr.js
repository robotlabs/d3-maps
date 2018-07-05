const xhr = (url, token, type = 'json', params) => {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    //** load
    req.addEventListener('load', () => {
      let response = req.response;
      if (type === 'json' && typeof response === 'string') {
        response = JSON.parse(response);
      }
      resolve(response);
    });

    //** onreadystatechange
    req.onreadystatechange = function() {
      //** catch different http errors
      if (req.readyState === 4) {
        if (req.status === 404
          || req.status === 401
          || req.status === 403
          || req.status === 500) {
          reject('api:' + req.status);
        }
      }
    };

    //** error
    req.addEventListener('error', () => {
      reject('api:error');
    });

    //** open
    let urlParams = url;
    if (params) {
      urlParams = url + formatParams(params);
    }

    req.open('GET', encodeURI(urlParams), true);
    req.responseType = type;
    req.send();

    //** canceling
    token.cancel = function() {
      req.abort(); // abort request
      reject('api:abort');
    };
  });
};

//** utility to format api parameters
function formatParams(params) {
  return '?' + Object
    .keys(params)
    .map(function(key) {
      return params[key] ? key + '=' + params[key] : '';
    })
    .join('&');
}

export default xhr;
