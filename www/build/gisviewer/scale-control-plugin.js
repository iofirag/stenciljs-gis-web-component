/*! Built with http://stenciljs.com */
const { h } = window.gisviewer;

import Utils, { default$1 as L$1, SCALE_CONTROL_PLUGIN_TAG } from './chunk1.js';
import _ from './chunk2.js';

class ScaleControlPlugin {
    constructor() {
        this.compName = SCALE_CONTROL_PLUGIN_TAG;
        this.units = ['km', 'mi'];
    }
    validateMetric(newValue) {
        console.log(`newValue=${newValue} metric=${this.metric}`);
        // Visibility
        this.toggleScaleElementUnits(this.metric);
    }
    toggleScaleElementUnits(isMetric) {
        this.setScaleElementVisibility('mi', !isMetric); // Hide mile
        this.setScaleElementVisibility('km', isMetric); // Show km
    }
    setScaleElementVisibility(unit, visibility) {
        let scaleUnitElement = this.gisMap.getContainer().querySelector(`.leaflet-control-scale-line.${unit}`);
        if (visibility) {
            scaleUnitElement.classList.remove('hidden');
        }
        else {
            scaleUnitElement.classList.add('hidden');
        }
    }
    componentWillLoad() {
        Utils.log_componentWillLoad(this.compName);
    }
    componentWillUpdate() { }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        // Create new component
        const options = {
            position: this.config.scaleControlOptions.position,
            metric: true,
            imperial: true,
        };
        this.elementControl = L$1.control.scale(options);
        this.gisMap.addControl(this.elementControl);
        // Initialization
        let scaleElementList = this.gisMap.getContainer().querySelectorAll('.leaflet-control-scale-line');
        _.forEach(scaleElementList, element => {
            const elmInnerHtml = element.innerHTML.toLowerCase();
            this.units.forEach(unit => {
                if (elmInnerHtml.indexOf(unit) > -1) {
                    element.classList.add(unit);
                }
            });
        });
        this.toggleScaleElementUnits(this.metric);
    }
    componentDidUnload() {
        Utils.log_componentDidUnload(this.compName);
        this.gisMap.removeControl(this.elementControl);
    }
    static get is() { return "scale-control-plugin"; }
    static get properties() { return { "config": { "type": "Any", "attr": "config" }, "elementControl": { "state": true }, "gisMap": { "type": "Any", "attr": "gis-map" }, "metric": { "type": Boolean, "attr": "metric", "watchCallbacks": ["validateMetric"] } }; }
    static get style() { return ".leaflet-control-scale-line {\n  text-align: center;\n  border: 2px solid #777 !important;\n  border-top: none !important;\n  margin-top: 0px !important;\n}\n\n.hidden {\n  display: none;\n}"; }
}

export { ScaleControlPlugin };
