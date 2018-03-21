import * as styledLayerControl from 'leaflet.styledlayercontrol';
// import * as materialDesign from 'material-design-lite'
import { LAYER_MANAGER_PLUGIN_TAG, ImportFileFormats, FILE_TYPES } from "../../../../../utils/statics";
import Utils from "../../../../../utils/utilities";
import L from "leaflet";
import _ from "lodash";
export class layerManagerPlugin {
    constructor() {
        this.compName = LAYER_MANAGER_PLUGIN_TAG;
    }
    getControl() {
        return this.control;
    }
    getHtmlBtEl() {
        return this.htmlBtEl;
    }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        if (!this.gisMap)
            return;
        Utils.doNothing([this.config, styledLayerControl, /* materialDesign */ , this.onChangeImport]);
        this.control = this.createPlugin();
        this.gisMap.addControl(this.control);
        this.htmlBtEl = this.createToolbarButton("div", "layer-controller", "Layer Controller");
        this.htmlBtEl.addEventListener("click", () => {
            this.toggleClassNamefromElement(this.control.getContainer(), "show");
            this.toggleClassNamefromElement(this.htmlBtEl, "clicked");
        });
        // Stop double click on plugin
        _.forEach([this.htmlBtEl, this.control.getContainer()], (item) => Utils.stopDoubleClickOnPlugin(item));
        /* Add map events */
        // Base layers change event
        // tslint:disable-next-line:no-empty
        // this.gisMap.on("baselayerchange", () => { });
        // // Overlays change checkbox events
        // this.gisMap.on("overlayadd overlayremove", this.onOverlayChanged_updateSelections);
        // // Every layer add/remove
        // this.gisMap.on("layeradd", this.onLayerAdd);
        // this.gisMap.on("layerremove", this.onLayerRemove);
    }
    componentDidUnload() {
        console.log(`componentDidUnload - ${this.compName}`);
        this.gisMap.removeControl(this.control);
    }
    createToolbarButton(tagElement, className, title, innerHTML) {
        const button = L.DomUtil.create(tagElement, `custom-toolbar-button ${className}`);
        if (title) {
            button.title = title;
        }
        if (innerHTML) {
            button.innerHTML = innerHTML;
        }
        if (tagElement.toLocaleLowerCase() === "a") {
            button.setAttribute("href", "#");
        }
        return button;
    }
    toggleClassNamefromElement(elm, className) {
        const AddOrRemove = elm.className.indexOf(className) > -1 ? "remove" : "add";
        elm.classList[AddOrRemove](className);
    }
    createPlugin() {
        const layerControllerOptionsDev = {
            position: "topleft",
            collapsed: false,
            container_maxHeight: "500px",
            callbacks: {}
        };
        var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmLayer = new L.TileLayer(osmUrl);
        const baseMaps = [
            {
                groupName: "Base Maps",
                layers: { 'osm': osmLayer }
            }
        ];
        const featureGroup = new L.FeatureGroup();
        const marker1 = new L.Marker(new L.LatLng(32, 35));
        const marker2 = new L.Marker([30, 25]);
        featureGroup.addLayer(marker1);
        featureGroup.addLayer(marker2);
        var roadsUrl = 'http://www.openptmap.org/tiles/{z}/{x}/{y}.png';
        var roadsLayer = new L.TileLayer(roadsUrl);
        const mix = [
            {
                groupName: "Rasterd Data",
                layers: { 'Roads': roadsLayer } // this.context.mapState.baseMaps
            },
            {
                groupName: "Initiate Layers",
                layers: {
                    'Results': featureGroup
                }
            },
        ];
        let styledLayerConroller = new L.Control.StyledLayerControl(baseMaps, mix, layerControllerOptionsDev);
        this.gisMap.addControl(styledLayerConroller);
        const control = L.Control.extend({
            options: {
                position: 'topleft'
            },
            onAdd: () => {
                const div = L.DomUtil.create('div', 'custom-layer-controller');
                if (_.get(this, 'config.isImport')) {
                    const optionsListOpenningPosition = 'left';
                    const buttonId = `demo-menu-lower-${optionsListOpenningPosition}`;
                    const container = `
                        <div class="custom-layer-controller-header">
                        <h2 class="custom-layer-controller-header-title">
                            <span>Layers</span>
                            <button class="mdl-button mdl-js-button mdl-button--icon" id="${buttonId}">
                            <i class='material-icons add-circle'>add_circle</i>
                            </button>
                        </h2>
                        <ul id="custom-layer-controller-add-layer-menu" class="mdl-menu mdl-menu--bottom-${optionsListOpenningPosition} mdl-js-menu mdl-js-ripple-effect" for="${buttonId}">
                            <li class="mdl-menu__item" for="import-layer">
                            <label class="drop-down-label">
                                Import
                                <input type="file" accept="${ImportFileFormats}" id="import-layer" class="hidden" attachEvent="change:onChangeImport"/>
                            </label>
                            </li>
                            <li class="mdl-menu__item" disabled>Load</li>
                        </ul>
                        </div>
                    `;
                    Utils.appendHtmlWithContext(div, container, this);
                }
                return div;
            },
            onRemove: (map) => {
                styledLayerConroller.onRemove(map);
            },
            addBaseLayer: (layer, name, group) => {
                return styledLayerConroller.addBaseLayer(layer, name, group);
            },
            addOverlay: (layer, name, group, className) => {
                return styledLayerConroller.addOverlay(layer, name, group, className);
            },
            deleteLayer: (layer) => {
                styledLayerConroller.deleteLayer(layer);
            },
            removeLayer: (layer) => {
                return styledLayerConroller.removeLayer(layer);
            },
            removeGroup: (group_Name, del) => {
                styledLayerConroller.removeGroup(group_Name, del);
            },
            removeAllGroups: (del) => {
                styledLayerConroller.removeAllGroups(del);
            },
            selectLayer: (layer) => {
                styledLayerConroller.selectLayer(layer);
            },
            unSelectLayer: (layer) => {
                styledLayerConroller.unSelectLayer(layer);
            },
            changeGroup: (group_Name, select) => {
                styledLayerConroller.changeGroup(group_Name, select);
            }
        });
        return new control();
    }
    onChangeImport(event) {
        const fileDescriptor = event.target.files[0];
        if (fileDescriptor) {
            this.importFileHandler(fileDescriptor);
        }
    }
    importFileHandler(fileDescriptor) {
        // const extension: string = this.getFileExtension(fileDescriptor.name) || '';
        const fileNames = this.getFileNamesFromFileName(fileDescriptor.name);
        const reader = new FileReader();
        switch (fileNames.fileExtention) {
            case FILE_TYPES.kml:// kml
                reader.onload = this.onReadKml.bind(this, fileNames);
                reader.readAsText(fileDescriptor);
                break;
            case FILE_TYPES.csv:// csv
                reader.onload = this.onReadCsv.bind(this, fileNames);
                reader.readAsText(fileDescriptor);
                break;
            case FILE_TYPES.zip:// zip
                reader.onload = this.onReadShp.bind(this, fileNames);
                reader.readAsArrayBuffer(fileDescriptor);
                break;
            default:
                console.warn(`File type ${fileNames.fileExtention} not supported`);
                break;
        }
    }
    ;
    getFileNamesFromFileName(fileNameWithExtension) {
        const dotIndex = fileNameWithExtension.lastIndexOf(".");
        const fileName = fileNameWithExtension.substr(0, dotIndex);
        let fileExtention = fileNameWithExtension.substr(dotIndex + 1);
        if (fileExtention) {
            fileExtention = fileExtention.toLowerCase();
        }
        const fileNameStructure = { fileName, fileExtention };
        return fileNameStructure;
    }
    onReadKml(fileNames, onLoadEvent) {
        const content = onLoadEvent.target.result;
        if (!content) {
            throw 'Empty content';
        }
        try {
            Utils.doNothing(fileNames);
            //     const kmlAsXml = new DOMParser().parseFromString(content);
            //     const geoJsonOfKml: L.GeoJSON = togeojson.kml(kmlAsXml);
            //     if (geoJsonOfKml && geoJsonOfKml.features) {
            //         const geoJsonList: L.GeoJSON[] = geoJsonOfKml.features;
            //         this.geoJsonToLeafletLayer(geoJsonList, fileNames);
            //     }
        }
        catch (ex) {
            console.error('Kml File failed to load: ', ex);
        }
    }
    onReadCsv(fileNames, onLoadEvent) {
        const content = onLoadEvent.target.result;
        if (!content) {
            throw 'Empty content';
        }
        try {
            Utils.doNothing(fileNames);
            // csv2geojson.csv2geojson(content, this.csv2geojsonCB.bind(this, fileNames));
        }
        catch (ex) {
            console.error('Csv File failed to load: ', ex);
        }
    }
    onReadShp(fileNames, onLoadEvent) {
        const buffer = onLoadEvent.target.result;
        Utils.doNothing(buffer);
        Utils.doNothing(fileNames);
        // shp(buffer).then((geojsons: any) => {
        //     let geoJsonList: any[];
        //     if (Array.isArray(geojsons)) {
        //         geoJsonList = _.reduce(geojsons, (acc: any[], geoJson: any) => {
        //             acc.push(...geoJson.features);
        //             return acc;
        //         }, []);
        //     } else {
        //         geoJsonList = geojsons.features;
        //     }
        //     this.geoJsonToLeafletLayer(geoJsonList, fileNames);
        // }).catch((e: any) => {
        //     console.error('Error in Shapefile: ', e.message);
        // });
    }
    static get is() { return "layer-manager-plugin"; }
    static get properties() { return { "config": { "type": "Any", "attr": "config" }, "control": { "state": true }, "getControl": { "method": true }, "getHtmlBtEl": { "method": true }, "gisMap": { "type": "Any", "attr": "gis-map" }, "htmlBtEl": { "state": true } }; }
    static get style() { return "/**style-placeholder:layer-manager-plugin:**/"; }
}
