import L from "leaflet";
import * as measure from 'leaflet.polylinemeasure';
import { MEASURE_PLUGIN_TAG } from "../../../../../utils/statics";
import Utils from "../../../../../utils/utilities";
export class MeasurePlugin {
    constructor() {
        this.compName = MEASURE_PLUGIN_TAG;
    }
    watchDistanceUnitType(newValue) {
        console.log(newValue);
        this.changePluginUnits(newValue);
    }
    getControl() {
        return this.control;
    }
    fromGlobalUnitToPluginUnit(globalUnit) {
        switch (globalUnit.toLowerCase()) {
            case 'km':
                return 'metres';
            case 'mile':
                return 'landmiles';
            case 'nauticalmiles':
                return 'nauticalmiles';
            default:
                break;
        }
    }
    fromGlobalUnitToButtonUnit(globalUnit) {
        switch (globalUnit.toLowerCase()) {
            case 'km':
                return 'm';
            case 'mile':
                return 'mi';
            case 'nauticalmiles':
                return 'nm';
            default:
                break;
        }
    }
    changePluginUnits(globalUnit) {
        const unitControlIdElement = this.gisMap.getContainer().querySelector('#unitControlId');
        if (!unitControlIdElement)
            return;
        let pluginUnitOptions = this.fromGlobalUnitToButtonUnit(globalUnit);
        while (unitControlIdElement.innerText !== pluginUnitOptions) {
            unitControlIdElement.click();
        }
    }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        if (!this.gisMap)
            return;
        Utils.doNothing(measure);
        this.control = this.createPlugin(this.config.measureOptions);
        this.gisMap.addControl(this.control);
    }
    componentDidUnload() {
        console.log(`componentDidUnload - ${this.compName}`);
        this.gisMap.removeControl(this.control);
    }
    createPlugin(options) {
        Utils.doNothing(options);
        const clonedOptions = Object.assign({ showUnitControl: true }, { unit: this.fromGlobalUnitToPluginUnit(this.distanceUnitType) }, options);
        options.position = 'bottomleft';
        let control = new L.Control.PolylineMeasure(clonedOptions);
        return control;
    }
    static get is() { return "measure-plugin"; }
    static get properties() { return { "config": { "type": "Any", "attr": "config" }, "control": { "state": true }, "distanceUnitType": { "type": "Any", "attr": "distance-unit-type", "watchCallbacks": ["watchDistanceUnitType"] }, "getControl": { "method": true }, "gisMap": { "type": "Any", "attr": "gis-map" } }; }
    static get style() { return "/**style-placeholder:measure-plugin:**/"; }
}
