const sass = require("@stencil/sass");

exports.config = {
  namespace: "gisviewer", // Files prefix name convention
  generateDistribution: true,
  serviceWorker: false,

  bundles: [
    {
      components: [
        "dev-component",
        /*  */ "gis-viewer",
        /* -- */ "map-container",
        /* -- -- */ "tool-bar",
        // /* -- -- -- */ "draw-bar-plugin",
        // /* -- -- -- */ "zoom-to-extent-plugin",
        /* -- -- -- */ "full-screen-plugin",
        
        // /* -- -- */ "scale-control-plugin",
        // /* -- -- */ "mini-map-plugin"
      ]
    }
  ],

  plugins: [sass()],

  copy: [
    { dest: "images", src: "../node_modules/leaflet/dist/images" },
    { dest: "images", src: "../node_modules/leaflet-draw/dist/images" },
    { dest: "images", src: "../node_modules/leaflet-minimap/dist/images" },
    { dest: "images", src: "../node_modules/leaflet-fullscreen/dist" }
    // { dest: '/', src: '../src/components/gis-viewer/map-container/tool-bar/zoom-to-extent-plugin/allarga-foto.png' },
    // { src: 'styles', dest: 'css' }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}
