import { MOUSE_COORDINATE_PLUGIN_TAG } from "../../../../utils/statics";
import Utils from "../../../../utils/utilities";
import { Component, Prop, State, Element, Watch } from "@stencil/core";
import L from "leaflet";
import * as mousecoordinatesystems from 'leaflet.mousecoordinatesystems'
import { MouseCoordinateConfig, MouseCoordinateOptions } from "../../../../models/apiModels";
import _ from "lodash";

@Component({
    tag: "mouse-coordinate-plugin",
    styleUrls: [
        "../../../../../node_modules/leaflet.mousecoordinatesystems/dist/leaflet.mousecoordinate.css"    
    ]
})
export class MouseCoordinagePlugin {
    compName: string = MOUSE_COORDINATE_PLUGIN_TAG;
    @Element() mouseCoordinateEl: HTMLElement;
    @Prop() config: MouseCoordinateConfig;
    @Prop() gisMap: L.Map;
    @Prop() coordinateSystem: string;

    @State() control: L.Control;
    @State() control: L.Control;
    @State() control: L.Control;

    @Watch('coordinateSystem')
    watchHandler(newValue: string, oldValue: string) {
        console.log('The new value of activated is: ', newValue, oldValue);
        this.changeMouseCoordinates(newValue);
    }
    
    // componentWillLoad() {
    //     Utils.log_componentWillLoad(this.compName);
    // }

    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        const mouseCoordinateGps: MouseCoordinateOptions = {
            gpsLong: false,
        };

        const mouseCoordinateUtm: MouseCoordinateOptions= {
            utm: true,
            gps: false,
        };

        const mouseCoordinateUtmref: MouseCoordinateOptions = {
            utmref: true,
            gpsLong: false,
            gps: false,
        };
        let controlGps = this.createPlugin(mouseCoordinateGps);
        let controlUtm = this.createPlugin(mouseCoordinateUtm);
        let controlUtmref = this.createPlugin(mouseCoordinateUtmref);

        this.gisMap.addControl(controlGps);
        this.gisMap.addControl(controlUtm);
        this.gisMap.addControl(controlUtmref);

        console.log(mousecoordinatesystems);
    }

    componentDidUnload() {
        Utils.log_componentDidUnload(this.compName);
        this.gisMap.removeControl(this.control);
    }

    private createPlugin(options: MouseCoordinateOptions): any {
        // let options = this.config.mouseCoordinateOptions;
        options.position = 'bottomleft';
        let control: L.Control = new L.Control.mouseCoordinate(options) as L.Control;
        return control;
    }
    private changeMouseCoordinates(value: string) {
        const gpsElement: HTMLElement = document.querySelector('.gps') as HTMLElement;
        const utmElement: HTMLElement = document.querySelector('.utm') as HTMLElement;
        const utmrefElement: HTMLElement = document.querySelector('.utmref') as HTMLElement;

        const mouseCoordinateTypesElementCollection = [gpsElement, utmElement, utmrefElement];

        _.forEach(mouseCoordinateTypesElementCollection, (elm: HTMLElement) => {
            elm.style.display = elm.classList.contains(value) ? 'flex' : 'none';
        });
    }
}