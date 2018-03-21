import * as search from 'leaflet-search';
import { SEARCH_PLUGIN_TAG } from "../../../../../utils/statics";
import Utils from "../../../../../utils/utilities";
import L from "leaflet";
export class SearchPlugin {
    constructor() {
        this.compName = SEARCH_PLUGIN_TAG;
    }
    getControl() {
        return this.control;
    }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        if (!this.gisMap)
            return;
        Utils.doNothing(search);
        this.control = this.createPlugin(this.config.searchOptions);
        this.gisMap.addControl(this.control);
        this.fixCss();
    }
    //     componentDidUnload() {
    //         console.log(`componentDidUnload - ${this.compName}`);
    //         this.gisMap.removeControl(this.control);
    //     }
    createPlugin(options) {
        Utils.doNothing(options);
        const searchController = new L.Control.Search({
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
    fixCss() {
        // Fix css, remove 2 props
        const searchElements = document.getElementsByClassName("search-button");
        if (searchElements.length) {
            const elem = searchElements[0];
            elem.classList.add('leaflet-bar');
        }
    }
    static get is() { return "search-plugin"; }
    static get properties() { return { "config": { "type": "Any", "attr": "config" }, "control": { "state": true }, "getControl": { "method": true }, "gisMap": { "type": "Any", "attr": "gis-map" } }; }
    static get style() { return "/**style-placeholder:search-plugin:**/"; }
}
