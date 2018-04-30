import { Component, Prop, State, Method } from "@stencil/core";
import * as styledLayerControl from 'leaflet.styledlayercontrol';
// import * as materialDesign from 'material-design-lite'
import { LAYER_MANAGER_PLUGIN_TAG, ImportFileFormats, FILE_TYPES, LayerNames, LayersTypeLabel } from "../../../../../utils/statics";
import Utils from "../../../../../utils/utilities";
import L from "leaflet";
import { LayerManagerConfig, ShapeLayerContainer_Dev, ClusterHeat, SelectionMode } from "../../../../../models";
import _ from "lodash";
import store from "../../../../store/store";
import { reaction } from "mobx";
import { FeatureGroup } from "leaflet";
// require('material-design-lite/material.min.js');


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
    @State() control: L.Control.StyledLayerControl;


    @Method()
    getControl(): L.Control {
        return this.control;
    }
    @Method()
    getHtmlBtEl(): HTMLElement {
        return this.htmlBtEl;
    }

    @Method()
    addingDrawableLayerToLayerController(drawableLayer: FeatureGroup) {
        store.mapLayers.drawableLayers.push(drawableLayer);
        this.control.addOverlay(drawableLayer, 'Shapes', { groupName: LayerNames.DRAWABLE_LAYER });
        // Turn on this layer
        this.control.selectLayer(drawableLayer);
    }


    constructor() {
        // reaction(
        //     () => store.mapLayers.baseMaps,
        //     baseLayer => {
        //         console.log(baseLayer)
        //     }
        // )
        reaction(
            () => store.state.mapConfig.mode,
            (mode: ClusterHeat) => {
                // Select or unselect layers regarding to map mode changes
                _.forEach(store.mapLayers.initialLayers, (shapeLayerContainer: ShapeLayerContainer_Dev) => {
                    let layerToSelect: any;
                    let layerToUnSelect: any;
                    switch (mode) {
                        case LayersTypeLabel.CLUSTER:
                            layerToSelect = shapeLayerContainer.leafletClusterLayer;
                            layerToUnSelect = shapeLayerContainer.leafletHeatLayer;
                            break;
                        case LayersTypeLabel.HEAT:
                            layerToSelect = shapeLayerContainer.leafletHeatLayer;
                            layerToUnSelect = shapeLayerContainer.leafletClusterLayer;
                            break;
                    }
                    if (shapeLayerContainer.isDisplay) {
                        if (layerToSelect) this.turnOnOffLayer('selectLayer', layerToSelect);
                        if (layerToUnSelect) this.turnOnOffLayer('unSelectLayer', layerToUnSelect);
                    }
                });
            }
        )
    }
    componentWillLoad() {
        this.control = this.createPlugin();
        if (this.config.enable) {
            this.htmlBtEl = this.createToolbarButton('div', 'layer-controller', 'Layer Controller') as HTMLElement;
            // Init click event on button element
            this.htmlBtEl.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                this.toggleClassNamefromElement(this.control.getContainer(), 'show');
                this.toggleClassNamefromElement(this.htmlBtEl, 'clicked');
                Utils.closeAllCustomDropDownMenus();
            });
        } else {
            let styleLayerControlEl: HTMLElement = this.gisMap.getContainer().querySelector('.leaflet-control-layers.leaflet-control-layers-expanded.leaflet-control')
            styleLayerControlEl.style.display = 'none';
        }

        // Create layers
        // this.initiateLayers();
    }

    render() {
      return (
        <div>
          {
            _.get(this, 'config.drawBarConfig.enable', false) ? (
              <draw-bar-plugin gisMap={this.gisMap} config={this.config.drawBarConfig} />
            ) : null
          }
        </div>
      )
    }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        _.noop([this.config, styledLayerControl, /* materialDesign */, this.onChangeImport]);

        this.gisMap.addControl(this.control);




        // Stop double click on plugin
        let elementList: HTMLElement[] = [];
        if (this.control) elementList.push(this.control.getContainer());
        if (this.htmlBtEl) elementList.push(this.htmlBtEl);
        _.forEach(elementList, (item: HTMLElement) => Utils.stopDoubleClickOnPlugin(item));



        // Set first base map as working tile, set min zoom, max zoom
        const tileName: string = Object.keys(store.mapLayers.baseMaps)[0];
        this.control.selectLayer(store.mapLayers.baseMaps[tileName]); // turn on layer
        // this.gisMap.setMinZoom(store.mapLayers.baseMaps[tileName].options.minZoom); // set min zoom
        // this.gisMap.setMaxZoom(store.mapLayers.baseMaps[tileName].options.maxZoom); // set MAX zoom

        // Init Layers
        _.forEach(store.mapLayers.initialLayers, (shapeLayerContainer: ShapeLayerContainer_Dev) => {
            this.addingNewLayerToLayerManager(shapeLayerContainer, LayerNames.INITIAL_LAYERS);
        })


        /* Add map events */
        // Base layers change event
        // tslint:disable-next-line:no-empty
        // this.gisMap.on("baselayerchange", () => { });

        // // Overlays change checkbox events
        // this.gisMap.on("overlayadd overlayremove", this.onOverlayChanged_updateSelections);

        // // Every layer add/remove
        // this.gisMap.on("layeradd", this.onLayerAdd);
        // this.gisMap.on("layerremove", this.onLayerRemove);
        this.fixCss();
    }
    componentDidUnload() {
        console.log(`componentDidUnload - ${this.compName}`);
        this.gisMap.removeControl(this.control);
    }

    // Add layer to layer manager
    // @Method()
    private addingNewLayerToLayerManager(shapeLayerContainer: ShapeLayerContainer_Dev, groupName?: string): void {
        // BASE_MAPS
        // INITIAL_LAYERS
        // store.mapLayers.initialLayers.push(shapeLayerContainer);
        const { isDisplay, leafletHeatLayer, layerDefinition, leafletClusterLayer } = shapeLayerContainer;
        const mode: ClusterHeat = store.state.mapConfig.mode;
        const showLayerStateHeat: SelectionMode = (isDisplay && mode === 'heat') ? 'selectLayer' : 'unSelectLayer';
        const showLayerStateCluster: SelectionMode = (isDisplay && mode === 'cluster') ? 'selectLayer' : 'unSelectLayer';
        this.addLayerToLayerController(showLayerStateHeat, leafletHeatLayer, layerDefinition, groupName, 'Heat');
        this.addLayerToLayerController(showLayerStateCluster, leafletClusterLayer, layerDefinition, groupName, 'Cluster')
    }
    private addLayerToLayerController(showLayerState: SelectionMode, layer: any, layerDefinition: any, groupName: string, mode: string) {

        if (!layer) { return; }
        // Add layer to layer manager
        this.control.addOverlay(layer, `${layerDefinition.layerName} (${mode})`, { groupName }, mode.toLowerCase());
        // select or unselect Layer
        this.control[showLayerState](layer);
    }
    private turnOnOffLayer(showLayerState: SelectionMode, layer: any) {
        // select or unselect Layer
        this.control[showLayerState](layer);
    }






    private fixCss() {
        // Fix css
        let formEl: HTMLElement = this.gisMap.getContainer().querySelector('.leaflet-control-layers-scrollbar');
        formEl ? formEl.classList.remove('leaflet-control-layers-scrollbar') : null
    }
    private createToolbarButton(tagElement: string, className: string, title?: string, innerHTML?: any) {
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
    private toggleClassNamefromElement(elm: HTMLElement, className: string) {
        const AddOrRemove = elm.className.indexOf(className) > -1 ? "remove" : "add";
        elm.classList[AddOrRemove](className);
    }
    private changeDisplayAfterOneOverlayChanged(layerGroupName: string, layerName: string, isChecked: boolean): void {
        // const { FILE_TYPES.kml.toUpperCase() + '_Layers', CSV_LAYERS, SHP_LAYERS } = LayerNames;
        const LayersTypes: string[] = []
        Object.values(FILE_TYPES).forEach((type: string) => {
            LayersTypes.push(type.toUpperCase() + ' Layers');
        });

        // Find layer in initial layers
        if (layerGroupName.includes(LayerNames.INITIAL_LAYERS)) {
            store.mapLayers.initialLayers.forEach((dataLayer: ShapeLayerContainer_Dev) => {
                if (layerName.includes(dataLayer.layerDefinition.layerName)) {
                    dataLayer.isDisplay = isChecked;
                }
            });
        } else if (LayersTypes.includes(layerGroupName)) {
            // Find layer in imported layers
            _.map(store.mapLayers.importedLayers, (fileTypeLayerList: ShapeLayerContainer_Dev[], key: string) => {
                _.map(fileTypeLayerList, (dataLayer: ShapeLayerContainer_Dev) => {
                    // Remove import indetifier key from name
                    const index: number = dataLayer.layerDefinition.layerName.toLowerCase().lastIndexOf(`(${key})`);
                    const layerNameWithoutExt: string = dataLayer.layerDefinition.layerName.substring(0, index);

                    if (layerName.includes(layerNameWithoutExt)) {
                        dataLayer.isDisplay = isChecked;
                    }
                });
            });
        }
    }
    private createPlugin(): L.Control.StyledLayerControl {
        const layerControllerOptionsDev: any = {
            position: "topleft",
            collapsed: false,
            container_maxHeight: "500px",
            callbacks: {
                onChangeCheckbox: (event: any, obj: any) => {
                    if (obj.group.name !== LayerNames.DRAWABLE_LAYER) {
                        this.changeDisplayAfterOneOverlayChanged(obj.group.name, obj.name, event.target.checked);
                    }
                }
            }
        };

        // const baseMaps: any[] = [
        //     {
        //         groupName: "Base Maps",
        //         layers: store.mapLayers.baseMaps
        //     }
        // ];


        // const featureGroup: L.FeatureGroup = new L.FeatureGroup();
        // const marker1: L.Marker = new L.Marker(new L.LatLng(32, 35))
        // const marker2: L.Marker = new L.Marker([30, 25])
        // featureGroup.addLayer(marker1);
        // featureGroup.addLayer(marker2);

        // var roadsUrl = 'http://www.openptmap.org/tiles/{z}/{x}/{y}.png';
        // var roadsLayer = new L.TileLayer(roadsUrl);
        const mix: any[] = [
            {
                groupName: "Maps",
                layers: store.mapLayers.baseMaps // this.context.mapState.baseMaps
            },
            // {
            //     groupName: "Rasterd Data",
            //     layers: { 'Roads': roadsLayer } // this.context.mapState.baseMaps
            // }
        ];

        let styledLayerConroller: any = new L.Control.StyledLayerControl(
            null, // baseMaps,
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

                    div.addEventListener('click', this.stopEventBubbling)
                }
                return div;
            },

            onRemove: (map: any) => {
                store.gisMap.getContainer().querySelector('.custom-layer-controller-header').removeEventListener('click', this.stopEventBubbling);
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

    stopEventBubbling(e: any) {
      e.stopPropagation();
      e.preventDefault();
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
            _.noop(fileNames);
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
            _.noop(fileNames);
            // csv2geojson.csv2geojson(content, this.csv2geojsonCB.bind(this, fileNames));
        } catch (ex) {
            console.error('Csv File failed to load: ', ex);
        }
    }

    public onReadShp(fileNames: FileNames, onLoadEvent: any): void {
        const buffer: ArrayBuffer = onLoadEvent.target.result;
        _.noop(buffer)
        _.noop(fileNames);
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
