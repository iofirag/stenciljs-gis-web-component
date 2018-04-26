import { CoordinateSystemType } from "../models";

// import { Coordinate } from "../models/apiModels";

// export const PLUGIN_NAMES = {
//     MAP_CONTAINER: 'map-container'
// };

export const ImportFileFormats: string = '.kml,.csv,.zip';

export const GIS_VIEWER_TAG: string    = 'gis-viewer';
export const MAP_CONTAINER_TAG: string = 'map-container';

export const TOOL_BAR_TAG: string = 'tool-bar';
export const DRAW_BAR_PLUGIN_TAG: string = 'draw-bar-plugin';
export const ZOOM_TO_EXTENT_PLUGIN_TAG: string = 'zoom-to-extent-plugin';
export const FULL_SCREEN_PLUGIN_TAG: string = 'full-screen-plugin';
export const MEASURE_PLUGIN_TAG: string = 'measure-plugin';
export const SEARCH_PLUGIN_TAG: string = 'search-plugin';
export const LAYER_MANAGER_PLUGIN_TAG: string = 'layer-manager-plugin'
export const DROP_DOWN_PLUGIN_TAG: string = 'drop-down-plugin';
export const CUSTOM_DROP_DOWN_PLUGIN_TAG: string = 'custom-drop-down-plugin';
export const CUSTOM_SETTINGS_TAG: string = 'custom-settings';
export const CUSTOM_EXPORT_TAG: string = 'custom-export';

export const MINI_MAP_PLUGIN_TAG: string         = 'mini-map-plugin';
export const SCALE_PLUGIN_TAG: string            = 'scale-plugin';
export const MOUSE_COORDINATE_PLUGIN_TAG: string = 'mouse-coordinate-plugin';

export const MAX_NORTH_EAST: L.LatLngLiteral = {
    lat: 85,
    lng: -180
};
export const MAX_SOUTH_WEST: L.LatLngLiteral = {
    lat: -85,
    lng: 180
};

export enum FILE_TYPES {
    kml = 'kml',
    csv = 'csv',
    zip = 'zip' // (shp file)
};
export const FILE_TYPES_ARRAY: FILE_TYPES[] = Object.values(FILE_TYPES) as FILE_TYPES[];

export const CoordinateType: { [key: string]: CoordinateSystemType } = {
    MGRS: 'utmref',
    UTM: 'utm',
    DECIMAL: 'gps',
};

export const LayersTypeLabel: { [key: string]: string } = {
    HEAT: 'heat',
    CLUSTER: 'cluster',
};

export const MIN_OPACITY: number = 0.1;

export const DEFAULT_OSM_TILE = {
    name: 'Online map',
    address: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
};

export const LayerNames: { [key: string]: string } = {
    BASE_MAPS: 'Base Maps',
    DRAWABLE_LAYER: 'Drawable Layer',
    INITIAL_LAYERS: 'Initial Layers',
    [FILE_TYPES.kml.toUpperCase() + '_Layers']: FILE_TYPES.kml.toUpperCase() + ' Layers',
    [FILE_TYPES.csv.toUpperCase() + '_Layers']: FILE_TYPES.csv.toUpperCase() + ' Layers',
    [FILE_TYPES.zip.toUpperCase() + '_Layers']: FILE_TYPES.zip.toUpperCase() + ' Layers',
};

export const MIN_ZOOM: number = 2;
export const MAX_ZOOM: number = 20;

export const BUBBLE_TYPE = {
    POPUP: 'Popup',
    TOOLTIP: 'Tooltip'
};
export const GENERATED_ID = {
    SHAPE_ID: 'shapeId',
    DRAW_LAYER_GROUP_ID: 'draw_layer_groupId',
    DEFAULT_GROUP: 'default_group'
};

export const ZOOM_TO_EXTEND_PADDING: L.PointExpression = [20, 20];