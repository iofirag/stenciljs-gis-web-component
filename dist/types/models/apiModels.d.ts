import { ControlPosition } from "leaflet";
import { Layer } from "leaflet";
import { FeatureGroup } from "leaflet";
import { TileLayer } from "leaflet";
export declare type GisViewerProps = {
    tileLayers?: TileLayerDefinition[];
    mapConfig?: MapConfig;
    defaultMarkerIcon?: DefaultMarkerIcon;
    shapeLayers?: ShapeLayerDefinition[];
    toolbarConfig?: ToolbarConfig;
    mapPluginsConfig?: MapPluginsConfig;
    shapeForPopup?: any;
};
export declare type MapConfig = {
    mode?: ClusterHeat;
    clusterOptions?: ClusterOptions;
    coordinateSystemType?: CoordinateSystemType;
    distanceUnitType?: DistanceUnitType;
    isZoomToExtentOnNewData?: boolean;
    isWheelZoomOnlyAfterClick?: boolean;
    isFlyToBounds?: boolean;
    isZoomControl?: boolean;
    isSelectionDisable?: boolean;
    initBounds?: MapBounds;
};
export declare type DistanceUnitType = 'km' | 'mile' | 'nauticalmiles';
export declare type CoordinateSystemType = 'utm' | 'utmref' | 'gps';
export declare type ClusterHeat = 'cluster' | 'heat';
export declare type ClusterOptions = {
    singleMarkerMode?: boolean;
    disableClusteringAtZoom?: number;
    chunkedLoading?: boolean;
    chunkProgress?: boolean;
};
export declare type MapOptions = {
    center: Coordinate;
    zoomControl?: boolean;
    dragging?: boolean;
};
export declare type TileLayerDefinition = {
    name: string;
    tilesURI: string;
    maxZoom?: number;
    minZoom?: number;
    attributionControl?: boolean;
};
export declare type DefaultMarkerIcon = {
    iconRetinaUrl?: string;
    iconUrl: string;
    shadowUrl?: string;
};
export declare type WktShape = {
    wkt: string;
    areaSize?: number;
    id?: number;
};
export declare type Coordinate = {
    lat: number;
    lng: number;
};
export declare type IconOptions = {
    iconUrl: string;
    iconWidth: number;
    iconHeight: number;
};
export declare type MapBounds = {
    precision: number;
    bounds: Bounds;
};
export declare type Bounds = {
    topLeft: Coordinate;
    bottomRight: Coordinate;
};
export declare type ShapeLayerDefinition = {
    layerName: string;
    shapes: ShapeDefinition[];
    isDisplay?: boolean;
};
export declare type ToolbarConfig = {
    isExport?: boolean;
    isSettings?: boolean;
    toolbarPluginsConfig?: ToolbarPluginsConfig;
};
export declare type ToolbarPluginsConfig = {
    layerManagerConfig?: LayerManagerConfig;
    fullScreenConfig?: FullScreenConfig;
    zoomToExtentConfig?: ZoomToExtentConfig;
    searchConfig?: SearchConfig;
    measureConfig?: MeasureConfig;
    unitsChangerConfig?: UnitsChangerConfig;
    drawBarConfig?: DrawBarConfig;
};
export declare type MapPluginsConfig = {
    miniMapConfig?: MiniMapConfig;
    mouseCoordinateConfig?: MouseCoordinateConfig;
    scaleConfig?: ScaleConfig;
};
export declare type LayerManagerConfig = BasePluginConfig & {
    layersControllerOptions?: LayerManagerOptions;
    isImport?: boolean;
};
export declare type LayerManagerOptions = BaseControlOptions & {};
export declare type FullScreenConfig = BasePluginConfig & {
    fullScreenOptions?: FullScreenOptions;
};
export declare type FullScreenOptions = BaseControlOptions & {};
export declare type ZoomToExtentConfig = BasePluginConfig & {
    zoomToExtentOptions?: ZoomToExtentOptions;
};
export declare type ZoomToExtentOptions = BaseControlOptions & {};
export declare type ZoomConfig = BasePluginConfig & {};
export declare type SearchConfig = BasePluginConfig & {
    searchOptions?: SearchOptions;
};
export declare type SearchOptions = BaseControlOptions & {
    searchOnLayer?: boolean;
    queryServerUrl?: string;
};
export declare type MeasureConfig = BasePluginConfig & {
    measureOptions?: MeasureOptions;
};
export declare type MeasureOptions = BaseControlOptions & {
    showMeasurementsClearControl?: boolean;
    clearMeasurementsOnStop?: boolean;
};
export declare type UnitsChangerConfig = BasePluginConfig & {
    unitsChangerOptions?: UnitsChangerOptions;
};
export declare type UnitsChangerOptions = BaseControlOptions & {};
export declare type DrawBarConfig = BasePluginConfig & {
    drawBarOptions?: DrawBarOptions;
};
export declare type DrawBarOptions = BaseControlOptions & {
    draw?: DrawBarOptionsDraw;
    edit?: DrawBarOptionsEdit;
};
export declare type DrawBarOptionsDraw = boolean | {
    polyline?: boolean;
    polygon?: boolean;
    circle?: boolean;
    rectangle?: boolean;
    marker?: boolean;
    circlemarker?: boolean;
    textualMarker?: boolean;
};
export declare type DrawBarOptionsEdit = {
    remove?: boolean;
};
export declare type MiniMapConfig = BasePluginConfig & {
    miniMapOptions?: MiniMapOptions;
};
export declare type MiniMapOptions = BaseControlOptions & {
    toggleDisplay?: boolean;
};
export declare type MouseCoordinateConfig = BasePluginConfig & {};
export declare type MouseCoordinateOptions = BaseControlOptions & {
    gps?: boolean;
    gpsLong?: boolean;
    utm?: boolean;
    utmref?: boolean;
};
export declare type ScaleConfig = BasePluginConfig & {
    scaleOptions?: ScaleOptions;
};
export declare type ScaleOptions = BaseControlOptions & {
    maxWidth?: number;
};
export declare enum ShapeType {
    CIRCLE = 0,
    POLYGON = 1,
    MARKER = 2,
    POLYLINE = 3,
    LABEL = 4,
    MULTIPOLYGON = 5,
}
export declare enum DropDownItemType {
    REGULAR = 0,
    RADIO_BUTTON = 1,
    CHECK_BOX = 2,
}
export declare type ShapeDefinition = {
    data?: ShapeData;
    shapeWkt?: string;
    shapeObject?: ShapeObject;
    options?: ShapeObjectOptions;
};
export declare type ShapeData = {
    id?: string;
    groupId?: string;
    type?: string;
    name?: string;
    description?: string;
    count?: number;
    dateTime?: number;
    tag?: any;
    isSelected?: boolean;
    isSelectedFade?: boolean;
};
export declare type ShapeEntities = CircleShape | PolygonShape | MarkerShape | PolylineShape | LabelShape | MultiPolygonShape;
export declare type ShapeObject = {
    type: ShapeType;
    shape: ShapeEntities;
};
export declare type ShapeObjectOptions = CircleShapeOptions | PolygonShapeOptions | MarkerShapeOptions | PolylineShapeOptions | LabelShapeOptions | MultiPolygonShapeOptions;
export declare type CircleShape = {
    coordinate: Coordinate;
    radius: number;
};
export declare type CircleShapeOptions = {
    color?: string;
    fillColor?: string;
    fillOpacity?: number;
};
export declare type PolygonShape = {
    coordinates: Coordinate[];
};
export declare type PolygonShapeOptions = {
    color?: string;
    fillColor?: string;
    fillOpacity?: number;
};
export declare type MultiPolygonShape = {
    polygons: PolygonShape[];
};
export declare type MultiPolygonShapeOptions = {
    color?: string;
    fillColor?: string;
    fillOpacity?: number;
};
export declare type MarkerShape = {
    coordinate: Coordinate;
};
export declare type MarkerShapeOptions = {
    customIcon?: IconOptions;
    icon?: any;
    draggable?: boolean;
};
export declare type PolylineShape = {
    coordinates: Coordinate[];
};
export declare type PolylineShapeOptions = {
    color?: string;
};
export declare type LabelShape = {
    coordinate: Coordinate;
    text: string;
};
export declare type LabelShapeOptions = {
    icon?: any;
};
export declare type BasePluginConfig = {
    enable?: boolean;
};
export declare type BaseControlOptions = {
    position?: ControlPosition;
};
export declare type ShapeLayerContainer_Dev = {
    layerDefinition: ShapeLayerDefinition;
    leafletHeatLayer: any;
    leafletClusterLayer: any;
    isDisplay: boolean;
};
export declare type MapLayers = {
    baseMaps: BaseMap;
    initialLayers: ShapeLayerContainer_Dev[];
    importedLayers: {
        [key: string]: ShapeLayerContainer_Dev[];
    };
    drawableLayers: FeatureGroup[];
};
export declare type BaseMap = {
    [key: string]: TileLayer;
};
export declare type SelectionMode = 'selectLayer' | 'unSelectLayer';
export declare type GroupIdToShapeStoreMap = {
    [groupId: string]: GroupData;
};
export declare type GroupData = {
    [id: string]: ShapeStore;
};
export declare type ShapeStore = {
    leafletRef: Layer | FeatureGroup;
    shapeDef: ShapeDefinition;
};
export declare type SelectedObjects = {
    [id: string]: SelectedObjectsValue;
};
export declare type SelectedObjectsValue = {
    selectionType: SelectionType;
    groupId: string;
};
export declare type SelectionType = 'group' | 'single';
export declare type ShapeIds = {
    groupId: string;
    shapeId: string;
};
