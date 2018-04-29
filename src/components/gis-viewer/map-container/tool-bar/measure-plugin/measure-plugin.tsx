import { Component, Prop, State, Method } from "@stencil/core";
import L from "leaflet";
import * as measure from 'leaflet.polylinemeasure';
import { MEASURE_PLUGIN_TAG } from "../../../../../utils/statics";
import Utils from "../../../../../utils/utilities";
import { MeasureConfig, DistanceUnitType, MeasureOptions } from "../../../../../models";
import store from "../../../../store/store";
import { reaction } from "mobx";
import _ from "lodash";


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

    @State() control: L.Control;

    @Method()
    getControl() {
        return this.control;
    }

    constructor() {
        reaction(
            () => store.state.mapConfig.distanceUnitType,
            distanceUnitType => this.changePluginUnits(distanceUnitType)
        );
    }

    componentWillLoad() {
        Utils.log_componentWillLoad(this.compName);
        this.control = this.createPlugin(this.config.measureOptions);
    }

    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        _.noop(measure);
        this.gisMap.addControl(this.control);
    }

    componentDidUnload() {
        console.log(`componentDidUnload - ${this.compName}`);
        this.gisMap.removeControl(this.control);
    }

    private createPlugin(options: MeasureOptions): L.Control {
        const clonedOptions: PolylineMeasureOptions_Dev = Object.assign(
            { showUnitControl: true },
            { unit: this.fromGlobalUnitToPluginUnit(store.state.mapConfig.distanceUnitType) },
            options
        );
        options.position = 'bottomleft';
        let control: L.Control = new L.Control.PolylineMeasure(clonedOptions);
        return control;
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
}

export type PolylineMeasureOptions_Dev = MeasureOptions & {
    showUnitControl: boolean,
    unit: string,
};
