import L from 'leaflet';
import { SCALE_PLUGIN_TAG } from '../../../../utils/statics';
import Utils from '../../../../utils/utilities';
import _ from 'lodash';
import { reaction } from 'mobx';
import store from '../../../store/store';
export class ScalePlugin {
    constructor() {
        this.compName = SCALE_PLUGIN_TAG;
        this.pluginSupportedUnits = ['km', 'mi'];
        reaction(() => store.state.mapConfig.distanceUnitType, distanceUnitType => this.showScaleUnitsElementByType(distanceUnitType));
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
        // Create new component
        const options = {
            position: this.config.scaleOptions.position,
            metric: true,
            imperial: true,
        };
        this.control = L.control.scale(options);
    }
    componentWillUpdate() { }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        this.gisMap.addControl(this.control);
        this.initUnitElementsWithClasses();
        this.showScaleUnitsElementByType(store.state.mapConfig.distanceUnitType);
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
    static get properties() { return { "config": { "type": "Any", "attr": "config" }, "control": { "state": true }, "getControl": { "method": true }, "gisMap": { "type": "Any", "attr": "gis-map" } }; }
    static get style() { return "/**style-placeholder:scale-plugin:**/"; }
}
