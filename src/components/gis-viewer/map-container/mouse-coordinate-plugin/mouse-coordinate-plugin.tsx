import { MOUSE_COORDINATE_PLUGIN_TAG } from "../../../../utils/statics";
import Utils from "../../../../utils/utilities";
import { Component, Prop, State } from "@stencil/core";
import L from "leaflet";
import * as mousecoordinatesystems from 'leaflet.mousecoordinatesystems'
import { MouseCoordinateConfig, MouseCoordinateOptions } from "../../../../models";
import _ from "lodash";
import store from "../../../store/store";
import { reaction } from "mobx";
// import { observable } from "mobx";

@Component({
    tag: "mouse-coordinate-plugin",
    styleUrls: [
        '../../../../../node_modules/leaflet.mousecoordinatesystems/dist/leaflet.mousecoordinatesystems.css',
        './mouse-coordinate-plugin.scss'
    ]
})
export class MouseCoordinagePlugin {
    compName: string = MOUSE_COORDINATE_PLUGIN_TAG;
    // @Element() mouseCoordinateEl: HTMLElement;
    @Prop() config: MouseCoordinateConfig;
    @Prop() gisMap: L.Map;

    @State() controlGps: L.Control;
    @State() controlUtm: L.Control;
    @State() controlUtmref: L.Control;
    
    constructor() {
        reaction(
            () => store.state.mapConfig.coordinateSystemType,
            coordinateSystemType => this.changeCoordinateSystemHandler(coordinateSystemType)
        );
    }
    componentWillLoad() {
        Utils.log_componentWillLoad(this.compName);
        const mouseCoordinateGps: MouseCoordinateOptions = {
            gpsLong: false,
        };

        const mouseCoordinateUtm: MouseCoordinateOptions = {
            utm: true,
            gps: false,
        };

        const mouseCoordinateUtmref: MouseCoordinateOptions = {
            utmref: true,
            gpsLong: false,
            gps: false,
        };
        this.controlGps = this.createPlugin(mouseCoordinateGps);
        this.controlUtm = this.createPlugin(mouseCoordinateUtm);
        this.controlUtmref = this.createPlugin(mouseCoordinateUtmref);
    }

    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        this.gisMap.addControl(this.controlGps);
        this.gisMap.addControl(this.controlUtm);
        this.gisMap.addControl(this.controlUtmref);
        this.changeCoordinateSystemHandler(store.state.mapConfig.coordinateSystemType)
        _.noop(mousecoordinatesystems);

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