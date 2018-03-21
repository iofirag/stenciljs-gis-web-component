import { Component, Prop, State, Watch, Method } from "@stencil/core";
import { DistanceUnitType, MeasureConfig, MeasureOptions } from "../../../../../models/apiModels";
import L from "leaflet";
import * as measure from 'leaflet.polylinemeasure';
import { MEASURE_PLUGIN_TAG } from "../../../../../utils/statics";
import Utils from "../../../../../utils/utilities";


@Component({
    tag: 'measure-plugin',
    styleUrls: [
        '../../../../../../node_modules/leaflet.polylinemeasure/Leaflet.PolylineMeasure.css',
        './measure-plugin.scss',
    ]
})
export class MeasurePlugin {
    compName: string = MEASURE_PLUGIN_TAG
    @Prop() config: MeasureConfig
    @Prop() gisMap: L.Map
    @Prop() distanceUnitType: DistanceUnitType

    @State() control: L.Control;

    @Watch('distanceUnitType')
    watchDistanceUnitType(newValue: DistanceUnitType) {
        console.log(newValue);
        this.changePluginUnits(newValue);
    }

    @Method()
    getControl() {
        return this.control;
    }
    
    private fromGlobalUnitToPluginUnit(globalUnit: DistanceUnitType): string {
        switch (globalUnit.toLowerCase()) {
            case 'km':
                return 'metres';
            case 'mile':
                return 'landmiles';
            case 'nauticalmiles':
                return 'nauticalmiles'
            default:
                break;
        }
    }
    private fromGlobalUnitToButtonUnit(globalUnit: DistanceUnitType): string {
        switch (globalUnit.toLowerCase()) {
            case 'km':
                return 'm';
            case 'mile':
                return 'mi';
            case 'nauticalmiles':
                return 'nm'
            default:
                break;
        }
    }
    private changePluginUnits(globalUnit: DistanceUnitType) {
        const unitControlIdElement: HTMLElement = this.gisMap.getContainer().querySelector('#unitControlId');
        if (!unitControlIdElement) return;
        
        let pluginUnitOptions: string = this.fromGlobalUnitToButtonUnit(globalUnit);

        while (unitControlIdElement.innerText !== pluginUnitOptions) {
            unitControlIdElement.click();
        }
    }
    
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        if (!this.gisMap) return;

        Utils.doNothing(measure);
        
        this.control = this.createPlugin(this.config.measureOptions);
        this.gisMap.addControl(this.control);
    }

    componentDidUnload() {
        console.log(`componentDidUnload - ${this.compName}`);
        this.gisMap.removeControl(this.control);
    }
    private createPlugin(options: MeasureOptions): L.Control {
        Utils.doNothing(options);
        const clonedOptions: PolylineMeasureOptions_Dev = Object.assign(
            { showUnitControl: true },
            { unit: this.fromGlobalUnitToPluginUnit(this.distanceUnitType) },
            options
        );
        options.position = 'bottomleft';
        let control: L.Control = new L.Control.PolylineMeasure(clonedOptions);
        return control;
    }
}

export type PolylineMeasureOptions_Dev = MeasureOptions & {
    showUnitControl: boolean,
    unit: string,
};