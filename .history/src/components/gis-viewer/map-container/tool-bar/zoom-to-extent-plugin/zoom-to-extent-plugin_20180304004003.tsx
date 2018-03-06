// import { Event, EventEmitter } from '@stencil/core';
import { ZOOM_TO_EXTENT_PLUGIN_TAG } from "../../../../../utils/statics";
import Utils from "../../../../../utils/utilities";
import { Component, Prop, State } from "@stencil/core";
import * as from "leaflet";
import { DomUtil } from "leaflet";
// import L from 'leaflet';


@Component({
    tag: 'zoom-to-extent-plugin',
    styleUrls: [
        'zoom-to-extent-plugin.scss'
    ]
})
export class ZoomToExtentPlugin {
    compName: string = ZOOM_TO_EXTENT_PLUGIN_TAG;
    @Prop() gisMap: L.Map;
    @State() zoomControl: any;
    // @Event() distanceUnitsEm: EventEmitter;

    componentWillLoad() {
        Utils.log_componentWillLoad(this.compName);
    }

    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        this.zoomControl = this.addingZoomToExtent();
        this.gisMap.addControl(this.zoomControl);
    }

    componentDidUnload() {
        Utils.log_componentDidUnload(this.compName);
        this.gisMap.removeControl(this.zoomControl);
    }

    private addingZoomToExtent(): any {
        try {
            const customControl = Control.extend({
                // options: options,
                onAdd: () => {
                    const container = DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom zoom-to-extent-bt');
                    container.setAttribute('title', 'Zoom to extent');

                    // this.zoomToExtentClickHandler.bind(this);
                    container.addEventListener('click', this.zoomToExtentClickHandler.bind(this));

                    return container;
                },
            });
            return new customControl();
        } catch (e) {
            console.error('failed to create custom control: ' + e);
            return null;
        }
    }
    zoomToExtentClickHandler() {
        console.log(`${this.compName} zoomToExtentClickHandler`);
        // this.context.zoomToExtent();
        
        // this.distanceUnitsEm.emit('mile');
        // this.distanceUnitsEm.emit('km');
    }
}