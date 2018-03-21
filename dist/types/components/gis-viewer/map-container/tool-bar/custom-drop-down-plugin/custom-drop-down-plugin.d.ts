import L from 'leaflet';
export declare class CustomDropDownPlugin {
    compName: string;
    gisMap: L.Map;
    dropDownData: any[];
    customControlName: string;
    dropDownTitle?: string;
    control: L.Control;
    getControl(): L.Control;
    componentWillLoad(): void;
    componentDidLoad(): void;
    componentDidUnload(): void;
    private createCustomControl(dropDownData, customControlName, dropDownTitle);
    private createDropDownItem(dropDownDataItem);
}
