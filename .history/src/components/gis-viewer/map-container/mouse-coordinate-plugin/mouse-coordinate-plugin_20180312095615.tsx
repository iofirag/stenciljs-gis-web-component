import { MOUSE_COORDINATE_PLUGIN_TAG } from "../../../../utils/statics";
import Utils from "../../../../utils/utilities";
import { Component, Prop, State } from "@stencil/core";
import L from "leaflet";
import * as mousecoordinatesystems from 'leaflet.mousecoordinatesystems'
import { MouseCoordinateConfig, MouseCoordinateOptions } from "../../../../models/apiModels";

@Component({
    tag: "mouse-coordinate-plugin",
    styleUrls: [
        "../../../../../node_modules/leaflet.mousecoordinatesystems/dist/leaflet.mousecoordinate.css"    
    ]
})
export class MouseCoordinagePlugin {
    compName: string = MOUSE_COORDINATE_PLUGIN_TAG;
    @Element el: HTMLMouse Element;
    @Prop() config: MouseCoordinateConfig;
    @Prop() gisMap: L.Map;
    @Prop() coordinateSystem: string;

    @State() control: L.Control;

    // componentWillLoad() {
    //     Utils.log_componentWillLoad(this.compName);
    // }

    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        this.control = this.createPlugin(this.config.mouseCoordinateOptions);
        this.gisMap.addControl(this.control);
        console.log(mousecoordinatesystems);
    }

    componentDidUnload() {
        Utils.log_componentDidUnload(this.compName);
        this.gisMap.removeControl(this.control);
    }

    private createPlugin(options: MouseCoordinateOptions): any {
        // let options = this.config.mouseCoordinateOptions;
        options.position = 'bottomleft';
        let control: L.Control = new L.Control.mouseCoordinate(options) as L.Control;
        return control;
    }
}