import { Component } from "@stencil/core";

@Component({
    tag: 'draw-bar-plugin',
    styleUrls: [
        '../../../../../../node_modules/leaflet-draw/dist/leaflet.draw.css',
    ]
})
export class DrawBarPlugin {
    @Prop() config: DrawBar

    constructor() {
        console.log('88888888888')
    }
}