import _ from "lodash";
import { FILE_TYPES, DEFAULT_OSM_TILE, MIN_ZOOM, MAX_ZOOM } from "./statics";
import { TileLayerDefinition, BaseMap, ShapeLayerContainer_Dev, ShapeLayerDefinition } from "../models";
import L from "leaflet";
import LayersFactory from "./LayersFactory";

export default class Utils {
    public static log_componentWillLoad(compName: string) {
        console.log(`componentWillLoad ${compName}`);
    }
    public static log_componentDidLoad(compName: string) {
        console.log(`componentDidLoad ${compName}`);
    }
    public static log_componentDidUnload(compName: string) {
        console.log(`componentDidUnload ${compName}`);
    }
    public static doNothing(imports: any) {
        !!imports
    }
    public static appendHtmlWithContext = function (elm: HTMLElement, dom: string, context: any) {
        elm.innerHTML = dom;
        const elements = elm.querySelectorAll("[attachEvent]");

        _.forEach(elements, (element: any) => {
            element.getAttribute("attachEvent").split(";").forEach(function (event: any) {
                const eventNameAndHandler = event.split(":");
                const eventName = eventNameAndHandler[0];
                const eventHandler = eventNameAndHandler[1];

                if (eventName && eventHandler) {
                    element.addEventListener(eventName, context[eventHandler].bind(context));
                }
            });
        });
    };
    public static stopDoubleClickOnPlugin(htmlElement: HTMLElement) {
        // Disable double-click
        htmlElement.addEventListener("dblclick", (eventData: any) => {
            eventData.stopPropagation();
        });
    }
    public static fitLayerControllerPosition(LayerControllerMode: string = ''): void {
        const layerControllerButton: any = document.querySelector('.custom-toolbar-button.layer-controller');
        const layerControllerPlugin: any = document.querySelector('.custom-layer-controller');
        if (!(layerControllerButton && layerControllerPlugin)) { return; }
        layerControllerPlugin.style.left = layerControllerButton.offsetLeft + 'px';
        // layerControllerPlugin.className = layerControllerPlugin.className+ ' ' + isShowLayerController;

        const customLayerController: any = document.querySelector('.custom-layer-controller');
        customLayerController.className = layerControllerPlugin.className + ' ' + LayerControllerMode;
        const styledLayerControllerElement: any = document.querySelector('.leaflet-control-layers-expanded');

        styledLayerControllerElement.parentNode.removeChild(styledLayerControllerElement);
        customLayerController.appendChild(styledLayerControllerElement);
        
        // Empty class list for this Form element
        // styledLayerControllerElement.firstElementChild.firstElementChild.classList = '';
    }
    static exportBlobFactory(
        fileType: FILE_TYPES, 
        selectedLeafletObjects: { [key: string]: L.Layer },
        mapState: any,
        callback: string): Blob {
            this.doNothing([fileType, selectedLeafletObjects, mapState, callback])
        // const relevantExportedLayers: L.Layer[] = Utils.getRelevantExportedLayers(selectedLeafletObjects, mapState, map);
        // const geoJsonList: L.GeoJSON[] = Utils.shapeListToGeoJson(relevantExportedLayers);

        // return Utils.getBlobByType(fileType, geoJsonList, callback);
        return null;
    }
    public static toggleCustomDropDownMenu(elm: HTMLElement) {
        const toogleState = elm.style.display;
        Utils.closeAllCustomDropDownMenus();
        elm.style.display = (toogleState === 'block') ? 'none' : 'block';
        if (elm.style.display === 'block') {
            document.querySelector('.custom-toolbar-button.layer-controller').classList.remove('clicked');
            document.querySelector('.custom-layer-controller').classList.remove('show');
        }
    }
    public static closeAllCustomDropDownMenus() {
        const allDropDownMenus = document.querySelectorAll('.menu');
        _.forEach(allDropDownMenus, (menu: HTMLElement) => {
            menu.style.display = 'none';
        });
    }
    public static setRadioButtonsByCheckedValue(customDropDownPluginEl: HTMLCustomDropDownPluginElement, groupName: string, checkedValue: any) {
        const groupItems: NodeListOf<Element> = customDropDownPluginEl.getControl().getContainer().querySelectorAll(`.menu li.menu-item.custom-group [name="${groupName}"]`);
        _.forEach(groupItems, (input: Element) => {
            // Unselect checked element
            if (input.getAttribute('checked')) {
                input.removeAttribute('checked');
            }
        });
        _.forEach(groupItems, (input: Element) => {
            // Selecet element
            if (input.getAttribute('value') === checkedValue) {
                input.setAttribute('checked', 'true');
            }
        });
    }
    static initStoreWithMapTiles(tilesLayerList: TileLayerDefinition[]): BaseMap {
        const baseMaps: BaseMap = {};
        if (tilesLayerList && tilesLayerList.length) {
            tilesLayerList.forEach((t: L.TileLayerOptions) => {
                // Add other layers
                const tileOptions: L.TileLayerOptions = { ...t, noWrap: true };
                // Create tile Layer from Uri
                baseMaps[t.name] = new L.TileLayer(t.tilesURI, tileOptions);
            });
        } else {
            const tileOptions: L.TileLayerOptions = { minZoom: MIN_ZOOM, maxZoom: MAX_ZOOM, attributionControl: false, noWrap: true };
            baseMaps[DEFAULT_OSM_TILE.name] = new L.TileLayer(DEFAULT_OSM_TILE.address, tileOptions);
        }
        return baseMaps;
    }
    static initiateLayers(shapeLayers: ShapeLayerDefinition[]) {
        // if (!_.get(store, 'state.shapeLayers.length')) { return; }

        // const shapeLayers: ShapeLayerDefinition[] = store.state.shapeLayers;
        const initialLayersTemp: ShapeLayerContainer_Dev[] = [];
        shapeLayers.forEach((item: ShapeLayerDefinition) => {
            const shapeLayerContainer: ShapeLayerContainer_Dev = LayersFactory.createHeatAndClusterLayer(item);
            // this.addingNewLayerToLayerController(shapeLayerContainer, LayerNames.INITIAL_LAYERS)
            initialLayersTemp.push(shapeLayerContainer);
        });
        return initialLayersTemp;
    }
}
