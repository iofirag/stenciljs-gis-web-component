// import L from 'leaflet';
import 'leaflet-draw';
import { Component, Prop, State } from '@stencil/core';
import { DRAW_BAR_PLUGIN_TAG } from '../../../../../utils/statics';
import { DrawBarConfig } from '../../../../../models/apiModels';
// import Utils from '../../../../../utils/utilities';


@Component({
    tag: 'draw-bar-plugin',
    styleUrls: [
        '../../../../../../node_modules/leaflet-draw/dist/leaflet.draw.css',
    ]
})
export class DrawBarPlugin {
    compName: string = DRAW_BAR_PLUGIN_TAG;
    @Prop() config: any;//DrawBarConfig;
    @Prop() metric: boolean;
    @Prop() gisMap: any;
    @State() drawControl: any;
    @Prop() mytest: any;

    constructor() {
        let a: DrawBarConfig = {}
        console.log(a);
    }
    componentDidLoad() {
        // Utils.log_componentDidLoad(this.compName);
        // if (!this.gisMap) return;
        
        // this.drawControl = new L.Control.Draw(this.config);
        // this.gisMap.addControl(this.drawControl);
    }

    componentDidUnload() {
        // console.log(`componentDidUnload - ${this.compName}`);
        // this.gisMap.removeControl(this.drawControl);
    }
}