import { Component } from "@stencil/core";
import { DrawBarConfig } from "../../../../../models/apiModels";

@Component({
    tag: 'draw-bar-plugin',
    styleUrls: [
        '../../../../../../node_modules/leaflet-draw/dist/leaflet.draw.css',
    ]
})
export class DrawBarPlugin {
    @Prop() config: DrawBarConfig

    constructor() {
        console.log('88888888888')
    }
}