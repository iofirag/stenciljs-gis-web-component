import { Component, Prop, State, Method } from "@stencil/core";
import * as search from 'leaflet-search';
import { SEARCH_PLUGIN_TAG } from "../../../../../utils/statics";
import { SearchBoxConfig, SearchBoxOptions } from "../../../../../models/apiModels";
import Utils from "../../../../../utils/utilities";
import L from "leaflet";


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
    
    @Method()
    getControl() {
        return this.control;
    }
    
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        if (!this.gisMap) return;

        Utils.doNothing(search);
        
        this.control = this.createPlugin(this.config.searchBoxOptions);
        this.gisMap.addControl(this.control);
        this.fixCss();
    }

//     componentDidUnload() {
//         console.log(`componentDidUnload - ${this.compName}`);
//         this.gisMap.removeControl(this.control);
//     }
    private createPlugin(options: SearchBoxOptions): L.Control {
        Utils.doNothing(options);

        const searchController: any = new L.Control.Search({
            url: options.queryServerUrl,
            jsonpParam: 'json_callback',
            propertyName: 'display_name',
            propertyLoc: ['lat', 'lon'],
            marker: new L.Marker([0, 0]),
            autoCollapse: true,
            autoType: false,
            minLength: 2
        });

        return searchController;
    }
    private fixCss() {
        // Fix css, remove 2 props
        const searchElements = document.getElementsByClassName("search-button");
        if (searchElements.length) {
            const elem = searchElements[0] as HTMLElement;
            elem.classList.add('leaflet-bar');
        }
    }
}