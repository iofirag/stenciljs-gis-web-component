import { ControlPosition } from "leaflet";

/* GisViewerProps and it children goes here */

export interface GisViewerProps {
    tileLayers?: TileLayerDefinition[]
    mapSettings?: MapSettings
    defaultMarkerIcon?: DefaultMarkerIcon
    shapeLayers?: ShapeLayerDefinition[]

    toolbarConfig?: ToolbarConfig       // Toolbar Plugins
    mapPluginsConfig?: MapPluginsConfig // Map Plugins
    configFlags?: ConfigFlags           // Config Flags

    shapeForPopup?: any
    gisSetState?: Function
    // Callbacks
    // onEndImportDraw?: (allImportedLayers: WktShape[]) => void
    // onDrawCreated?: (shapeWkt: WktShape) => void
    // onDrawEdited?: (shapeWktList: WktShape[]) => void
    // onDrawDeleted?: (shapeWktList: WktShape[]) => void
    onBoundsChanged?: (mapBounds: MapBounds, programmatic: boolean) => void
    // onSelectionDone?: (shapeDefList: ShapeDefinition[]) => void
    onMapReady?: () => void
    onSaveKmlBlob?: (kml: Blob) => void
    onSaveCsvBlob?: (csv: Blob) => void
    onSaveShpBlob?: (shp: Blob) => void
}

export type MapSettings = {
    metric?: boolean
    mode?: ClusterHeat
    clusterOptions?: ClusterOptions
    wheelZoomOnlyAfterClick?: boolean
}
export type ClusterHeat = 'cluster' | 'heat'
export type ClusterOptions = {
    singleMarkerMode?: boolean
    disableClusteringAtZoom?: number
    chunkedLoading?: boolean
    chunkProgress?: boolean
}

export type MapOptions = {
    center: Coordinate,
    // enable?: boolean
    zoomControl?: boolean,
    dragging?: boolean,
}

export type TileLayerDefinition = {
    name: string,
    tilesURI: string, // 'http://10.164.39.38/pandonia/{z}/{x}/{y}.png',
    maxZoom?: number,
    minZoom?: number,
    attributionControl?: boolean
}

export type DefaultMarkerIcon = {
    iconRetinaUrl?: string,
    iconUrl: string,
    shadowUrl?: string
}

export type WktShape = {
    wkt: string
    areaSize?: number
    id?: number
}

export type Coordinate = {
    lat: number
    lng: number
}

export type IconOptions = {
    iconUrl: string
    iconWidth: number,
    iconHeight: number
}

export type MapBounds = {
    precision: number,
    bounds: Bounds
}

export type Bounds = {
    topLeft: Coordinate,
    bottomRight: Coordinate
}

export type ShapeLayerDefinition = {
    layerName: string,
    shapes: ShapeDefinition[],
    isDisplay?: boolean
}

export type ToolbarConfig = {
    // Config Flags:
    isImportExport?: boolean
    isToolbarSettings?: boolean
    // Toolbar Plugins Config:
    toolbarPluginsConfig?: ToolbarPluginsConfig
}
export type ToolbarPluginsConfig = {
    layersControllerConfig?: LayersControllerConfig
    fullScreenConfig?: FullScreenConfig
    zoomToExtentConfig?: ZoomToExtentConfig
    zoomControlConfig?: ZoomControlConfig
    searchBoxConfig?: SearchBoxConfig
    polylineMeasureConfig?: PolylineMeasureConfig
    unitsChangerConfig?: UnitsChangerConfig
    drawBarConfig?: DrawBarConfig
}
export type MapPluginsConfig = {
    miniMapConfig?: MiniMapConfig
    mouseCoordinateConfig?: MouseCoordinateConfig
    scaleControlConfig?: ScaleControlConfig
}
export type ConfigFlags = {
    zoomToExtentOnNewData?: boolean
}
// =========== Plugins =========
/* Layers Controller */
export type LayersControllerConfig = BasePluginConfig & {
    layersControllerOptions?: LayersControllerOptions
}
export type LayersControllerOptions = BaseControlOptions & {
}

/* Full Screen */
export type FullScreenConfig = BasePluginConfig & {
    fullScreenOptions?: FullScreenOptions
}
export type FullScreenOptions = BaseControlOptions & {
}

/* Zoom to extent */
export type ZoomToExtentConfig = BasePluginConfig & {
    zoomToExtentOptions?: ZoomToExtentOptions
}
export type ZoomToExtentOptions = BaseControlOptions & {
}

/* Zoom */
export type ZoomControlConfig = BasePluginConfig & {
}

/* Search Box */
export type SearchBoxConfig = BasePluginConfig & {
    searchBoxOptions?: SearchBoxOptions
}
export type SearchBoxOptions = BaseControlOptions & {
    searchOnLayer?: boolean,
    queryServerUrl?: string
}

/* Polyline Measure */
export type PolylineMeasureConfig = BasePluginConfig & {
    polylineMeasureOptions?: PolylineMeasureOptions,
}
export type PolylineMeasureOptions = BaseControlOptions & {
    showMeasurementsClearControl?: boolean,
    clearMeasurementsOnStop?: boolean
}

/* Units Changer */
export type UnitsChangerConfig = BasePluginConfig & {
    unitsChangerOptions?: UnitsChangerOptions,
}
export type UnitsChangerOptions = BaseControlOptions & {
}

/* Draw Bar */
export type DrawBarConfig = BasePluginConfig & {
    drawBarOptions?: DrawBarOptions;
}
export type DrawBarOptions = BaseControlOptions & {
    draw?: DrawBarOptionsDraw,
    edit?: DrawBarOptionsEdit
}
export type DrawBarOptionsDraw = {
    polyline?: boolean,  // Turns off this drawing tool
    polygon?: boolean,   // Turns off this drawing tool
    circle?: boolean,    // Turns off this drawing tool
    rectangle?: boolean, // Turns off this drawing tool
    marker?: boolean,     // Turns off this drawing tool  
    textualMarker?: boolean
}
export type DrawBarOptionsEdit = {
    remove?: boolean
}

/* Minimap */
export type MiniMapConfig = BasePluginConfig & {
    miniMapOptions?: MiniMapOptions
}
export type MiniMapOptions = BaseControlOptions & {
    toggleDisplay?: boolean,
}

/* Mouse Coordinate */
export type MouseCoordinateConfig = BasePluginConfig & {
    mouseCoordinateOptions?: MouseCoordinateOptions
}
export type MouseCoordinateOptions = BaseControlOptions & {
    gps?: boolean,
    gpsLong?: boolean,
    utm?: boolean,
    utmref?: boolean
}

/* Scale */
export type ScaleControlConfig = BasePluginConfig & {
    scaleControlOptions?: ScaleControlOptions
}
export type ScaleControlOptions = BaseControlOptions & {
    maxWidth?: number
}


// =========== SHAPES =========
export enum ShapeType {
    CIRCLE,
    POLYGON,
    MARKER,
    POLYLINE,
    LABEL,
    MULTIPOLYGON
}

export enum DropDownItemType {
    REGULAR, RADIO_BUTTON, CHECK_BOX
}

export type ShapeDefinition = {
    data?: ShapeData
    shapeWkt?: string
    shapeObject?: ShapeObject
    options?: ShapeObjectOptions
}

export type ShapeData = {
    name?: string,
    description?: string,
    count?: number,
    dateTime?: number,
    tag?: any,
    isSelected?: boolean,
    id?: string
}

export type ShapeEntities = CircleShape | PolygonShape | MarkerShape | PolylineShape | LabelShape | MultiPolygonShape // PointShape

export type ShapeObject = {
    type: ShapeType,
    shape: ShapeEntities
}

export type ShapeObjectOptions = CircleShapeOptions | PolygonShapeOptions | MarkerShapeOptions | PolylineShapeOptions | LabelShapeOptions | MultiPolygonShapeOptions // PointShapeOptions |

// =========== CIRCLE / (POINT) =========

export type CircleShape = {
    coordinate: Coordinate,
    radius: number
}

export type CircleShapeOptions = {
    // radius: number,
    color?: string,
    fillColor?: string,
    fillOpacity?: number,
}

// =========== POLYGON =========

export type PolygonShape = {
    coordinates: Coordinate[],
    // map: Function
}

export type PolygonShapeOptions = {
    color?: string,
    fillColor?: string,
    fillOpacity?: number,
}

// =========== MULTI-POLYGON =========

export type MultiPolygonShape = {
    polygons: PolygonShape[],
}

export type MultiPolygonShapeOptions = {
    color?: string,
    fillColor?: string,
    fillOpacity?: number,
}

// =========== MARKER =========
export type MarkerShape = {
    coordinate: Coordinate,
}

export type MarkerShapeOptions = {
    customIcon?: IconOptions,
    icon?: any
    draggable?: boolean,
}

// =========== POLILINE =========
export type PolylineShape = {
    coordinates: Coordinate[],
}
export type PolylineShapeOptions = {
    color?: string,
}

// =========== LABEL =========
export type LabelShape = {
    coordinate: Coordinate,
    text: string
}

export type LabelShapeOptions = {
    icon?: any
}



type BasePluginConfig = {
    enable?: boolean
}
type BaseControlOptions = {
    position?: ControlPosition
}