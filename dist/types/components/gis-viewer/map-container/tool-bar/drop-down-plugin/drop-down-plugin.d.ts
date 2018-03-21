import L from 'leaflet';
export declare class DropDownPlugin {
    compName: string;
    gisMap: L.Map;
    dropDownData: any[];
    dropDownTitle: string;
    control: L.Control;
    getControl(): L.Control;
    componentWillLoad(): void;
    componentDidLoad(): void;
    private createCustomControl(dropDownData, dropDownTitle);
    componentDidUnload(): void;
}
