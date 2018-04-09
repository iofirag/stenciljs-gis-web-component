import { FULL_SCREEN_PLUGIN_TAG } from "../../../../../utils/statics";
import Utils from "../../../../../utils/utilities";
import L from "leaflet";
import * as fullscreen from "leaflet-fullscreen";
export class FullScreenPlugin {
    constructor() {
        this.compName = FULL_SCREEN_PLUGIN_TAG;
    }
    // @Event() distanceUnitsEm: EventEmitter;
    componentWillLoad() {
        Utils.log_componentWillLoad(this.compName);
        this.control = this.createPlugin();
    }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        this.gisMap.addControl(this.control);
    }
    componentDidUnload() {
        Utils.log_componentDidUnload(this.compName);
        this.gisMap.removeControl(this.control);
    }
    getControl() {
        return this.control;
    }
    createPlugin() {
        try {
            const customControl = L.Control.extend({
                // options: options,
                onAdd: () => {
                    const container = L.DomUtil.create("div", "leaflet-bar leaflet-control leaflet-control-custom leaflet-control-fullscreen");
                    let a = document.createElement("a");
                    container.appendChild(a);
                    container.setAttribute("title", "Full-Screen");
                    container.addEventListener("click", this.buttonClickHandler.bind(this));
                    return container;
                }
            });
            return new customControl();
        }
        catch (e) {
            console.error("failed to create custom control: " + e);
            return null;
        }
    }
    buttonClickHandler() {
        console.log(`${this.compName} click`);
        Utils.doNothing(fullscreen);
        this.gisMap.toggleFullscreen();
        // this.distanceUnitsEm.emit('mile');
        // this.distanceUnitsEm.emit('km');
    }
    static get is() { return "full-screen-plugin"; }
    static get properties() { return { "config": { "type": "Any", "attr": "config" }, "control": { "state": true }, "getControl": { "method": true }, "gisMap": { "type": "Any", "attr": "gis-map" } }; }
    static get style() { return "/**style-placeholder:full-screen-plugin:**/"; }
}
