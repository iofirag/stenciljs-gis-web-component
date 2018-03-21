// import { ControlPosition } from "leaflet"
// import { Coordinate } from "../typePatches/L"

/* GisViewerProps and it children goes here */

export type GisViewerProps = {
    tileLayers?: TileLayerDefinition[]
    mapConfig?: MapConfig
    defaultMarkerIcon?: DefaultMarkerIcon
    shapeLayers?: ShapeLayerDefinition[]

    toolbarConfig?: ToolbarConfig       // Toolbar Plugins
    mapPluginsConfig?: MapPluginsConfig // Map Plugins
    // configFlags?: ConfigFlags           // Config Flags

    shapeForPopup?: any
    // gisSetState?: Function
    // Callbacks
    // onEndImportDraw?: (allImportedLayers: WktShape[]) => void
    // onDrawCreated?: (shapeWkt: WktShape) => void
    // onDrawEdited?: (shapeWktList: WktShape[]) => void
    // onDrawDeleted?: (shapeWktList: WktShape[]) => void
    // onBoundsChanged?: (mapBounds: MapBounds, programmatic: boolean) => void
    // onSelectionDone?: (shapeDefList: ShapeDefinition[]) => void
    // onMapReady?: () => void
    // onSaveKmlBlob?: (kml: Blob) => void
    // onSaveCsvBlob?: (csv: Blob) => void
    // onSaveShpBlob?: (shp: Blob) => void
}

export type MapConfig = {
    mode?: ClusterHeat
    clusterOptions?: ClusterOptions
    coordinateSystemType?: CoordinateSystemType
    distanceUnitType?: DistanceUnitType
    isZoomToExtentOnNewData?: boolean
    isWheelZoomOnlyAfterClick?: boolean
    isFlyToBounds?: boolean
    isZoomControl?: boolean
    // isExport?: boolean
}
export type DistanceUnitType = 'km' | 'mile' | 'nauticalmiles'
// export type CoordinateSystem = {
//     allowUse?: {
//         gps?: boolean,
//         gpsLong?: boolean,
//         utm?: boolean,
//         utmref?: boolean
//     }
//     initial?: CoordinateSystemType
// }
export type CoordinateSystemType = 'utm' | 'utmref' | 'gps'
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
    // isImportExport?: boolean
    isExport?: boolean
    isSettings?: boolean
    // Toolbar Plugins Config:
    toolbarPluginsConfig?: ToolbarPluginsConfig
}
export type ToolbarPluginsConfig = {
    layerManagerConfig?: LayerManagerConfig
    fullScreenConfig?: FullScreenConfig
    zoomToExtentConfig?: ZoomToExtentConfig
    // zoomControlConfig?: ZoomConfig
    searchConfig?: SearchConfig
    measureConfig?: MeasureConfig
    unitsChangerConfig?: UnitsChangerConfig
    drawBarConfig?: DrawBarConfig
}
export type MapPluginsConfig = {
    miniMapConfig?: MiniMapConfig
    mouseCoordinateConfig?: MouseCoordinateConfig
    scaleConfig?: ScaleConfig
}

// =========== Plugins =========
/* Layers Controller */
export type LayerManagerConfig = BasePluginConfig & {
    layersControllerOptions?: LayerManagerOptions
    isImport?: boolean
}
export type LayerManagerOptions = BaseControlOptions & {
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
export type ZoomConfig = BasePluginConfig & {
}

/* Search Box */
export type SearchConfig = BasePluginConfig & {
    searchOptions?: SearchOptions
}
export type SearchOptions = BaseControlOptions & {
    searchOnLayer?: boolean,
    queryServerUrl?: string
}

/* Measure */
export type MeasureConfig = BasePluginConfig & {
    measureOptions?: MeasureOptions,
}
export type MeasureOptions = BaseControlOptions & {
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
    drawBarOptions?: DrawBarOptions
    // unitsChangerOptions?: UnitsChangerOptions,  // remove this
}
export type DrawBarOptions = BaseControlOptions & {
    draw?: DrawBarOptionsDraw,
    edit?: DrawBarOptionsEdit
}
export type DrawBarOptionsDraw = boolean | {
    polyline?: boolean,  // Turns off this drawing tool
    polygon?: boolean,   // Turns off this drawing tool
    circle?: boolean,    // Turns off this drawing tool
    rectangle?: boolean, // Turns off this drawing tool
    marker?: boolean,     // Turns off this drawing tool  
    circlemarker?: boolean,
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
    // mouseCoordinateOptions?: MouseCoordinateOptions
}
export type MouseCoordinateOptions = BaseControlOptions & {
    gps?: boolean,
    gpsLong?: boolean,
    utm?: boolean,
    utmref?: boolean
}

/* Scale */
export type ScaleConfig = BasePluginConfig & {
    scaleOptions?: ScaleOptions
}
export type ScaleOptions = BaseControlOptions & {
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



export type BasePluginConfig = {
    enable?: boolean
}
export type BaseControlOptions = {
    position?: any //ControlPosition
}


// import L from 'leaflet'
// info on shape layer for internal use of Gis conponent
// contains ApiModels.ShapeLayerDefinition, which was received from props from external application
export type ShapeLayerContainer = {
    layerDefinition: ShapeLayerDefinition
    leafletHeatLayer: any //HeatLayer //O.A
    leafletClusterLayer: any //L.MarkerClusterGroup // O.A */
    isDisplay: boolean
    // type: LayerType // TODO
}