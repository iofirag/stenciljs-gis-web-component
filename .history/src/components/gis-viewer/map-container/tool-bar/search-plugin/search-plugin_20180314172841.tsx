import { Component, Prop, State } from "@stencil/core";
// import { DistanceUnitType, MeasureConfig, MeasureOptions } from "../../../../../models/apiModels";
// import L from "leaflet";
import * as search from 'leaflet-search';
import { SEARCH_PLUGIN_TAG } from "../../../../../utils/statics";
import { SearchBoxConfig, MeasureOptions } from "../../../../../models/apiModels";
import Utils from "../../../../../utils/utilities";
// import Utils from "../../../../../utils/utilities";


@Component({
    tag: 'search-plugin',
    styleUrls: [
        '../../../../../../node_modules/leaflet-search/dist/leaflet-search.min.css',
        './search-plugin.scss',
    ]
})
export class SearchPlugin {
    compName: string = SEARCH_PLUGIN_TAG
    @Prop() config: SearchBoxConfig
    @Prop() gisMap: L.Map

    @State() control: L.Control;

//     private fromGlobalUnitToPluginUnit(globalUnit: DistanceUnitType): string {
//         switch (globalUnit.toLowerCase()) {
//             case 'km':
//                 return 'metres';
//             case 'mile':
//                 return 'landmiles';
//             case 'nauticalmiles':
//                 return 'nauticalmiles'
//             default:
//                 break;
//         }
//     }
//     private fromGlobalUnitToButtonUnit(globalUnit: DistanceUnitType): string {
//         switch (globalUnit.toLowerCase()) {
//             case 'km':
//                 return 'm';
//             case 'mile':
//                 return 'mi';
//             case 'nauticalmiles':
//                 return 'nm'
//             default:
//                 break;
//         }
//     }
//     private changePluginUnits(globalUnit: DistanceUnitType) {
//         const unitControlIdElement: HTMLElement = this.gisMap.getContainer().querySelector('#unitControlId');
//         if (!unitControlIdElement) return;
        
//         let pluginUnitOptions: string = this.fromGlobalUnitToButtonUnit(globalUnit);

//         while (unitControlIdElement.innerText !== pluginUnitOptions) {
//             unitControlIdElement.click();
//         }
//     }
    
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        if (!this.gisMap) return;

        Utils.doNothing(search);
        
        this.control = this.createPlugin(this.config.searchBoxOptions);
        this.gisMap.addControl(this.control);
    }

//     componentDidUnload() {
//         console.log(`componentDidUnload - ${this.compName}`);
//         this.gisMap.removeControl(this.control);
//     }
    private createPlugin(options: MeasureOptions): L.Control {
//         Utils.doNothing(options);
//         const clonedOptions: PolylineMeasureOptions_Dev = Object.assign(
//             { showUnitControl: true },
//             { unit: this.fromGlobalUnitToPluginUnit(this.distanceUnitType) },
//             options
//         );
//         options.position = 'bottomleft';
        // let control: L.Control = new L.Control.PolylineMeasure(clonedOptions);
        // return control;
        
        return null;
    }
}