import { MiniMapConfig } from '../../../../models';
import L from 'leaflet';
export declare class MiniMapPlugin {
    compName: string;
    config: MiniMapConfig;
    gisMap: L.Map;
    minimapControl: any;
    componentWillLoad(): void;
    componentDidLoad(): void;
    componentDidUnload(): void;
}
