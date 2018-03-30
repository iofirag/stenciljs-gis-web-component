import { SearchConfig } from "../../../../../models";
import L from "leaflet";
export declare class SearchPlugin {
    compName: string;
    config: SearchConfig;
    gisMap: L.Map;
    control: L.Control.Search;
    getControl(): L.Control.Search;
    componentDidLoad(): void;
    private createPlugin(options);
    private fixCss();
}
