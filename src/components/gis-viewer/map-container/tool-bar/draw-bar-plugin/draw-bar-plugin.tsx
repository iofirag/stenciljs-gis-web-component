import { Component, Prop, State, Method } from "@stencil/core";
import { DrawBarConfig } from "../../../../../models";
import * as leafletDraw from 'leaflet-draw';
import L from "leaflet";
import { DRAW_BAR_PLUGIN_TAG, LAYER_MANAGER_PLUGIN_TAG } from "../../../../../utils/statics";
import Utils from "../../../../../utils/utilities";
import _ from "lodash";
import store from "../../../../store/store";
import { reaction } from "mobx";

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

    @State() control: L.Control;
    @State() drawnLayer: L.FeatureGroup;
    layerManagerEl: HTMLLayerManagerPluginElement;

    @Method()
    getControl(): L.Control {
        return this.control;
    }

    constructor() {
        reaction(
            () => store.state.mapConfig.distanceUnitType,
            distanceUnitType => console.log(`${this.compName} ${distanceUnitType}`)
        );
    }
    
    componentWillLoad() {
        // Dedicated Draw layer
        this.drawnLayer = new L.FeatureGroup();
        store.mapLayers.drawableLayers.push(this.drawnLayer);   // can bring leak

        let drawBarCloneOptions: any = this.config.drawBarOptions;
        drawBarCloneOptions.edit = {
            featureGroup: this.drawnLayer,
            remove: _.get(this, 'config.drawBarOptions.edit.remove', true)
        }
        this.control = new L.Control.Draw(drawBarCloneOptions);
    }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        this.layerManagerEl = this.gisMap.getContainer().querySelector(LAYER_MANAGER_PLUGIN_TAG);
        this.layerManagerEl.addingDrawableLayerToLayerController(this.drawnLayer);
        Utils.doNothing(leafletDraw);
        
        this.gisMap.addLayer(this.drawnLayer);
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