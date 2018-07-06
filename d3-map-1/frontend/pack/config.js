var entryValues = [
  {
    appName: 'app-react-simple',
    appEntry: './src/apps/d3-map-1/'
  }
];

var defaultValues = {
  vendor: {
    name: 'vendor',
    srcVendor: './src/vendor/vendor'
  },
  scriptLoader: {
    name: 'script-loader',
    src: './src/script-loader/script-loader.js'
  }
};

var middleware = 'webpack-hot-middleware/client';
var devhotPatch = 'react-hot-loader/patch';

var localEntryDevhot = {};
var localEntryDev = {};
var localEntryProd = {};
var localVendorEntryProd = {};

createEntries();
function createEntries() {
  for (var i = 0; i < entryValues.length; i++) {
    localEntryDevhot[entryValues[i].appName] = [
      devhotPatch,
      middleware,
      entryValues[i].appEntry
    ];
    localEntryDev[entryValues[i].appName] = entryValues[i].appEntry;
    localEntryProd[entryValues[i].appName] = entryValues[i].appEntry;
  }

  //** apply default ( vendors, script-loader)

  localEntryDevhot[defaultValues.vendor.name] = defaultValues.vendor.srcVendor;
  localEntryDevhot[defaultValues.scriptLoader.name] = defaultValues.scriptLoader.src;

  localEntryDev[defaultValues.vendor.name] = defaultValues.vendor.srcVendor;
  localEntryDev[defaultValues.scriptLoader.name] = defaultValues.scriptLoader.src;

  localVendorEntryProd[defaultValues.vendor.name] = defaultValues.vendor.srcVendor;
  localEntryProd[defaultValues.scriptLoader.name] = defaultValues.scriptLoader.src;
}

var config = {
  entryDevhot: localEntryDevhot,
  entryDev: localEntryDev,
  entryProd: localEntryProd,
  entryVendorProd: localVendorEntryProd,

  outputPath: {
    publicPath: '/output/js/',
    exportJsPath: '/../../output/js',
    cssPath: './../css/',
    absoluteCssPath: '/../../../output/css/'
  }
};

module.exports = config;
