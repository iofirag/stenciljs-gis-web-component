import { Component, Prop } from "@stencil/core";
import { DrawBarConfig } from "../../../../../models/apiModels";
import 'leaflet-draw';
// import L from "leaflet";

@Component({
    tag: 'draw-bar-plugin',
    styleUrls: [
        '../../../../../../node_modules/leaflet-draw/dist/leaflet.draw.css',
    ]
})
export class DrawBarPlugin {
    @Prop() config: DrawBarConfig
    @Prop() gisMap: L.Map
    @Prop() metric: boolean

    constructor() {
        console.log('88888888888')
    }
    componentDidLoad() {
        // Utils.log_componentDidLoad(this.compName);
        // if (!this.gisMap) return;

        
        // let drawControl = new L.Control.Draw(this.config);
        // this.gisMap.addControl(drawControl);
    }
}