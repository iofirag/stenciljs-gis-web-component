import { DROP_DOWN_PLUGIN_TAG } from "../../../../../utils/statics";
import Utils from "../../../../../utils/utilities";
import { Component, Prop, State, Method, Event, EventEmitter } from "@stencil/core";
import L from 'leaflet';
import { ZoomToExtentConfig } from "../../../../../models/apiModels";


@Component({
    tag: 'drop-down-plugin',
    styleUrls: [
        'drop-down-plugin.scss'
    ]
})
export class DropDownPlugin {
    compName: string = DROP_DOWN_PLUGIN_TAG;

    @Prop() dropDownData: any[];
    @Prop() dropDownTitle: string;
    @Prop() gisMap: L.Map;

    @State() control: L.Control;
    
    // @Event() zoomToExtentDoneEm: EventEmitter<null>;

    @Method()
    getControl() {
        return this.control;
    }

    componentWillLoad() {
        Utils.log_componentWillLoad(this.compName);
    }

    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        this.control = this.createControl();
        this.gisMap.addControl(this.control);
    }

    componentDidUnload() {
        Utils.log_componentDidUnload(this.compName);
        this.gisMap.removeControl(this.control);
    }

    private createControl(): L.Control {
        try {
            const customControl = L.Control.extend({
                // options: options,
                onAdd: () => {
                    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom zoom-to-extent-bt');
                    container.setAttribute('title', 'Zoom to extent');

                    // this.zoomToExtentClickHandler.bind(this);
                    container.addEventListener('click', this.controlClickHandler.bind(this));

                    return container;
                },
            });
            return new customControl();
        } catch (e) {
            console.error('failed to create custom control: ' + e);
            return null;
        }
    }
    private controlClickHandler() {
        console.log(`${this.compName} zoomToExtentClickHandler`);
        // TBD
        // this.zoomToExtentDoneEm.emit();
    }
}