import '../../../../stencil.core';
import { ToolbarConfig, MouseCoordinateConfig } from '../../../../models';
import L from 'leaflet';
export declare class ToolBar {
    compName: string;
    gisMap: L.Map;
    config: ToolbarConfig;
    mouseCoordinateConfig: MouseCoordinateConfig;
    el: HTMLElement;
    element: L.Control;
    exportDropDownData: any[];
    settingsDropDownData: any[];
    constructor();
    componentWillLoad(): void;
    render(): JSX.Element;
    componentDidLoad(): void;
    private createElement();
    private addToolbarControl();
    private toolbarFeaturesDecision();
}
