var scriptLoader = {
  iter: 0,
  init: function() {
    if (isIE()) {
      var scriptIE = document.createElement('script');
      scriptIE.src = window.DSA.staticBase  + 'js/es6-promise.js';
      scriptIE.type = 'text/javascript';
      scriptIE.async = false;
      document.getElementsByTagName('head')[0].appendChild(scriptIE);
    }
  },
  loadScript: function() {
    var scope = this;
    var script = window.DSA.jsScripts[scope.iter];
    var scriptTag = document.createElement('script');
    scriptTag.src = script;
    scriptTag.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(scriptTag);
    var scope = this;
    scriptTag.onload = function() {
      scope.iter++;
      if (scope.iter < window.DSA.jsScripts.length) {
        scope.loadScript();
      }
    };
  }
};
//** utils to check if to add promise polyfill ( without IE and jspm doesn't get along too much)
function isIE(userAgent) {
  userAgent = userAgent || navigator.userAgent;
  return userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident/') > -1 || userAgent.indexOf('Edge/') > -1;
}
module.exports = scriptLoader;
