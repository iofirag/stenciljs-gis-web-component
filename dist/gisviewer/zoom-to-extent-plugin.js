/*! Built with http://stenciljs.com */
const { h } = window.gisviewer;

import Utils, { ZOOM_TO_EXTENT_PLUGIN_TAG, default$1 as L$1 } from './chunk1.js';

class ZoomToExtentPlugin {
    constructor() {
        this.compName = ZOOM_TO_EXTENT_PLUGIN_TAG;
    }
    // @Event() distanceUnitsEm: EventEmitter;
    getControl() {
        return this.control;
    }
    zoomToExtent() {
        this.zoomToExtentClickHandler();
    }
    componentWillLoad() {
        Utils.log_componentWillLoad(this.compName);
    }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        this.control = this.createControl();
        this.gisMap.addControl(this.control);
    }
    componentDidUnload() {
        Utils.log_componentDidUnload(this.compName);
        this.gisMap.removeControl(this.control);
    }
    createControl() {
        try {
            const customControl = L$1.Control.extend({
                // options: options,
                onAdd: () => {
                    const container = L$1.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom zoom-to-extent-bt');
                    container.setAttribute('title', 'Zoom to extent');
                    // this.zoomToExtentClickHandler.bind(this);
                    container.addEventListener('click', this.zoomToExtentClickHandler.bind(this));
                    return container;
                },
            });
            return new customControl();
        }
        catch (e) {
            console.error('failed to create custom control: ' + e);
            return null;
        }
    }
    zoomToExtentClickHandler() {
        console.log(`${this.compName} zoomToExtentClickHandler`);
        // TBD
        this.zoomToExtentDoneEm.emit();
    }
    static get is() { return "zoom-to-extent-plugin"; }
    static get properties() { return { "config": { "type": "Any", "attr": "config" }, "control": { "state": true }, "getControl": { "method": true }, "gisMap": { "type": "Any", "attr": "gis-map" }, "zoomToExtent": { "method": true } }; }
    static get events() { return [{ "name": "zoomToExtentDoneEm", "method": "zoomToExtentDoneEm", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return ".zoom-to-extent-bt {\n  background-image: url(\"./assets/allarga-foto.png\"); }\n"; }
}

export { ZoomToExtentPlugin };
