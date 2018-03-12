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
    compName: string = Mouse;
    // @Prop() config: MouseCoordinateConfig;
    // @Prop() gisMap: L.Map;

    // @State() fullScreenControl: L.Control;
    // // @Event() distanceUnitsEm: EventEmitter;

    // componentWillLoad() {
    //     Utils.log_componentWillLoad(this.compName);
    // }

    // componentDidLoad() {
    //     Utils.log_componentDidLoad(this.compName);
    //     this.fullScreenControl = this.createPlugin();
    //     this.gisMap.addControl(this.fullScreenControl);
    // }

    // componentDidUnload() {
    //     Utils.log_componentDidUnload(this.compName);
    //     this.gisMap.removeControl(this.fullScreenControl);
    // }

    // private createPlugin(): any {
    //     try {
    //         const customControl = L.Control.extend({
    //             // options: options,
    //             onAdd: () => {
    //                 const container = L.DomUtil.create(
    //                     "div",
    //                     "leaflet-bar leaflet-control leaflet-control-custom leaflet-control-fullscreen"
    //                 );
    //                 let a = document.createElement("a");
    //                 container.appendChild(a);
    //                 container.setAttribute("title", "Full-Screen");

    //                 container.addEventListener(
    //                     "click",
    //                     this.buttonClickHandler.bind(this)
    //                 );

    //                 return container;
    //             }
    //         });
    //         return new customControl();
    //     } catch (e) {
    //         console.error("failed to create custom control: " + e);
    //         return null;
    //     }
    // }
    // buttonClickHandler() {
    //     console.log(`${this.compName} click`);
    //     console.log(this.gisMap);
    //     console.log(fullscreen);
    //     this.gisMap.toggleFullscreen();
    //     // this.distanceUnitsEm.emit('mile');
    //     // this.distanceUnitsEm.emit('km');
    // }
}