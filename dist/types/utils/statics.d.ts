import { CoordinateSystemType } from "../models";
export declare const ImportFileFormats: string;
export declare const GIS_VIEWER_TAG: string;
export declare const MAP_CONTAINER_TAG: string;
export declare const TOOL_BAR_TAG: string;
export declare const DRAW_BAR_PLUGIN_TAG: string;
export declare const ZOOM_TO_EXTENT_PLUGIN_TAG: string;
export declare const FULL_SCREEN_PLUGIN_TAG: string;
export declare const MEASURE_PLUGIN_TAG: string;
export declare const SEARCH_PLUGIN_TAG: string;
export declare const LAYER_MANAGER_PLUGIN_TAG: string;
export declare const DROP_DOWN_PLUGIN_TAG: string;
export declare const CUSTOM_DROP_DOWN_PLUGIN_TAG: string;
export declare const CUSTOM_SETTINGS_TAG: string;
export declare const CUSTOM_EXPORT_TAG: string;
export declare const MINI_MAP_PLUGIN_TAG: string;
export declare const SCALE_PLUGIN_TAG: string;
export declare const MOUSE_COORDINATE_PLUGIN_TAG: string;
export declare const MAX_NORTH_EAST: L.LatLngLiteral;
export declare const MAX_SOUTH_WEST: L.LatLngLiteral;
export declare enum FILE_TYPES {
    kml = "kml",
    csv = "csv",
    zip = "zip",
}
export declare const FILE_TYPES_ARRAY: FILE_TYPES[];
export declare const CoordinateType: {
    [key: string]: CoordinateSystemType;
};
export declare const LayersTypeLabel: {
    [key: string]: string;
};
export declare const MIN_OPACITY: number;
export declare const DEFAULT_OSM_TILE: {
    name: string;
    address: string;
};
export declare const LayerNames: {
    [key: string]: string;
};
export declare const MIN_ZOOM: number;
export declare const MAX_ZOOM: number;
export declare const BUBBLE_TYPE: {
    POPUP: string;
    TOOLTIP: string;
};
export declare const GENERATED_ID: {
    SHAPE_ID: string;
    DRAW_LAYER_GROUP_ID: string;
    DEFAULT_GROUP: string;
};
