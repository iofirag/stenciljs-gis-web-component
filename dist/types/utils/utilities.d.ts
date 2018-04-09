import { FILE_TYPES } from "./statics";
import { TileLayerDefinition, BaseMap, ShapeLayerContainer_Dev, ShapeLayerDefinition } from "../models";
import L from "leaflet";
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
}
