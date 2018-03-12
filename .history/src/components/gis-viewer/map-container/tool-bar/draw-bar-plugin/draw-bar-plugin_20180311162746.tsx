import { Component, Prop, State } from "@stencil/core";
import { DrawBarConfig } from "../../../../../models/apiModels";
import * as leafletDraw from 'leaflet-draw';
import L from "leaflet";
import { DRAW_BAR_PLUGIN_TAG } from "../../../../../utils/statics";
import Utils from "../../../../../utils/utilities";
import _ from "lodash";

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

    @State() drawControl: L.Control;


    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        if (!this.gisMap) return;

        console.log(leafletDraw)
        let drawBardevOptions: any = this.config.drawBarOptions;

        let drawnLayer = new L.FeatureGroup();
        this.gisMap.addLayer(drawnLayer);
        drawBardevOptions.edit = {
            featureGroup: new L.FeatureGroup(),
            remove: _.get(this, 'config.drawBarOptions.edit.remove', true)
        }
        this.drawControl = new L.Control.Draw(drawBardevOptions);
        this.gisMap.addControl(this.drawControl);
    }

    componentDidUnload() {
        console.log(`componentDidUnload - ${this.compName}`);
        this.gisMap.removeControl(this.drawControl);
    }
}