import { Component, Prop, State, Method } from "@stencil/core";
import * as styledLayerControl from 'leaflet.styledlayercontrol';
// import * as materialDesign from 'material-design-lite'
import { LAYER_MANAGER_PLUGIN_TAG, ImportFileFormats, FILE_TYPES } from "../../../../../utils/statics";
import Utils from "../../../../../utils/utilities";
import L from "leaflet";
import { LayerManagerConfig } from "../../../../../models/apiModels";
import _ from "lodash";


@Component({
    tag: 'layer-manager-plugin',
    styleUrls: [
        '../../../../../../node_modules/material-design-lite/dist/material.min.css',             // Need to import this from styledLayerControl.css
        '../../../../../../node_modules/leaflet.styledlayercontrol/css/MaterialIcons.css',  // Need to import this from styledLayerControl.css
        '../../../../../../node_modules/leaflet.styledlayercontrol/css/styledLayerControl.css',
        './layer-manager-plugin.scss',
    ]
})
export class layerManagerPlugin {
    compName: string = LAYER_MANAGER_PLUGIN_TAG;
    @Prop() config: LayerManagerConfig;
    @Prop() gisMap: L.Map;
    
    @State() htmlBtEl: HTMLElement;
    @State() control: L.Control;
    
    @Method()
    getControl(): L.Control {
        return this.control;
    }
    @Method()
    getHtmlBtEl(): HTMLElement {
        return this.htmlBtEl;
    }
    
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        if (!this.gisMap) return;

        Utils.doNothing([this.config, styledLayerControl, /* materialDesign */, this.onChangeImport]);
        
        this.control = this.createPlugin();
        this.gisMap.addControl(this.control);

        this.htmlBtEl = this.createToolbarButton("div", "layer-controller", "Layer Controller") as HTMLElement;
        this.htmlBtEl.addEventListener("click", () => {
            this.toggleClassNamefromElement(this.control.getContainer(), "show");
            this.toggleClassNamefromElement(this.htmlBtEl, "clicked");
        });

        // Stop double click on plugin
        _.forEach([this.htmlBtEl , this.control.getContainer()], (item: HTMLElement) => Utils.stopDoubleClickOnPlugin(item));

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
        this.gisMap.removeControl(this.control as L.Control);
    }

    private createToolbarButton(tagElement: string ,className: string,title?: string,innerHTML?: any) {
        const button = L.DomUtil.create(
            tagElement,
            `custom-toolbar-button ${className}`
        );

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
    private toggleClassNamefromElement(elm: HTMLElement, className: string) {
        const AddOrRemove =
            elm.className.indexOf(className) > -1 ? "remove" : "add";
        elm.classList[AddOrRemove](className);
    }
    private createPlugin(): L.Control {
        const layerControllerOptionsDev: any = {
            position: "topleft",
            collapsed: false,
            container_maxHeight: "500px",
            callbacks: {
                // onChangeCheckbox: (event: any, obj: any) => {
                    // if (obj.group.name !== LayerNames.DRAWABLE_LAYER) {
                    //     this.changeDisplayAfterOneOverlayChanged(obj.group.name, obj.name, event.target.checked);
                    // }
                // }
            }
        };

        var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmLayer = new L.TileLayer(osmUrl);
        const baseMaps: any[] = [
            {
                groupName: "Base Maps",
                layers: {'osm': osmLayer}
            }
        ];


        const featureGroup: L.FeatureGroup = new L.FeatureGroup();
        const marker1: L.Marker = new L.Marker(new L.LatLng(32, 35))
        const marker2: L.Marker = new L.Marker([30, 25])
        featureGroup.addLayer(marker1);
        featureGroup.addLayer(marker2);

        var roadsUrl = 'http://www.openptmap.org/tiles/{z}/{x}/{y}.png';
        var roadsLayer = new L.TileLayer(roadsUrl);
        const mix: any[] = [
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

        let styledLayerConroller: any = new L.Control.StyledLayerControl(
            baseMaps,
            mix,
            layerControllerOptionsDev
        );

        this.gisMap.addControl(styledLayerConroller);

        const control = L.Control.extend({
            options: {
                position: 'topleft'
            },

            onAdd: () => {
                const div: HTMLElement = L.DomUtil.create('div', 'custom-layer-controller');

                if (_.get(this, 'config.isImport')) {
                    const optionsListOpenningPosition: string = 'left';
                    const buttonId: string = `demo-menu-lower-${optionsListOpenningPosition}`;
                    const container: string = `
                        <div class="custom-layer-controller-header">
                        <h2 class="custom-layer-controller-header-title">
                            <span>Layers</span>
                            <button class="mdl-button mdl-js-button mdl-button--icon" id="${ buttonId}">
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

            onRemove: (map: any) => {
                styledLayerConroller.onRemove(map);
            },

            addBaseLayer: (layer: any, name: any, group: any) => {
                return styledLayerConroller.addBaseLayer(layer, name, group);
            },

            addOverlay: (layer: any, name: any, group: any, className?: string) => {
                return styledLayerConroller.addOverlay(layer, name, group, className);
            },
            deleteLayer: (layer: any) => {
                styledLayerConroller.deleteLayer(layer);
            },
            removeLayer: (layer: any) => {
                return styledLayerConroller.removeLayer(layer);
            },
            removeGroup: (group_Name: string, del: any) => {
                styledLayerConroller.removeGroup(group_Name, del);
            },
            removeAllGroups: (del: any) => {
                styledLayerConroller.removeAllGroups(del);
            },
            selectLayer: (layer: any) => {
                styledLayerConroller.selectLayer(layer);
            },
            unSelectLayer: (layer: any) => {
                styledLayerConroller.unSelectLayer(layer);
            },
            changeGroup: (group_Name: string, select: any) => {
                styledLayerConroller.changeGroup(group_Name, select);
            }
        });

        return new control();
    }

    onChangeImport(event: any) {
        const fileDescriptor: any = event.target.files[0];
        if (fileDescriptor) {
            this.importFileHandler(fileDescriptor);
        }
    }
    importFileHandler(fileDescriptor: any) {
        // const extension: string = this.getFileExtension(fileDescriptor.name) || '';
        const fileNames: FileNames = this.getFileNamesFromFileName(fileDescriptor.name);
        const reader = new FileReader();

        switch (fileNames.fileExtention) {
            case FILE_TYPES.kml: // kml
                reader.onload = this.onReadKml.bind(this, fileNames);
                reader.readAsText(fileDescriptor);
                break;
            case FILE_TYPES.csv: // csv
                reader.onload = this.onReadCsv.bind(this, fileNames);
                reader.readAsText(fileDescriptor);
                break;
            case FILE_TYPES.zip: // zip
                reader.onload = this.onReadShp.bind(this, fileNames);
                reader.readAsArrayBuffer(fileDescriptor);
                break;

            default:
                console.warn(`File type ${fileNames.fileExtention} not supported`);
                break;
        }
    };
    public getFileNamesFromFileName(fileNameWithExtension: string): FileNames {
        const dotIndex: number = fileNameWithExtension.lastIndexOf(".");
        const fileName: string = fileNameWithExtension.substr(0, dotIndex);
        let fileExtention: string = fileNameWithExtension.substr(dotIndex + 1);
        if (fileExtention) {
            fileExtention = fileExtention.toLowerCase();
        }
        const fileNameStructure: FileNames = { fileName, fileExtention };
        return fileNameStructure;
    }
    public onReadKml(fileNames: FileNames, onLoadEvent?: any): void {
        const content: string = onLoadEvent.target.result;
        if (!content) { throw 'Empty content'; }

        try {
            Utils.doNothing(fileNames);
        //     const kmlAsXml = new DOMParser().parseFromString(content);
        //     const geoJsonOfKml: L.GeoJSON = togeojson.kml(kmlAsXml);

        //     if (geoJsonOfKml && geoJsonOfKml.features) {
        //         const geoJsonList: L.GeoJSON[] = geoJsonOfKml.features;
        //         this.geoJsonToLeafletLayer(geoJsonList, fileNames);
        //     }
        } catch (ex) {
            console.error('Kml File failed to load: ', ex);
        }
    }
    public onReadCsv(fileNames: FileNames, onLoadEvent?: any): void {
        const content: string = onLoadEvent.target.result;
        if (!content) { throw 'Empty content'; }

        try {
            Utils.doNothing(fileNames);
            // csv2geojson.csv2geojson(content, this.csv2geojsonCB.bind(this, fileNames));
        } catch (ex) {
            console.error('Csv File failed to load: ', ex);
        }
    }

    public onReadShp(fileNames: FileNames, onLoadEvent: any): void {
        const buffer: ArrayBuffer = onLoadEvent.target.result;
        Utils.doNothing(buffer)
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
}

type FileNames = {
    fileName: string;
    fileExtention: string;
};