import L from 'leaflet';
import 'leaflet-draw';
import { Component, Prop, State } from '@stencil/core';
import { DRAW_BAR_PLUGIN_TAG } from '../../../../../utils/statics';
import Utils from '../../../../../utils/utilities';
import { /* DrawBarConfig */ } from '../../../../../models/apiModels';


@Component({
    tag: 'draw-bar-plugin',
    styleUrls: [
        '../../../../../../node_modules/leaflet-draw/dist/leaflet.draw.css',
    ]
})
export class DrawBarPlugin {
    compName: string = DRAW_BAR_PLUGIN_TAG;
    @Prop() config: any;
    @Prop() metric: boolean;
    @Prop() gisMap: any;
    @State() drawControl: any;

    constructor() {
    }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        debugger
        // if (!this.gisMap) return;
        
        this.drawControl = new L.Control.Draw(this.config.drawBarOptions as any || {});
        this.gisMap.addControl(this.drawControl);
    }

    componentDidUnload() {
        console.log(`componentDidUnload - ${this.compName}`);
        this.gisMap.removeControl(this.drawControl);
    }
}