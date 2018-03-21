import { ZOOM_TO_EXTENT_PLUGIN_TAG } from "../../../../../utils/statics";
import Utils from "../../../../../utils/utilities";
import { Component, Prop, State, Method, Event, EventEmitter } from "@stencil/core";
import L from 'leaflet';
import { ZoomToExtentConfig } from "../../../../../models/apiModels";


@Component({
    tag: 'zoom-to-extent-plugin',
    styleUrls: [
        'zoom-to-extent-plugin.scss'
    ]
})
export class ZoomToExtentPlugin {
    compName: string = ZOOM_TO_EXTENT_PLUGIN_TAG;

    @Prop() config: ZoomToExtentConfig;
    @Prop() gisMap: L.Map;

    @State() control: L.Control;
    
    @Event() zoomToExtentDoneEm: EventEmitter<null>;
    // @Event() distanceUnitsEm: EventEmitter;

    @Method()
    getControl() {
        return this.control;
    }
    @Method()
    zoomToExtent() {
        this.zoomToExtentClickHandler();
    }

    componentWillLoad() {
        Utils.log_componentWillLoad(this.compName);
    }

    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        this.control = this.addingZoomToExtent();
        this.gisMap.addControl(this.control);
    }

    componentDidUnload() {
        Utils.log_componentDidUnload(this.compName);
        this.gisMap.removeControl(this.control);
    }

    private addingZoomToExtent(): any {
        try {
            const customControl = L.Control.extend({
                // options: options,
                onAdd: () => {
                    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom zoom-to-extent-bt');
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
    private zoomToExtentClickHandler() {
        console.log(`${this.compName} zoomToExtentClickHandler`);
        // debugger
        const gisViewerEl: HTMLGisViewerElement = document.querySelector('gis-viewer');
        console.log(gisViewerEl)
        new gisViewerEl.zoomToExtentDoneEm
        this.zoomToExtentDoneEm.emit();
        // this.distanceUnitsEm.emit('mile');
        // this.distanceUnitsEm.emit('km');
    }
}