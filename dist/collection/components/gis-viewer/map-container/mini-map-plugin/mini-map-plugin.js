import { MINI_MAP_PLUGIN_TAG } from '../../../../utils/statics';
import Utils from '../../../../utils/utilities';
import L from 'leaflet';
import MiniMap from 'leaflet-minimap';
export class MiniMapPlugin {
    constructor() {
        this.compName = MINI_MAP_PLUGIN_TAG;
    }
    componentWillLoad() {
        Utils.log_componentWillLoad(this.compName);
        if (!this.gisMap)
            return;
    }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        // Minimap
        let osmUrl = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";
        var minimapLayer = L.tileLayer(osmUrl, { minZoom: 0, maxZoom: 13 });
        console.log(minimapLayer, osmUrl);
        this.minimapControl = new MiniMap(minimapLayer, this.config.miniMapOptions);
        this.minimapControl.addTo(this.gisMap);
        this.gisMap.addControl(this.minimapControl);
    }
    componentDidUnload() {
        Utils.log_componentDidUnload(this.compName);
        this.gisMap.removeControl(this.minimapControl);
    }
    static get is() { return "mini-map-plugin"; }
    static get properties() { return { "config": { "type": "Any", "attr": "config" }, "gisMap": { "type": "Any", "attr": "gis-map" }, "minimapControl": { "state": true } }; }
    static get style() { return "/**style-placeholder:mini-map-plugin:**/"; }
}
