import { MOUSE_COORDINATE_PLUGIN_TAG } from "../../../../utils/statics";
import Utils from "../../../../utils/utilities";
import L from "leaflet";
import * as mousecoordinatesystems from 'leaflet.mousecoordinatesystems';
import _ from "lodash";
export class MouseCoordinagePlugin {
    constructor() {
        this.compName = MOUSE_COORDINATE_PLUGIN_TAG;
    }
    watchCoordinateSystemType(newValue) {
        // console.log('The new value of activated is: ', newValue, oldValue);
        this.changeCoordinateSystemHandler(newValue);
    }
    // componentWillLoad() {
    //     Utils.log_componentWillLoad(this.compName);
    // }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        const mouseCoordinateGps = {
            gpsLong: false,
        };
        const mouseCoordinateUtm = {
            utm: true,
            gps: false,
        };
        const mouseCoordinateUtmref = {
            utmref: true,
            gpsLong: false,
            gps: false,
        };
        this.controlGps = this.createPlugin(mouseCoordinateGps);
        this.controlUtm = this.createPlugin(mouseCoordinateUtm);
        this.controlUtmref = this.createPlugin(mouseCoordinateUtmref);
        this.gisMap.addControl(this.controlGps);
        this.gisMap.addControl(this.controlUtm);
        this.gisMap.addControl(this.controlUtmref);
        this.changeCoordinateSystemHandler(this.coordinateSystemType);
        Utils.doNothing(mousecoordinatesystems);
    }
    componentDidUnload() {
        Utils.log_componentDidUnload(this.compName);
        this.gisMap.removeControl(this.controlGps);
        this.gisMap.removeControl(this.controlUtm);
        this.gisMap.removeControl(this.controlUtmref);
    }
    createPlugin(options) {
        // let options = this.config.mouseCoordinateOptions;
        options.position = 'bottomleft';
        let control = new L.Control.mouseCoordinate(options);
        return control;
    }
    changeCoordinateSystemHandler(value) {
        const gpsElement = document.querySelector('.gps');
        const utmElement = document.querySelector('.utm');
        const utmrefElement = document.querySelector('.utmref');
        const mouseCoordinateTypesElementCollection = [gpsElement, utmElement, utmrefElement];
        _.forEach(mouseCoordinateTypesElementCollection, (elm) => {
            elm.style.display = elm.classList.contains(value) ? 'flex' : 'none';
        });
    }
    static get is() { return "mouse-coordinate-plugin"; }
    static get properties() { return { "config": { "type": "Any", "attr": "config" }, "controlGps": { "state": true }, "controlUtm": { "state": true }, "controlUtmref": { "state": true }, "coordinateSystemType": { "type": "Any", "attr": "coordinate-system-type", "watchCallbacks": ["watchCoordinateSystemType"] }, "gisMap": { "type": "Any", "attr": "gis-map" } }; }
    static get style() { return "/**style-placeholder:mouse-coordinate-plugin:**/"; }
}
