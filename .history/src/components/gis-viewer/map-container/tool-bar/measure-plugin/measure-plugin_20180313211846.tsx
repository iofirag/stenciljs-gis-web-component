import { Component, Prop, State, Watch } from "@stencil/core";
import { DistanceUnitType, MeasureConfig, MeasureOptions } from "../../../../../models/apiModels";
import L from "leaflet";
// import * as measure from 'leaflet-linear-measure/src/basic.ruler-src.js';
import * as measure from 'leaflet.polylinemeasure';
import { MEASURE_PLUGIN_TAG } from "../../../../../utils/statics";
import Utils from "../../../../../utils/utilities";

const IMPERIAL: string = 'landmiles';
const METERS: string = 'metres';

@Component({
    tag: 'measure-plugin',
    styleUrls: [
        '../../../../../../node_modules/leaflet.polylinemeasure/Leaflet.PolylineMeasure.css',
        './measure-plugin.scss',
    ]
})
export class MeasurePlugin {
    compName: string = MEASURE_PLUGIN_TAG
    @Prop() config: MeasureConfig
    @Prop() gisMap: L.Map
    @Prop() distanceUnitType: DistanceUnitType

    @State() control: L.Control;

    @Watch('distanceUnitType')
    watchDistanceUnitType(newValue: DistanceUnitType) {
        console.log(newValue);

        
        // this.showScaleUnitsElementByType(newValue);
    }

    public toggleUnits() {
        const unitControlIdElement = document.getElementById('unitControlId');

        if (unitControlIdElement) {
            if (unitControlIdElement.innerText === 'nm') {
                unitControlIdElement.click();
            }

            unitControlIdElement.click();

            if (unitControlIdElement.innerText === 'nm') {
                unitControlIdElement.click();
            }
        }
    }
    
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        if (!this.gisMap) return;

        // console.log(polylineMeasure)
        Utils.doNothing(measure);
        
        // this.control = this.createPlugin(this.config.measureOptions);
        this.control = this.createPlugin(this.config.measureOptions);
        this.gisMap.addControl(this.control);
    }

    componentDidUnload() {
        console.log(`componentDidUnload - ${this.compName}`);
        this.gisMap.removeControl(this.control);
    }
    private createPlugin(options: MeasureOptions): L.Control {
        Utils.doNothing(options);
        const clonedOptions: any = Object.assign(
            { showUnitControl: true },
            { unit: this.distanceUnitType === 'km' ? METERS : IMPERIAL },
            options
        );
        // options.position = 'bottomleft';
        let control: L.Control = new L.Control.PolylineMeasure(clonedOptions);
        return control;

        // let cost_underground = 12.55,
        //     cost_above_ground = 17.89,
        //     html = [
        //         '<b>',
        //         'Route',
        //         // '${total_above_ground}',
        //         // '${total_underground}',
        //         '</b>'
        //     ].join(''),
        //     numberWithCommas = function (x) {
        //         return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        //     };
        // let Core = L.Control.LinearCore.extend({
        //     onSelect: function (e) {

        //         if (!e.total) {
        //             return;
        //         }

        //         var distance = e.total.scalar;

        //         if (e.total.unit === 'mi') {
        //             distance *= e.sub_unit;

        //         } else if (e.total.unit === 'km') {
        //             distance *= 3280.84;

        //         } else if (e.total.unit === 'm') {
        //             distance *= 3.28084;
        //         }

        //         var data = {
        //             total_above_ground: numberWithCommas(L.Util.formatNum(cost_above_ground * distance, 2)),
        //             total_underground: numberWithCommas(L.Util.formatNum(cost_underground * distance, 2))
        //         };

        //         if (e.rulerOn) {
        //             var content = L.Util.template(html, data),
        //                 popup = L.popup().setContent(content);

        //             e.total_label.bindPopup(popup, { offset: [45, 0] });
        //             e.total_label.openPopup();
        //         }
        //     }
        // });

        // return new Core({
        //     unitSystem: 'imperial',
        //     color: '#FF0080',
        //     features: ['ruler'],
        // })
    }
    // private createPlugin(options: MeasureOptions): L.Control {
    //     console.log(options)
    //     // const clonedOptions: PolylineMeasureOptions_Dev = Object.assign(
    //     //     { showUnitControl: true },
    //     //     { unit: this.distanceUnitType === 'km' ? METERS : IMPERIAL },
    //     //     options
    //     // );
    //     // // options.position = 'bottomleft';
    //     // let control: L.Control = new L.Control.PolylineMeasure(clonedOptions);
    //     debugger
    //     let control: L.Control = new L.Control.LinearMeasurement({
    //         unitSystem: 'imperial',
    //         color: '#FF0080',
    //         type: 'line'
    //     }) as L.Control;
    //     debugger
    //     // L.Control.LinearMeasurement
    //     return control;
    // }
}

// export type PolylineMeasureOptions_Dev = MeasureOptions & {
//     showUnitControl: boolean,
//     unit: string,
// };