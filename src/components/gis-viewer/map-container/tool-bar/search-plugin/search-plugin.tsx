import L from "leaflet";
import { Component, Prop, State, Method } from "@stencil/core";
import * as search from 'leaflet-search';
import { SEARCH_PLUGIN_TAG } from "../../../../../utils/statics";
import { SearchConfig, SearchOptions } from "../../../../../models";
import Utils from "../../../../../utils/utilities";
import _ from "lodash";


@Component({
    tag: 'search-plugin',
    styleUrls: [
        '../../../../../../node_modules/leaflet-search/dist/leaflet-search.min.css',
        './search-plugin.scss',
    ]
})
export class SearchPlugin {
    compName: string = SEARCH_PLUGIN_TAG
    @Prop() config: SearchConfig
    @Prop() gisMap: L.Map

    @State() control: L.Control.Search;
    
    @Method()
    getControl(): L.Control {
        return this.control;
    }
    
    componentWillLoad() {
        Utils.log_componentWillLoad(this.compName);
        this.control = this.createPlugin(this.config.searchOptions);
    }

    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        _.noop(search);
        this.gisMap.addControl(this.control);
        this.fixCss();
    }

    componentDidUnload() {
        Utils.log_componentDidUnload(this.compName);
        this.gisMap.removeControl(this.control);
    }
    private createPlugin(options: SearchOptions): L.Control.Search {
        _.noop(options);

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