import { Component, Prop, State } from "@stencil/core";
import { DistanceUnitType, PolylineMeasureConfig, PolylineMeasureOptions } from "../../../../../models/apiModels";
import L from "leaflet";
import * as polylineMeasure from 'leaflet.polylinemeasure';
import { POLYLINE_MEASURE_PLUGIN_TAG } from "../../../../../utils/statics";
import Utils from "../../../../../utils/utilities";

const IMPERIAL: string = 'landmiles';
const METERS: string = 'metres';

@Component({
    tag: 'polyline-measure-plugin',
    styleUrls: [
        '../../../../../../node_modules/leaflet.polylinemeasure/Leaflet.PolylineMeasure.css',
        './polyline-measure-plugin.scss'
    ]
})
export class PolylineMeasurePlugin {
    compName: string = POLYLINE_MEASURE_PLUGIN_TAG;
    @Prop() config: PolylineMeasureConfig
    @Prop() gisMap: L.Map
    @Prop() distanceUnitType: DistanceUnitType

    @State() control: L.Control;

    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        if (!this.gisMap) return;

        Utils.doNothing(polylineMeasure);
                
        this.control = this.createPlugin(this.config.polylineMeasureOptions);
        this.gisMap.addControl(this.control);
    }

    componentDidUnload() {
        console.log(`componentDidUnload - ${this.compName}`);
        this.gisMap.removeControl(this.control);
    }

    private createPlugin(options: PolylineMeasureOptions): any {
        const objCloned: PolylineMeasureOptions_Dev = Object.assign(
            { showUnitControl: true },
            { unit: this.comapUnits === Units.METRIC ? METERS : IMPERIAL },
            options
        );
        // let options = this.config.mouseCoordinateOptions;
        // options.position = 'bottomleft';
        let control: L.Control = new L.Control.PolylineMeasure(options);
        return control;
    }
}

export type PolylineMeasureOptions_Dev = PolylineMeasureOptions & {
    showUnitControl: boolean,
    unit: string,
};