import { Component, Prop, Element, Method, Event, EventEmitter } from "@stencil/core";
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
    @Event() saveKmlFormatCB: EventEmitter<Blob>;
    @Event() saveCsvFormatCB: EventEmitter<Blob>;
    @Event() saveShpFormatCB: EventEmitter<Blob>;

    dropDownPluginEl: HTMLDropDownPluginElement;

    @Method()
    getElement(): HTMLElement {
        return this.el;
    }

    saveKmlFormatCBHandler(kml: Blob): void {
      this.saveKmlFormatCB.emit(kml);
    }

    saveCsvFormatCBHandler(csv: Blob): void {
      this.saveCsvFormatCB.emit(csv);
    }

    saveShpFormatCBHandler(zip: Blob): void {
      this.saveShpFormatCB.emit(zip);
    }

    render() {

        const exportDropDownData: any[] = [{
            label: 'Export KML',
            onClick: Utils.exportBlobFactory.bind(this, FILE_TYPES.kml, store.mapLayers, store.gisMap, this.saveKmlFormatCBHandler.bind(this)),
            className: 'icon-kml'
        }, {
            label: 'Export CSV',
            onClick: Utils.exportBlobFactory.bind(this, FILE_TYPES.csv, store.mapLayers, store.gisMap, this.saveCsvFormatCBHandler.bind(this)),
            className: 'icon-csv'
        }, {
            label: 'Export SHP',
            onClick: Utils.exportBlobFactory.bind(this, FILE_TYPES.zip, store.mapLayers, store.gisMap, this.saveShpFormatCBHandler.bind(this)),
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
