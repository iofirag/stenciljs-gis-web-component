import * as leafletDraw from 'leaflet-draw';
import L from "leaflet";
import { DRAW_BAR_PLUGIN_TAG, LAYER_MANAGER_PLUGIN_TAG } from "../../../../../utils/statics";
import Utils from "../../../../../utils/utilities";
import _ from "lodash";
import store from "../../../../store/store";
import { reaction } from "mobx";
export class DrawBarPlugin {
    constructor() {
        this.compName = DRAW_BAR_PLUGIN_TAG;
        reaction(() => store.state.mapConfig.distanceUnitType, distanceUnitType => console.log(`${this.compName} ${distanceUnitType}`));
    }
    getControl() {
        return this.control;
    }
    componentWillLoad() {
        // Dedicated Draw layer
        this.drawnLayer = new L.FeatureGroup();
        store.mapLayers.drawableLayers.push(this.drawnLayer); // can bring leak
        let drawBarCloneOptions = this.config.drawBarOptions;
        drawBarCloneOptions.edit = {
            featureGroup: this.drawnLayer,
            remove: _.get(this, 'config.drawBarOptions.edit.remove', true)
        };
        this.control = new L.Control.Draw(drawBarCloneOptions);
    }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        this.layerManagerEl = this.gisMap.getContainer().querySelector(LAYER_MANAGER_PLUGIN_TAG);
        this.layerManagerEl.addingDrawableLayerToLayerController(this.drawnLayer);
        Utils.doNothing(leafletDraw);
        this.gisMap.addLayer(this.drawnLayer);
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
    static get properties() { return { "config": { "type": "Any", "attr": "config" }, "control": { "state": true }, "drawnLayer": { "state": true }, "getControl": { "method": true }, "gisMap": { "type": "Any", "attr": "gis-map" } }; }
    static get style() { return "/**style-placeholder:draw-bar-plugin:**/"; }
}
