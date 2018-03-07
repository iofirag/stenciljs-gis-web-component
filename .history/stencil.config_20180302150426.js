exports.config = {
  namespace: "mycomponent",
  generateDistribution: true,
  serviceWorker: false,
  plugins: [sass()]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}