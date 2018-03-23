import { GIS_VIEWER_TAG } from '../../utils/statics';
import Utils from '../../utils/utilities';
// import * as pkgjson from '../../../package.json';
// import {version} from '../../../../../stencil.config'
export class GisViewer {
    constructor() {
        this.compName = GIS_VIEWER_TAG;
    }
    getVersion() {
        // Include version number in compile
        // var pjson = require('../../../package.json');
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
    componentWillLoad() {
        // this.gisViewerProps
    }
    render() {
        return h("map-container", { id: "map", gisViewerProps: this.gisViewerProps });
    }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        this.mapContainerEl = document.querySelector("map-container");
        this.getVersion();
    }
    static get is() { return "gis-viewer"; }
    static get properties() { return { "changeCoordinateSystem": { "method": true }, "changeDistanceUnits": { "method": true }, "getVersion": { "method": true }, "gisViewerProps": { "type": "Any", "attr": "gis-viewer-props" }, "zoomToExtent": { "method": true } }; }
    static get style() { return "/**style-placeholder:gis-viewer:**/"; }
}
