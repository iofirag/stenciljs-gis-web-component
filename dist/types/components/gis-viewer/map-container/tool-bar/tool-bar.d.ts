import '../../../../stencil.core';
import { ToolbarConfig } from '../../../../models';
import L from 'leaflet';
export declare class ToolBar {
    compName: string;
    gisMap: L.Map;
    config: ToolbarConfig;
    el: HTMLElement;
    element: L.Control;
    exportDropDownData: any[];
    settingsDropDownData: any[];
    constructor();
    componentWillLoad(): void;
    render(): JSX.Element;
    componentDidLoad(): void;
    private createElement();
    private toolbarFeaturesDecision();
}
