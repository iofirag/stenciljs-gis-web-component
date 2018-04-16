// import { Coordinate } from "../models/apiModels";
// export const PLUGIN_NAMES = {
//     MAP_CONTAINER: 'map-container'
// };
export const ImportFileFormats = '.kml,.csv,.zip';
export const GIS_VIEWER_TAG = 'gis-viewer';
export const MAP_CONTAINER_TAG = 'map-container';
export const TOOL_BAR_TAG = 'tool-bar';
export const DRAW_BAR_PLUGIN_TAG = 'draw-bar-plugin';
export const ZOOM_TO_EXTENT_PLUGIN_TAG = 'zoom-to-extent-plugin';
export const FULL_SCREEN_PLUGIN_TAG = 'full-screen-plugin';
export const MEASURE_PLUGIN_TAG = 'measure-plugin';
export const SEARCH_PLUGIN_TAG = 'search-plugin';
export const LAYER_MANAGER_PLUGIN_TAG = 'layer-manager-plugin';
export const DROP_DOWN_PLUGIN_TAG = 'drop-down-plugin';
export const CUSTOM_DROP_DOWN_PLUGIN_TAG = 'custom-drop-down-plugin';
export const CUSTOM_SETTINGS_TAG = 'custom-settings';
export const CUSTOM_EXPORT_TAG = 'custom-export';
export const MINI_MAP_PLUGIN_TAG = 'mini-map-plugin';
export const SCALE_PLUGIN_TAG = 'scale-plugin';
export const MOUSE_COORDINATE_PLUGIN_TAG = 'mouse-coordinate-plugin';
export const MAX_NORTH_EAST = {
    lat: 85,
    lng: -180
};
export const MAX_SOUTH_WEST = {
    lat: -85,
    lng: 180
};
export var FILE_TYPES;
(function (FILE_TYPES) {
    FILE_TYPES["kml"] = "kml";
    FILE_TYPES["csv"] = "csv";
    FILE_TYPES["zip"] = "zip"; // (shp file)
})(FILE_TYPES || (FILE_TYPES = {}));
;
export const FILE_TYPES_ARRAY = Object.values(FILE_TYPES);
export const CoordinateType = {
    MGRS: 'utmref',
    UTM: 'utm',
    DECIMAL: 'gps',
};
export const LayersTypeLabel = {
    HEAT: 'heat',
    CLUSTER: 'cluster',
};
export const MIN_OPACITY = 0.1;
export const DEFAULT_OSM_TILE = {
    name: 'Online map',
    address: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
};
export const LayerNames = {
    BASE_MAPS: 'Base Maps',
    DRAWABLE_LAYER: 'Drawable Layer',
    INITIAL_LAYERS: 'Initial Layers',
    [FILE_TYPES.kml.toUpperCase() + '_Layers']: FILE_TYPES.kml.toUpperCase() + ' Layers',
    [FILE_TYPES.csv.toUpperCase() + '_Layers']: FILE_TYPES.csv.toUpperCase() + ' Layers',
    [FILE_TYPES.zip.toUpperCase() + '_Layers']: FILE_TYPES.zip.toUpperCase() + ' Layers',
};
export const MIN_ZOOM = 2;
export const MAX_ZOOM = 20;
export const BUBBLE_TYPE = {
    POPUP: 'Popup',
    TOOLTIP: 'Tooltip'
};
export const GENERATED_ID = {
    SHAPE_ID: 'shapeId',
    DRAW_LAYER_GROUP_ID: 'draw_layer_groupId',
    DEFAULT_GROUP: 'default_group'
};
