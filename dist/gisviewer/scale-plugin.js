/*! Built with http://stenciljs.com */
const { h } = window.gisviewer;

import Utils, { default$1 as L$1, SCALE_PLUGIN_TAG, default$2 as _ } from './chunk1.js';

class ScalePlugin {
    constructor() {
        this.compName = SCALE_PLUGIN_TAG;
        this.pluginSupportedUnits = ['km', 'mi'];
    }
    watchDistanceUnitType(newValue) {
        // Visibility of elements
        this.showScaleUnitsElementByType(newValue);
    }
    getControl() {
        return this.control;
    }
    showScaleUnitsElementByType(globalDistanceUnitType) {
        this.pluginSupportedUnits.forEach((unit) => {
            this.setScaleUnitsElementVisibility(unit, globalDistanceUnitType);
        });
    }
    setScaleUnitsElementVisibility(unit, globalDistanceUnitType) {
        let scaleUnitElement = this.gisMap.getContainer().querySelector(`.leaflet-control-scale-line.${unit}`);
        let visibilityForThisUnit = unit === this.fromGlobalUnitToElementUnit(globalDistanceUnitType);
        if (visibilityForThisUnit) {
            scaleUnitElement.classList.remove('hidden');
        }
        else {
            scaleUnitElement.classList.add('hidden');
        }
    }
    fromGlobalUnitToElementUnit(globalUnit) {
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
            position: this.config.scaleOptions.position,
            metric: true,
            imperial: true,
        };
        this.control = L$1.control.scale(options);
        this.gisMap.addControl(this.control);
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
        this.gisMap.removeControl(this.control);
    }
    static get is() { return "scale-plugin"; }
    static get properties() { return { "config": { "type": "Any", "attr": "config" }, "control": { "state": true }, "distanceUnitType": { "type": "Any", "attr": "distance-unit-type", "watchCallbacks": ["watchDistanceUnitType"] }, "getControl": { "method": true }, "gisMap": { "type": "Any", "attr": "gis-map" } }; }
    static get style() { return ".leaflet-control-scale-line {\n  text-align: center;\n  border: 2px solid #777 !important;\n  border-top: none !important;\n  margin-top: 0px !important; }\n\n.hidden {\n  display: none; }\n"; }
}

export { ScalePlugin };
