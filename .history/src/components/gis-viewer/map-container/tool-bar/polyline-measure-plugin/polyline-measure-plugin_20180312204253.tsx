import { Component, Prop, State } from "@stencil/core";
import { DistanceUnitType, PolylineMeasureConfig, PolylineMeasureOptions } from "../../../../../models/apiModels";
// import * as leafletDraw from 'leaflet-draw';
import L from "leaflet";
import { POLYLINE_MEASURE_PLUGIN_TAG } from "../../../../../utils/statics";
import Utils from "../../../../../utils/utilities";
import _ from "lodash";

@Component({
    tag: 'draw-bar-plugin',
    styleUrls: [
        '../../../../../../node_modules/leaflet-draw/dist/leaflet.draw.css',
        './draw-bar-plugin.scss'
    ]
})
export class DrawBarPlugin {
    compName: string = POLYLINE_MEASURE_PLUGIN_TAG;
    @Prop() config: PolylineMeasureConfig
    @Prop() gisMap: L.Map
    @Prop() distanceUnitType: DistanceUnitType

    @State() control: L.Control;

    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        if (!this.gisMap) return;

        Utils.doNothing(null);
                
        this.control = this.createPlugin(this.config.polylineMeasureOptions);
        this.gisMap.addControl(this.control);
    }

    componentDidUnload() {
        console.log(`componentDidUnload - ${this.compName}`);
        this.gisMap.removeControl(this.control);
    }

    private createPlugin(options: PolylineMeasureOptions): any {
        // let options = this.config.mouseCoordinateOptions;
        // options.position = 'bottomleft';
        let control: L.Control = new (options) as L.Control;
        return control;
    }
}