import { Component } from "@stencil/core";

@Component({
    tag: 'draw-bar-plugin',
    styleUrls: [
        '../../../../../../node_modules/leaflet-draw/dist/leaflet.draw.css',
    ]
})
export class DrawBarPlugin {
    constructor() {
        let a: mytypes.DrawBarConfig = {}
        console.log(a);
    }
}