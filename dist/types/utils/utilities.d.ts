import { FILE_TYPES } from "./statics";
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
}
