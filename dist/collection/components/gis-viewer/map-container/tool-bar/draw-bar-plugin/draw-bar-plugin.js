import * as leafletDraw from 'leaflet-draw';
import L from "leaflet";
import { DRAW_BAR_PLUGIN_TAG } from "../../../../../utils/statics";
import Utils from "../../../../../utils/utilities";
import _ from "lodash";
export class DrawBarPlugin {
    constructor() {
        this.compName = DRAW_BAR_PLUGIN_TAG;
    }
    getControl() {
        return this.control;
    }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        if (!this.gisMap)
            return;
        Utils.doNothing(leafletDraw);
        // Dedicated Draw layer
        this.drawnLayer = new L.FeatureGroup();
        this.gisMap.addLayer(this.drawnLayer);
        let drawBarCloneOptions = this.config.drawBarOptions;
        drawBarCloneOptions.edit = {
            featureGroup: this.drawnLayer,
            remove: _.get(this, 'config.drawBarOptions.edit.remove', true)
        };
        this.control = new L.Control.Draw(drawBarCloneOptions);
        this.gisMap.addControl(this.control);
        this.gisMap.on(L.Draw.Event.CREATED, (e) => {
            this.drawnLayer.addLayer(e.layer);
        });
    }
    componentDidUnload() {
        console.log(`componentDidUnload - ${this.compName}`);
        this.gisMap.removeControl(this.control);
    }
    static get is() { return "draw-bar-plugin"; }
    static get properties() { return { "config": { "type": "Any", "attr": "config" }, "control": { "state": true }, "distanceUnitType": { "type": "Any", "attr": "distance-unit-type" }, "drawnLayer": { "state": true }, "getControl": { "method": true }, "gisMap": { "type": "Any", "attr": "gis-map" } }; }
    static get style() { return "/**style-placeholder:draw-bar-plugin:**/"; }
}
