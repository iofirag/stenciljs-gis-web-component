import { observable, action, toJS } from 'mobx';
import { GisViewerProps, MapConfig, TileLayerDefinition, ShapeLayerDefinition,
    ScaleConfig, LayerManagerConfig, SearchConfig, MiniMapConfig, DrawBarConfig,
    MouseCoordinateConfig, MeasureConfig, ZoomToExtentConfig, UnitsChangerConfig,
    FullScreenConfig, ToolbarConfig, MapPluginsConfig, CoordinateSystemType,
    ClusterHeat, MapLayers, ShapeStore, ShapeIds,
    SelectedObjects, GroupIdToShapeStoreMap } from '../../models';
import _ from 'lodash';
import { GENERATED_ID } from '../../utils/statics';
// import { CoordinateType } from '../../utils/statics';



class Store {

    DEFAULT_VALUES: GisViewerProps;
    @observable state: GisViewerProps;
    @observable mapLayers: MapLayers;

    @observable groupIdToShapeStoreMap: GroupIdToShapeStoreMap;
    @observable idToSelectedObjectsMap: SelectedObjects;

    // @observable zoom: number;
    @observable gisMap: L.Map;

    @action
    toggleSelectionMode(shapeIds: ShapeIds) {
        // Toggle shape selection
        // this.groupIdToShapeStoreMap[shapeIds.groupId][shapeIds.shapeId].shapeDef.data.isSelected =
        //     !this.groupIdToShapeStoreMap[shapeIds.groupId][shapeIds.shapeId].shapeDef.data.isSelected;

        // if (this.groupIdToShapeStoreMap[shapeIds.groupId][shapeIds.shapeId].shapeDef.data.isSelected) {
        //     if (shapeIds.groupId.indexOf(GENERATED_ID.DEFAULT_GROUP)===0
        //         || shapeIds.groupId.indexOf(GENERATED_ID.DRAW_LAYER_GROUP_ID)===0) {
        //         // Add shape-id to selected list with group id (DEFAULT_GROUP / DRAW_LAYER_GROUP_ID)
        //         this.idToSelectedObjectsMap[shapeIds.shapeId] = { selectionType: 'single', groupId: shapeIds.groupId };
        //     } else {
        //             // Add group-id to selected list
        //         this.idToSelectedObjectsMap[shapeIds.groupId] = {selectionType: 'group', groupId: shapeIds.groupId};
        //     }
        // } else {
        //     // Remove shape from selected
        //     delete this.idToSelectedObjectsMap[shapeIds.shapeId];
        // }
        const isSelected: boolean = (this.idToSelectedObjectsMap[shapeIds.groupId] || this.idToSelectedObjectsMap[shapeIds.shapeId])? true: false;
        this.setSelectionMode(shapeIds, !isSelected);
        // Importent - Destracture the object for set new reference.
        this.idToSelectedObjectsMap = { ...this.idToSelectedObjectsMap };
    }

    // @computed get coordinateSystemType(): CoordinateSystemType {
    //     return this.state.mapConfig.coordinateSystemType;
    // }
    // @computed get clusterHeat(): ClusterHeat {
    //     return this.state.mapConfig.mode;
    // }

    /**
     * Set state to our componrnt
     * @param _state
     */
    @action initState(_props: GisViewerProps) {
        this.state = _.cloneDeep(_props);
    }

    /**
     * User update props to our component
     * @param _state
     */
    @action updateState(_state: GisViewerProps) {
        this.state = _.merge(toJS(this.state), _state);
    }

    @action changeCoordinates(_currentCoords: CoordinateSystemType) {
        this.state.mapConfig.coordinateSystemType = _currentCoords;
    }
    @action changeMapMode(_mode: ClusterHeat) {
        this.state.mapConfig.mode = _mode;
    }
    @action addShape(shapeStore: ShapeStore): void {
        // Set group-id and shape-id on layer
        shapeStore.leafletRef.groupId = shapeStore.shapeDef.data.groupId;
        shapeStore.leafletRef.id = shapeStore.shapeDef.data.id;

        const shapeIds: ShapeIds = {
            groupId: shapeStore.leafletRef.groupId,
            shapeId: shapeStore.leafletRef.id
        }
        if (!this.groupIdToShapeStoreMap.hasOwnProperty(shapeIds.groupId)) {
            // Init group id
            this.groupIdToShapeStoreMap[shapeIds.groupId] = {};
        }
        // Add data to group id
        this.groupIdToShapeStoreMap[shapeIds.groupId][shapeIds.shapeId] = shapeStore;


        /* not selected
            or first selected shape in group
            or single selected */
        // Set shape selection
        if (this.idToSelectedObjectsMap[shapeIds.groupId] // group already selected flow
            || this.idToSelectedObjectsMap[shapeIds.shapeId] // This object already selected
            || shapeStore.shapeDef.data.isSelected) {   // initiate as selected
            this.setSelectionMode(shapeIds, true);
        }
    }

    @action
    removeGroup(groupName: string): void {
        delete this.groupIdToShapeStoreMap[groupName];
    }
    removeSelectedShapeById(shapeId: string): void {
        delete this.idToSelectedObjectsMap[shapeId];
    }

    @action
    setSelectionMode(shapeIds: ShapeIds, isSelected: boolean) {
        if (isSelected) {
            if (shapeIds.groupId === GENERATED_ID.DEFAULT_GROUP
                || shapeIds.groupId === GENERATED_ID.DRAW_LAYER_GROUP_ID) {
                // Add shape-id to selected list with group id (DEFAULT_GROUP / DRAW_LAYER_GROUP_ID)
                this.idToSelectedObjectsMap[shapeIds.shapeId] = { selectionType: 'single', groupId: shapeIds.groupId };
            } else {
                // Add group-id to selected list
                this.idToSelectedObjectsMap[shapeIds.groupId] = { selectionType: 'group', groupId: shapeIds.groupId };
            }
        } else {
            if (this.idToSelectedObjectsMap.hasOwnProperty(shapeIds.groupId)) {
                // Remove group id from selected objects
                delete this.idToSelectedObjectsMap[shapeIds.groupId];
            } else if (this.idToSelectedObjectsMap.hasOwnProperty(shapeIds.shapeId)) {
                // Remove shape from selected
                delete this.idToSelectedObjectsMap[shapeIds.shapeId];
            }
        }
        // Importent - Destracture the object for set new reference.
        this.idToSelectedObjectsMap = { ...this.idToSelectedObjectsMap };
    }

    constructor() {
        this.changeCoordinates = this.changeCoordinates.bind(this);
        this.changeMapMode = this.changeMapMode.bind(this);

        this.DEFAULT_VALUES = this.getDefaultValue();
        this.state = this.DEFAULT_VALUES;
        this.mapLayers = this.getDefaultMapLayers()
        this.groupIdToShapeStoreMap = {};
        this.idToSelectedObjectsMap = {};
        // this.coordinateSystemType = 'gps';
        // this.distanceUnitType = 'km';
    }

    private getDefaultMapLayers(): MapLayers {
        const mapLayers: MapLayers = {
            baseMaps: {},// Check - change to type
            initialLayers: [],
            importedLayers: {
                csv: [],
                kml: [],
                zip: []
            },
            drawableLayers: []
        }
        return mapLayers;
    }
    private getDefaultValue(): GisViewerProps {
        // const protocol = 'http:';

        const mapConfig: MapConfig = {
            isZoomToExtentOnNewData: true,
            isWheelZoomOnlyAfterClick: true,
            isZoomControl: true,
            isFlyToBounds: true,
            // isExport: true,
            clusterOptions: {
                // disableClusteringAtZoom: 13,
                // chunkedLoading: true,
                // chunkProgress: true,
                // singleMarkerMode: false
            },
            mode: 'cluster',
            distanceUnitType: 'km',
            coordinateSystemType: 'gps',
        };

        const tileLayers: TileLayerDefinition[] = [
            {
                name: 'Online Map',
                tilesURI: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png', // protocol + '//osm/osm_tiles/{z}/{x}/{y}.png', // 'http://{s}.tile.osm.org/{z}/{x}/{y}.png', // 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', // 'http://10.164.39.38/pandonia/{z}/{x}/{y}.png',
                // zoom: 1,
                // center: {
                // 	lat:0,
                // 	lng: 0
                // },
                minZoom: 1,
                maxZoom: 18,
                attributionControl: false
                // zoomControl: false
            }
        ];

        const shapeLayers: ShapeLayerDefinition[] = [];

        const drawBarConfig: DrawBarConfig = {
          enable: true,
          drawBarOptions: {
              draw: {
                  polyline: true,
                  polygon: true, // Turns off this drawing tool
                  circle: true, // Turns off this drawing tool
                  rectangle: true, // Turns off this drawing tool
                  marker: true, // Turns off this drawing tool
                  // circlemarker: false,
                  // textualMarker: false // Turns off this drawing tool
              },
              edit: {
                  remove: true // Turns on remove button
              }
          }
      };

        const layerManagerConfig: LayerManagerConfig = {
            enable: true,
            drawBarConfig,
            isImport: true
        };

        const scaleConfig: ScaleConfig = {
            enable: true,
            scaleOptions: {
                position: 'bottomright'
            }
        };

        const searchConfig: SearchConfig = {
            enable: true,
            searchOptions: {
                searchOnLayer: true,
                queryServerUrl: 'http://nominatim.openstreetmap.org/search?format=json&q={s}' // protocol + '//osm/nominatim?format=json&limit=3&type=administrative&q={s}' // 'http://10.164.39.38/nominatim/search.php?format=json&q={s}' // 'http://nominatim.openstreetmap.org/search?format=json&q={s}' // 'http://nominatim.openstreetmap.org/search?format=json&q={s}'
            }
        };

        const miniMapConfig: MiniMapConfig = {
            enable: true,
            miniMapOptions: {
                toggleDisplay: true
            }
        };

        // const zoomControlConfig: ZoomConfig = {
        //   enable: true
        // };



        const mouseCoordinateConfig: MouseCoordinateConfig = {
            enable: true,
        };

        const measureConfig: MeasureConfig = {
            enable: true,
            measureOptions: {
                // showMeasurementsClearControl: true,
                // clearMeasurementsOnStop: false
            }
        };

        const zoomToExtentConfig: ZoomToExtentConfig = {
            enable: true,
            zoomToExtentOptions: {
                position: 'topright'
            }
        };

        const unitsChangerConfig: UnitsChangerConfig = {
            enable: true
        };
        const fullScreenConfig: FullScreenConfig = {
            enable: true
        };




        const toolbarConfig: ToolbarConfig = {
            isExport: true,
            isSettings: true,
            toolbarPluginsConfig: {
                layerManagerConfig, fullScreenConfig, measureConfig,
                unitsChangerConfig, zoomToExtentConfig,
                searchConfig
            }

        };
        const mapPluginsConfig: MapPluginsConfig = {
            miniMapConfig, scaleConfig, mouseCoordinateConfig
        };

        return {
            tileLayers,
            mapConfig,
            shapeLayers,

            toolbarConfig,
            mapPluginsConfig,

            //   onMapReady: this.onMapReadyCB.bind(this),
            //   onDrawEdited: this.drawEditedCB.bind(this),
            //   onDrawCreated: this.drawCreatedCB.bind(this),
            //   onSaveKmlBlob: this.onSaveKmlFormatCB.bind(this),
            //   onSaveCsvBlob: this.onSaveCsvFormatCB.bind(this),
            //   onDrawDeleted: this.drawDeletedCB.bind(this),
            //   onSaveShpBlob: this.onSaveShpFormatCB.bind(this),
            //   onSelectionDone: this.onSelectionDoneCB.bind(this),
            //   onBoundsChanged: this.onBoundsChangedCB.bind(this),
            //   onEndImportDraw: this.endImportDrawCB.bind(this),
            //   onChangeMapMode: this.changeMapModeCD.bind(this),
            //   onFetchDataByShapeId: this.fetchDataByShapeIdCB.bind(this)
        };
    }
}
export default new Store()








// state = {
    //     toolbar: {
    //         coordinateSystemType: CoordinateSystemType = 'gps'
    //     }
    // }

    // get drawbarConfig() {
    //     return this.state
    // }
    // @action add(_title: string) {
    //     this.todos.push({title: _title, done: false});
    // }

    // constructor() {
    //     const todos2 = observable([
    //         {
    //             title: "Make coffee",
    //             done: true,
    //         },
    //         {
    //             title: "Find biscuit",
    //             done: false
    //         }
    //     ]);
    // }


// class TodoList {

//     [x: string]: any;
//     @observable todos: any[] = [];

//     @action removeTodo(_todo: Todo) {
//         this.todos = this.todos.slice().filter(p => p.id !== _todo.id);
//     }
//     @action add(_title: string) {
//         this.todos.push(new Todo(_title))
//     }
//     @computed get unfinishedTodoCount() {
//         return this.todos.slice().filter((_todo: Todo) => !_todo.finished).length
//     }
// }


// class Todo {

//     @observable id: any = Math.random();
//     @observable createdOn: any = new Date().getTime()
//     @observable completedOn: any

//     @observable title: any;
//     @observable finished: boolean;
//     @action toggleState() {
//         this.finished = !this.finished
//         this.completedOn = this.finished ? new Date().getTime() : undefined
//     }

//     constructor(_title: string) {
//         this.title = _title;
//         this.finished = false;
//     }
// }



        // this.distanceUnitTypeState = _.get(this, 'gisViewerProps.mapConfig.distanceUnitType', 'km');
        // this.coordinateSystemTypeState = _.get(this, 'gisViewerProps.mapConfig.coordinateSystemType', 'gps');
