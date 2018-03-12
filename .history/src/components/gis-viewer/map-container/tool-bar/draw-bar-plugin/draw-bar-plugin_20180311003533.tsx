import { Component, Prop } from "@stencil/core";
import { DrawBarConfig } from "../../../../../models/apiModels";
import * as leafletDraw from 'leaflet-draw';
import L from "leaflet";
import { DRAW_BAR_PLUGIN_TAG } from "../../../../../utils/statics";

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

    constructor() {
        console.log('88888888888')
    }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        if (!this.gisMap) return;

        console.log(leafletDraw)
        let drawControl = new L.Control.Draw(this.config.drawBarOptions);
        this.gisMap.addControl(drawControl);
    }
}