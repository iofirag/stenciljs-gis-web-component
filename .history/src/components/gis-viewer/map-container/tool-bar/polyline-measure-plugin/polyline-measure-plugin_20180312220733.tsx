import { Component, Prop, State } from "@stencil/core";
import { DistanceUnitType, PolylineMeasureConfig, PolylineMeasureOptions } from "../../../../../models/apiModels";
import L from "leaflet";
// import * as polylineMeasure from 'leaflet.polylinemeasure';
import * as measure from 'leaflet-linear-measurement/src/Leaflet.LinearMeasurement'
import { MEASURE_PLUGIN_TAG } from "../../../../../utils/statics";
import Utils from "../../../../../utils/utilities";

// const IMPERIAL: string = 'landmiles';
// const METERS: string = 'metres';

@Component({
    tag: 'measure-plugin',
    styleUrls: [
        // '../../../../../../node_modules/leaflet.polylinemeasure/Leaflet.PolylineMeasure.css',
        '../../../../../../node_modules/leaflet-linear-measurement/sass/Leaflet.LinearMeasurement.scss',
        './polyline-measure-plugin.scss'
    ]
})
export class MeasurePlugin {
    compName: string = MEASURE_PLUGIN_TAG
    @Prop() config: PolylineMeasureConfig
    @Prop() gisMap: L.Map
    @Prop() distanceUnitType: DistanceUnitType

    @State() control: L.Control;

    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        if (!this.gisMap) return;

        // console.log(polylineMeasure)
        Utils.doNothing(measure);
        
        this.control = this.createPlugin(this.config.polylineMeasureOptions);
        this.gisMap.addControl(this.control);
    }

    componentDidUnload() {
        console.log(`componentDidUnload - ${this.compName}`);
        this.gisMap.removeControl(this.control);
    }

    private createPlugin(options: PolylineMeasureOptions): L.Control {
        console.log(options)
        // const clonedOptions: PolylineMeasureOptions_Dev = Object.assign(
        //     { showUnitControl: true },
        //     { unit: this.distanceUnitType === 'km' ? METERS : IMPERIAL },
        //     options
        // );
        // // options.position = 'bottomleft';
        // let control: L.Control = new L.Control.PolylineMeasure(clonedOptions);

        let control: L.Control = new L.Control.LinearMeasurement({
            unitSystem: 'imperial',
            color: '#FF0080',
            type: 'line'
        }) as L.Control;
        debugger
        // L.Control.LinearMeasurement
        return control;
    }
}

export type PolylineMeasureOptions_Dev = PolylineMeasureOptions & {
    showUnitControl: boolean,
    unit: string,
};