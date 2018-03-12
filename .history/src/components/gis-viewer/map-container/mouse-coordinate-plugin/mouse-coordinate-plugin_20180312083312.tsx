import { MOUSE_COORDINATE_PLUGIN_TAG } from "../../../../utils/statics";
import Utils from "../../../../utils/utilities";
import { Component, Prop, State } from "@stencil/core";
import L from "leaflet";
import * as mousecoordinatesystems from 'leaflet.mousecoordinatesystems'
import { MouseCoordinateConfig } from "../../../../models/apiModels";

@Component({
    tag: "full-screen-plugin",
    styleUrls: [
        "../../../../../node_modules/leaflet.mousecoordinatesystems/dist/leaflet.mousecoordinate.css"    
    ]
})
export class MouseCoordinagePlugin {
    compName: string = MOUSE_COORDINATE_PLUGIN_TAG;
    @Prop() config: MouseCoordinateConfig;
    @Prop() gisMap: L.Map;
    @Prop() coordinateSystem: string;

    @State() control: L.Control;

    // @State() fullScreenControl: L.Control;
    // // @Event() distanceUnitsEm: EventEmitter;

    // componentWillLoad() {
    //     Utils.log_componentWillLoad(this.compName);
    // }

    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        this.control = this.createPlugin();
        this.gisMap.addControl(this.control);
        debugger
        console.log(mousecoordinatesystems);
    }

    componentDidUnload() {
        Utils.log_componentDidUnload(this.compName);
        this.gisMap.removeControl(this.control);
    }

    private createPlugin(options: any): any {
        let options = this.config.mouseCoordinateOptions;
        options.position = 'bottomleft';
        this.control = new L.Control.mouseCoordinate(options) as L.Control;
    }
}