import { Component, Prop, State } from "@stencil/core";
import { DistanceUnitType, MeasureConfig, MeasureOptions } from "../../../../../models/apiModels";
import L from "leaflet";
// import * as polylineMeasure from 'leaflet.polylinemeasure';
import * as measure from 'basic'
import { MEASURE_PLUGIN_TAG } from "../../../../../utils/statics";
import Utils from "../../../../../utils/utilities";

// const IMPERIAL: string = 'landmiles';
// const METERS: string = 'metres';

@Component({
    tag: 'measure-plugin1',
    styleUrls: [
        // '../../../../../../node_modules/leaflet-linear-measure/sass/Leaflet.LinearMeasurement.scss',
        './basic.ruler-src.css',
        './measure-plugin.scss'
    ]
})
export class MeasurePlugin1 {
    compName: string = MEASURE_PLUGIN_TAG
    @Prop() config: MeasureConfig
    @Prop() gisMap: L.Map
    @Prop() distanceUnitType: DistanceUnitType

    @State() control: L.Control;

    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        if (!this.gisMap) return;

        // console.log(polylineMeasure)
        Utils.doNothing(measure);
        
        // this.control = this.createPlugin(this.config.measureOptions);
        this.control = this.createPlugin2(this.config.measureOptions);
        this.gisMap.addControl(this.control);
    }

    componentDidUnload() {
        console.log(`componentDidUnload - ${this.compName}`);
        this.gisMap.removeControl(this.control);
    }
    private createPlugin2(options: MeasureOptions): L.Control {
        Utils.doNothing(options);
        let cost_underground = 12.55,
            cost_above_ground = 17.89,
            html = [
                '<table>',
                ' <tr><td class="cost_label">Cost Above Ground:</td><td class="cost_value">${total_above_ground}</td></tr>',
                ' <tr><td class="cost_label">Cost Underground:</td><td class="cost_value">${total_underground}</td></tr>',
                '</table>'
            ].join(''),
            numberWithCommas = function (x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
        debugger
        let Core = L.Control.LinearMeasurement.extend({
            onSelect: function (e) {

                if (!e.total) {
                    return;
                }

                var distance = e.total.scalar;

                if (e.total.unit === 'mi') {
                    distance *= e.sub_unit;

                } else if (e.total.unit === 'km') {
                    distance *= 3280.84;

                } else if (e.total.unit === 'm') {
                    distance *= 3.28084;
                }

                var data = {
                    total_above_ground: numberWithCommas(L.Util.formatNum(cost_above_ground * distance, 2)),
                    total_underground: numberWithCommas(L.Util.formatNum(cost_underground * distance, 2))
                };

                if (e.rulerOn) {
                    var content = L.Util.template(html, data),
                        popup = L.popup().setContent(content);

                    e.total_label.bindPopup(popup, { offset: [45, 0] });
                    e.total_label.openPopup();
                }
            }
        });

        return new Core({
            unitSystem: 'imperial',
            color: '#FF0080',
            features: ['ruler'],
        })
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