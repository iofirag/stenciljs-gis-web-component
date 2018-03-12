import { Component, Prop } from "@stencil/core";
import { DrawBarConfig } from "../../../../../models/apiModels";
import * as leafletDraw from 'leaflet-draw';
import L from "leaflet";
import { DRAW_BAR_PLUGIN_TAG } from "../../../../../utils/statics";
import Utils from "../../../../../utils/utilities";

@Component({
    tag: 'draw-bar-plugin',
    styleUrls: [
        '../../../../../../node_modules/leaflet-draw/dist/leaflet.draw.css',
    ]
})
export class DrawBarPlugin {
    compName: string = DRAW_BAR_PLUGIN_TAG;
    @Prop() config: DrawBarConfig
    @Prop() gisMap: L.Map
    @Prop() metric: boolean

    @State() drawControl: any;

    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        if (!this.gisMap) return;

        console.log(leafletDraw)
        let drawControl = new L.Control.Draw(this.config.drawBarOptions);
        this.gisMap.addControl(drawControl);
    }

    componentDidUnload() {
        // console.log(`componentDidUnload - ${this.compName}`);
        // this.gisMap.removeControl(this.drawControl);
    }
}