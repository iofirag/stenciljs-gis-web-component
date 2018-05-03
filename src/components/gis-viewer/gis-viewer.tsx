import { Component, Prop, Method, Event, EventEmitter, Listen } from '@stencil/core';
import { GIS_VIEWER_TAG } from '../../utils/statics';
import Utils from '../../utils/utilities';
import { GisViewerProps, MapBounds, ShapeDefinition, ShapeData, WktShape, FILE_TYPES } from '../../models';
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
  @Event() saveKmlFormat: EventEmitter<Blob>;
  @Event() saveCsvFormat: EventEmitter<Blob>;
  @Event() saveShpFormat: EventEmitter<Blob>;
  @Event() endImportDraw: EventEmitter<WktShape[]>;
  @Event() drawCreated: EventEmitter<WktShape>;

  @Listen('onDrawCreatedCB')
  drawCreatedHandler(event: CustomEvent<WktShape>): void {
    this.drawCreated.emit(event.detail);
  }

  @Listen('endImportDrawCB')
  endImportDrawHandler(event: CustomEvent<WktShape[]>): void {
    this.endImportDraw.emit(event.detail);
  }

  @Listen('saveKmlFormatCB')
  saveKmlFormatHandler(event: CustomEvent<Blob>): void {
    this.saveKmlFormat.emit(event.detail);
  }

  @Listen('saveCsvFormatCB')
  saveCsvFormatHandler(event: CustomEvent<Blob>): void {
    this.saveCsvFormat.emit(event.detail);
  }

  @Listen('saveShpFormatCB')
  saveShpFormatHandler(event: CustomEvent<Blob>): void {
    this.saveShpFormat.emit(event.detail);
  }

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

  @Method()
  exportKmlBlob(): Blob {
		return this.verifyIsMapExist() ? this.mapContainerEl.exportBlobByFileTypeCommand(FILE_TYPES.kml) : undefined;
  }

  @Method()
  exportCsvBlob(): Blob {
		return this.verifyIsMapExist() ? this.mapContainerEl.exportBlobByFileTypeCommand(FILE_TYPES.csv) : undefined;
  }

  @Method()
	exportShpBlob(): Blob {
		return this.verifyIsMapExist() ? this.mapContainerEl.exportBlobByFileTypeCommand(FILE_TYPES.zip) : undefined;
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
    // fix: run material design lite upgrade func after this component appended to dom
    const mdlComponentHandler = (window as any).componentHandler;
    mdlComponentHandler && mdlComponentHandler.upgradeAllRegistered();

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
