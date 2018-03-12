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
    @State() drawnLayer: L.FeatureGroup;


    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        if (!this.gisMap) return;

        console.log(leafletDraw)
        let drawBardevOptions: any = this.config.drawBarOptions;

        this.drawnLayer = new L.FeatureGroup();
        this.gisMap.addLayer(this.drawnLayer);
        
        drawBardevOptions.edit = {
            featureGroup: this.drawnLayer,
            remove: _.get(this, 'config.drawBarOptions.edit.remove', true)
        }
        this.drawControl = new L.Control.Draw(drawBardevOptions);
        this.gisMap.addControl(this.drawControl);


        this.gisMap.on(L.Draw.Event.CREATED, (e: any) => {
            debugger
            var type = e.layerType,
                layer = e.layer;
            if (type === 'marker') {
                // Do marker specific actions
            }
            // Do whatever else you need to. (save to db; add to map etc)
            this.drawnLayer.addLayer(e.layer);
        });
    }

    componentDidUnload() {
        console.log(`componentDidUnload - ${this.compName}`);
        this.gisMap.removeControl(this.drawControl);
    }
}