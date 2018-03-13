/*! Built with http://stenciljs.com */
const { h } = window.gisviewer;

import Utils, { default$1 as L$1, SCALE_CONTROL_PLUGIN_TAG } from './chunk1.js';
import _ from './chunk2.js';

class ScaleControlPlugin {
    constructor() {
        this.compName = SCALE_CONTROL_PLUGIN_TAG;
        this.pluginSupportedUnits = ['km', 'mi'];
    }
    watchDistanceUnitType(newValue) {
        // Visibility
        this.showScaleUnitsElementByType(newValue);
    }
    showScaleUnitsElementByType(globalDistanceUnitType) {
        this.pluginSupportedUnits.forEach((unit) => {
            this.setScaleUnitsElementVisibility(unit, globalDistanceUnitType); // Hide mile
        });
    }
    setScaleUnitsElementVisibility(unit, globalDistanceUnitType) {
        let scaleUnitElement = this.gisMap.getContainer().querySelector(`.leaflet-control-scale-line.${unit}`);
        if (unit === this.fromGlobalUnitToElementUnit(globalDistanceUnitType)) {
            scaleUnitElement.classList.remove('hidden');
        }
        else {
            scaleUnitElement.classList.add('hidden');
        }
    }
    fromGlobalUnitToElementUnit(globalUnit) {
        // 'metres', 'landmiles', 'nauticalmiles'
        switch (globalUnit.toLowerCase()) {
            case 'km':
                return 'km';
            case 'mile':
                return 'mi';
            case 'nauticalmiles':
                return '';
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
        this.initUnitElementsWithClasses();
        this.showScaleUnitsElementByType(this.distanceUnitType);
    }
    initUnitElementsWithClasses() {
        // Initialization for element's class
        let scaleElementList = this.gisMap.getContainer().querySelectorAll('.leaflet-control-scale-line');
        _.forEach(scaleElementList, element => {
            const elmInnerHtml = element.innerHTML.toLowerCase();
            this.pluginSupportedUnits.forEach(unit => {
                if (elmInnerHtml.indexOf(unit) > -1) {
                    element.classList.add(unit);
                }
            });
        });
    }
    componentDidUnload() {
        Utils.log_componentDidUnload(this.compName);
        this.gisMap.removeControl(this.elementControl);
    }
    static get is() { return "scale-control-plugin"; }
    static get properties() { return { "config": { "type": "Any", "attr": "config" }, "distanceUnitType": { "type": "Any", "attr": "distance-unit-type", "watchCallbacks": ["watchDistanceUnitType"] }, "elementControl": { "state": true }, "gisMap": { "type": "Any", "attr": "gis-map" } }; }
    static get style() { return ".leaflet-control-scale-line {\n  text-align: center;\n  border: 2px solid #777 !important;\n  border-top: none !important;\n  margin-top: 0px !important;\n}\n\n.hidden {\n  display: none;\n}"; }
}

export { ScaleControlPlugin };
