import { Component, Prop, Element, Method } from "@stencil/core";
import Utils from "../../../../../utils/utilities";
import { FILE_TYPES, CUSTOM_EXPORT_TAG, DROP_DOWN_PLUGIN_TAG } from "../../../../../utils/statics";
import store from "../../../../store/store";
// import _ from "lodash";
// import store from "../../../../store/store";

@Component({
    tag: 'custom-export',
    styleUrls: [
        `./custom-export.scss`
    ]
})
export class CustomExport {
    compName: string = CUSTOM_EXPORT_TAG;
    @Prop() gisMap: L.Map
    @Element() el: HTMLElement;

    dropDownPluginEl: HTMLDropDownPluginElement;

    @Method()
    getElement(): HTMLElement {
        return this.el;
    }

    componentWillLoad() {
    }


    render() {

        const exportDropDownData: any[] = [{
            label: 'Export KML',
            onClick: Utils.exportBlobFactory.bind(this, FILE_TYPES.kml, store.mapLayers, store.gisMap, 'onSaveKmlBlob'),
            className: 'icon-kml'
        }, {
            label: 'Export CSV',
            onClick: Utils.exportBlobFactory.bind(this, FILE_TYPES.csv, store.mapLayers, store.gisMap, 'onSaveCsvBlob'),
            className: 'icon-csv'
        }, {
            label: 'Export SHP',
            onClick: Utils.exportBlobFactory.bind(this, FILE_TYPES.zip, store.mapLayers, store.gisMap, 'onSaveShpBlob'),
            className: 'icon-shp'
        }];

        return (
            <drop-down-plugin gisMap={this.gisMap} dropDownData={exportDropDownData} dropDownTitle={'Export Map'} />
        )
    }

    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        this.dropDownPluginEl = this.el.querySelector(`${DROP_DOWN_PLUGIN_TAG}`);
        Utils.fitLayerControllerPosition();
    }

    componentDidUnload() {
        console.log(`componentDidUnload - ${this.compName}`);
        // this.gisMap.removeControl(this.control);
    }
}
