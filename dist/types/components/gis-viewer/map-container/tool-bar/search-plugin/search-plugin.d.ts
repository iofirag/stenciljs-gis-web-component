import L from "leaflet";
import { SearchConfig } from "../../../../../models";
export declare class SearchPlugin {
    compName: string;
    config: SearchConfig;
    gisMap: L.Map;
    control: L.Control.Search;
    getControl(): L.Control;
    componentWillLoad(): void;
    componentDidLoad(): void;
    componentDidUnload(): void;
    private createPlugin(options);
    private fixCss();
}
