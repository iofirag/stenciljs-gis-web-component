import L from 'leaflet';
import { ScaleConfig } from '../../../../models';
import { Control } from 'leaflet';
export declare class ScalePlugin {
    compName: string;
    pluginSupportedUnits: string[];
    gisMap: L.Map;
    config: ScaleConfig;
    control: L.Control.Scale;
    getControl(): Control;
    constructor();
    private showScaleUnitsElementByType(globalDistanceUnitType);
    private setScaleUnitsElementVisibility(unit, globalDistanceUnitType);
    private fromGlobalUnitToElementUnit(globalUnit);
    componentWillLoad(): void;
    componentWillUpdate(): void;
    componentDidLoad(): void;
    private initUnitElementsWithClasses();
    componentDidUnload(): void;
}
