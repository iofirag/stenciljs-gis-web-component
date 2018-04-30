import { Component, Prop, Method } from '@stencil/core';
import { GIS_VIEWER_TAG } from '../../utils/statics';
import Utils from '../../utils/utilities';
import { GisViewerProps, MapBounds, ShapeDefinition, ShapeData, WktShape } from '../../models';
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

  @Method()
  getBounds(): MapBounds {
		return this.verifyIsMapExist() ? this.mapContainerEl.getBounds() : undefined;
  }

  @Method()
  removeHighlightPOIs() {
		if (this.verifyIsMapExist()) {
			Utils.removeHighlightPOIs();
		}
  }

  @Method()
  getSelectedShapes(): ShapeDefinition[] {
		return this.verifyIsMapExist() ? this.mapContainerEl.getSelectedShapes() : undefined;
  }

  @Method()
  clearDrawLayer() {
    if (!this.verifyIsMapExist()) { return; }
    this.mapContainerEl.clearDrawLayer();
  }
  @Method()
  exportDrawLayer(): WktShape[] {
    if (!this.verifyIsMapExist()) { return; }
    return this.mapContainerEl.exportDrawLayer();
  }

  @Method()
  toggleShapeSelectionById(shapeDataArr: ShapeData[]): void {
    if (!this.verifyIsMapExist()) { return; }
    this.mapContainerEl.toggleShapeSelectionById(shapeDataArr);
  }

  @Method()
  highlightPOIsByGroupId(groupId: string): void {
    if (!this.verifyIsMapExist()) { return; }
    Utils.highlightPOIsByGroupId(groupId);
  }


  @Method()
  importDrawState(parentData: Array<WktShape>): void {
		if (this.verifyIsMapExist()) {
      // this.mapContainerEl.toolbarComp.getDrawBar().import(parentData);
      this.mapContainerEl.importDrawState(parentData);
		}
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

  private verifyIsMapExist(): boolean {
		if (!this.mapContainerEl) {
			console.warn(`Map is not initial, please instantiate map before trigger map's commands or callbacks`);
			return false;
		}
		return true;
	}
}
