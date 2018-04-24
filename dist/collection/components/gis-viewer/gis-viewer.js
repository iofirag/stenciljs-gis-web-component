import { GIS_VIEWER_TAG } from '../../utils/statics';
import Utils from '../../utils/utilities';
import store from '../store/store';
// import '../../../package';
// import {version} from '../../../../../stencil.config'
export class GisViewer {
    constructor() {
        this.compName = GIS_VIEWER_TAG;
    }
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
    zoomToExtent() {
        this.mapContainerEl.zoomToExtent();
    }
    changeDistanceUnits() {
        this.mapContainerEl.changeDistanceUnits();
    }
    changeCoordinateSystem() {
        this.mapContainerEl.changeCoordinateSystem();
    }
    exportMapImage() {
        return Utils.exportMapImage();
    }
    getBounds() {
        return this.verifyIsMapExist() ? this.mapContainerEl.getBounds() : undefined;
    }
    removeHighlightPOIs() {
        if (this.verifyIsMapExist()) {
            Utils.removeHighlightPOIs();
        }
    }
    getSelectedShapes() {
        return this.verifyIsMapExist() ? this.mapContainerEl.getSelectedShapes() : undefined;
    }
    componentWillLoad() {
        store.initState(this.gisViewerProps);
        // Set first base map as working tile
        // store.mapLayers.baseMaps = Utils.initStoreWithMapTiles(this.gisViewerProps.tileLayers);
    }
    componentWillUpdate() {
        store.updateState(this.gisViewerProps);
        console.log(`${this.compName} updateState`);
        // Set first base map as working tile
        // store.mapLayers.baseMaps = Utils.initStoreWithMapTiles(this.gisViewerProps.tileLayers);
    }
    render() {
        return h("map-container", { id: 'map', gisViewerProps: store.state });
    }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        this.mapContainerEl = document.querySelector("map-container");
        this.getVersion();
    }
    verifyIsMapExist() {
        if (!this.mapContainerEl) {
            console.warn(`Map is not initial, please instantiate map before trigger map's commands or callbacks`);
            return false;
        }
        return true;
    }
    static get is() { return "gis-viewer"; }
    static get properties() { return { "changeCoordinateSystem": { "method": true }, "changeDistanceUnits": { "method": true }, "exportMapImage": { "method": true }, "getBounds": { "method": true }, "getSelectedShapes": { "method": true }, "getVersion": { "method": true }, "gisViewerProps": { "type": "Any", "attr": "gis-viewer-props" }, "removeHighlightPOIs": { "method": true }, "zoomToExtent": { "method": true } }; }
    static get style() { return "/**style-placeholder:gis-viewer:**/"; }
}
