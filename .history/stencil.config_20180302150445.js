exports.config = {
  namespace: "mycomponent",
  generateDistribution: true,
  serviceWorker: false,
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
