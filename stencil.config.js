const sass = require("@stencil/sass");
const assets = require("./assetsExporter/plugin");
exports.config = {
  namespace: "gisviewer", // Files prefix name convention
  outputTargets: [
    {type: 'www'},
    {type: 'dist'}
  ],

  // bundles: [
  //   {
  //     components: [
  //       "dev-component",
  //       /*  */ "gis-viewer",
  //       /* -- */ "map-container",
  //       /* -- -- */ "tool-bar",
  //       // /* -- -- -- */ "draw-bar-plugin",
  //       // /* -- -- -- */ "zoom-to-extent-plugin",
  //       /* -- -- -- */ "full-screen-plugin",
  //       // /* -- -- -- */ 'measure-plugin',
  //       // /* -- -- */ "scale-control-plugin",
  //       // /* -- -- */ "mini-map-plugin"
  //     ]
  //   }
  // ],

  plugins: [assets(), sass()],

  copy: [
    {dest: "images", src: "../node_modules/leaflet/dist/images"},

    {dest: 'fonts', src: '../node_modules/leaflet.styledlayercontrol/css/fonts'},
    {dest: 'images', src: '../node_modules/leaflet.styledlayercontrol/css/images'},

    {dest: "images", src: "../node_modules/leaflet-draw/dist/images"},
    {dest: "images", src: "../node_modules/leaflet-minimap/dist/images"},
    {dest: "images", src: "../node_modules/leaflet-fullscreen/dist"},
    {dest: 'images', src: '../node_modules/leaflet-search/images'},
    // { dest: 'package.json', src: '../package.json'},
    // { dest: '/', src: '../src/components/gis-viewer/map-container/tool-bar/zoom-to-extent-plugin/allarga-foto.png' },
    // { dest: 'css', src: 'styles'}
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}
