import { Component, Prop, Method } from '@stencil/core';
import { GIS_VIEWER_TAG } from '../../utils/statics';
import Utils from '../../utils/utilities';
import { GisViewerProps } from '../../models';
import store from '../store/store';

// import '../../../package';
// import {version} from '../../../../../stencil.config'

@Component({
  tag: "gis-viewer",
  styleUrls: [
    "../../../node_modules/leaflet/dist/leaflet.css",
    '../../../node_modules/leaflet.markercluster/dist/MarkerCluster.css',
    '../../../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css',
    'gis-viewer.scss',
  ]
})
export class GisViewer {
  compName: string = GIS_VIEWER_TAG;
  mapContainerEl: HTMLMapContainerElement;
  // @Element() el: HTMLElement;
  @Prop() gisViewerProps: GisViewerProps;


  @Method()
  getVersion() {
    // Include version number in compile
    // fetch('package.json').then((res)=> {
    //   const toJsonPromise: Promise<any> = res.json();
    //   toJsonPromise.then(pkgjson => console.log(`GIS v${pkgjson.version}`));
    // })
    // var pkgjson = require('../../../package.json');
    // console.log(`GIS v${pkgjson.version}`);
    // console.log(version)
  }
  @Method()
  zoomToExtent() {
    this.mapContainerEl.zoomToExtent();
  }
  @Method()
  changeDistanceUnits() {
    this.mapContainerEl.changeDistanceUnits();
  }
  @Method()
  changeCoordinateSystem() {
    this.mapContainerEl.changeCoordinateSystem();
  }

  @Method()
  exportMapImage() {
    return Utils.exportMapImage();
  }

  componentWillLoad() {
    store.initState(this.gisViewerProps);
    // Set first base map as working tile
    // store.mapLayers.baseMaps = Utils.initStoreWithMapTiles(this.gisViewerProps.tileLayers);

  }
  componentWillUpdate() {
    store.updateState(this.gisViewerProps)
    console.log(`${this.compName} updateState`)
    // Set first base map as working tile
    // store.mapLayers.baseMaps = Utils.initStoreWithMapTiles(this.gisViewerProps.tileLayers);
  }
  render() {
    return <map-container id='map' gisViewerProps={store.state} />;
  }

  componentDidLoad() {
    Utils.log_componentDidLoad(this.compName);
    this.mapContainerEl = document.querySelector("map-container");
    this.getVersion();
  }
}
