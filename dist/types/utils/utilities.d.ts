import { FILE_TYPES } from "./statics";
import { TileLayerDefinition, BaseMap, ShapeLayerContainer_Dev, ShapeLayerDefinition, MapLayers, ShapeStore, SelectedObjects, ShapeData } from "../models";
import L from "leaflet";
import { ShapeEventHandlers, ShapeManagerInterface } from "./shapes/ShapeManager";
export default class Utils {
    static log_componentWillLoad(compName: string): void;
    static log_componentDidLoad(compName: string): void;
    static log_componentDidUnload(compName: string): void;
    static doNothing(imports: any): void;
    static appendHtmlWithContext: (elm: HTMLElement, dom: string, context: any) => void;
    static stopDoubleClickOnPlugin(htmlElement: HTMLElement): void;
    static fitLayerControllerPosition(LayerControllerMode?: string): void;
    static exportBlobFactory(fileType: FILE_TYPES, selectedLeafletObjects: {
        [key: string]: L.Layer;
    }, mapState: any, callback: string): Blob;
    static toggleCustomDropDownMenu(elm: HTMLElement): void;
    static closeAllCustomDropDownMenus(): void;
    static setRadioButtonsByCheckedValue(customDropDownPluginEl: HTMLCustomDropDownPluginElement, groupName: string, checkedValue: any): void;
    static initStoreWithMapTiles(tilesLayerList: TileLayerDefinition[]): BaseMap;
    static initiateLayers(shapeLayers: ShapeLayerDefinition[]): ShapeLayerContainer_Dev[];
    static setEventsOnLeafletLayer(leafletObject: L.Layer, eventHandlers: ShapeEventHandlers): void;
    static shapeOnClickHandler(manager: ShapeManagerInterface | null, clickEvent: any): void;
    static updateBubble(leafletObject: L.Layer): void;
    static removeHighlightPOIs(): void;
    static highlightPOIsByGroupId(groupId: string): void;
    static getVisibleLayers(mapLayers: MapLayers, map: L.Map): L.Layer[];
    static getSelectedObjects(): ShapeStore[];
    static getShapeStoreByShapeId(shapeId: string, groupId?: string): ShapeStore;
    static clustersReselection(): void;
    static updateViewForSelectedObjects(): void;
    static selectClustersBySelectedLeafletObjects(selectedLeafletObjects: SelectedObjects): void;
    static createBubble(leafletObject: L.Layer, shapeData: ShapeData, type: string): void;
    static generatePopupMarkupFromData(shapeData: ShapeData): string;
}
