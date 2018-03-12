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
        "../../../../../node_modules/leaflet.mousecoordinatesystems/dist/leaflet.mousecoordinatesystems.css"    
    ]
})
export class MouseCoordinagePlugin {
    compName: string = MOUSE_COORDINATE_PLUGIN_TAG;
    @Element() mouseCoordinateEl: HTMLElement;
    @Prop() config: MouseCoordinateConfig;
    @Prop() gisMap: L.Map;
    @Prop() coordinateSystem: string;

    @State() controlGps: L.Control;
    @State() controlUtm: L.Control;
    @State() controlUtmref: L.Control;

    @Watch('coordinateSystem')
    watchHandler(newValue: string, oldValue: string) {
        console.log('The new value of activated is: ', newValue, oldValue);
        this.changeCoordinateSystemHandler(newValue);
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
        this.controlGps = this.createPlugin(mouseCoordinateGps);
        this.mouseCoordinateEl.querySelector('')
        // utmElement.style.display = 'none';
        // utmrefElement.style.display = 'none';

        this.controlUtm = this.createPlugin(mouseCoordinateUtm);


        this.controlUtmref = this.createPlugin(mouseCoordinateUtmref);

        const gpsElement: HTMLElement = this.mouseCoordinateEl.querySelector('.gps') as HTMLElement;
        const utmElement: HTMLElement = this.mouseCoordinateEl.querySelector('.utm') as HTMLElement;
        const utmrefElement: HTMLElement = document.querySelector('.utmref') as HTMLElement;


        this.gisMap.addControl(this.controlGps);
        this.gisMap.addControl(this.controlUtm);
        this.gisMap.addControl(this.controlUtmref);

        console.log(mousecoordinatesystems);
    }

    componentDidUnload() {
        Utils.log_componentDidUnload(this.compName);
        this.gisMap.removeControl(this.controlGps);
        this.gisMap.removeControl(this.controlUtm);
        this.gisMap.removeControl(this.controlUtmref);
    }

    private createPlugin(options: MouseCoordinateOptions): any {
        // let options = this.config.mouseCoordinateOptions;
        options.position = 'bottomleft';
        let control: L.Control = new L.Control.mouseCoordinate(options) as L.Control;
        return control;
    }
    // public initMouseCoordinates(mouseCoordinate: MouseCoordinateOptions) {
    //     const gpsElement: any = document.querySelector('.gps');
    //     const utmElement: any = document.querySelector('.utm');
    //     const utmrefElement: any = document.querySelector('.utmref');

    //     if (mouseCoordinate.utm) {
    //         gpsElement.style.display = 'none';
    //         utmrefElement.style.display = 'none';
    //     }

    //     if (mouseCoordinate.utmref) {
    //         gpsElement.style.display = 'none';
    //         utmElement.style.display = 'none';
    //     }

    //     if (mouseCoordinate.gps) {
    //         utmElement.style.display = 'none';
    //         utmrefElement.style.display = 'none';
    //     }
    // }
    private changeCoordinateSystemHandler(value: string) {
        const gpsElement: HTMLElement = document.querySelector('.gps') as HTMLElement;
        const utmElement: HTMLElement = document.querySelector('.utm') as HTMLElement;
        const utmrefElement: HTMLElement = document.querySelector('.utmref') as HTMLElement;

        const mouseCoordinateTypesElementCollection = [gpsElement, utmElement, utmrefElement];

        _.forEach(mouseCoordinateTypesElementCollection, (elm: HTMLElement) => {
            elm.style.display = elm.classList.contains(value) ? 'flex' : 'none';
        });
    }
}