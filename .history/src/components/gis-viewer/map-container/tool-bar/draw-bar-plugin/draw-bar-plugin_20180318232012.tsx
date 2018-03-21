import { Component, Prop, State, Method } from "@stencil/core";
import { DrawBarConfig, DistanceUnitType } from "../../../../../models/apiModels";
import * as leafletDraw from 'leaflet-draw';
import L from "leaflet";
import { DRAW_BAR_PLUGIN_TAG } from "../../../../../utils/statics";
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
    compName: string = DRAW_BAR_PLUGIN_TAG;
    @Prop() config: DrawBarConfig
    @Prop() gisMap: L.Map
    @Prop() distanceUnitType: DistanceUnitType

    @State() control: L.Control;
    @State() drawnLayer: L.FeatureGroup;

    @Method()
    getControl() {
        return this.control;
    }
    
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        if (!this.gisMap) return;

        Utils.doNothing(leafletDraw);
        
        // Dedicated Draw layer
        this.drawnLayer = new L.FeatureGroup();
        this.gisMap.addLayer(this.drawnLayer);
        
        let drawBarCloneOptions: any = this.config.drawBarOptions;
        drawBarCloneOptions.edit = {
            featureGroup: this.drawnLayer,
            remove: _.get(this, 'config.drawBarOptions.edit.remove', true)
        }
        this.control = new L.Control.Draw(drawBarCloneOptions);
        this.gisMap.addControl(this.control);


        this.gisMap.on(L.Draw.Event.CREATED, (e: any) => {
            this.drawnLayer.addLayer(e.layer);
        });
    }

    componentDidUnload() {
        console.log(`componentDidUnload - ${this.compName}`);
        this.gisMap.removeControl(this.control);
    }

}