import _ from "lodash";
import { DEFAULT_OSM_TILE, MIN_ZOOM, MAX_ZOOM, FILE_TYPES_ARRAY, GENERATED_ID } from "./statics";
import { ShapeType } from "../models";
import L from "leaflet";
import LayersFactory from "./LayersFactory";
import store from "../components/store/store";
import { ShapeManagerRepository } from "./shapes/ShapeManagerRepository";
export default class Utils {
    static log_componentWillLoad(compName) {
        console.log(`componentWillLoad ${compName}`);
    }
    static log_componentDidLoad(compName) {
        console.log(`componentDidLoad ${compName}`);
    }
    static log_componentDidUnload(compName) {
        console.log(`componentDidUnload ${compName}`);
    }
    static doNothing(imports) {
        !!imports;
    }
    static stopDoubleClickOnPlugin(htmlElement) {
        // Disable double-click
        htmlElement.addEventListener("dblclick", (eventData) => {
            eventData.stopPropagation();
        });
    }
    static fitLayerControllerPosition(LayerControllerMode = '') {
        const layerControllerButton = document.querySelector('.custom-toolbar-button.layer-controller');
        const layerControllerPlugin = document.querySelector('.custom-layer-controller');
        if (!(layerControllerButton && layerControllerPlugin)) {
            return;
        }
        layerControllerPlugin.style.left = layerControllerButton.offsetLeft + 'px';
        // layerControllerPlugin.className = layerControllerPlugin.className+ ' ' + isShowLayerController;
        const customLayerController = document.querySelector('.custom-layer-controller');
        customLayerController.className = layerControllerPlugin.className + ' ' + LayerControllerMode;
        const styledLayerControllerElement = document.querySelector('.leaflet-control-layers-expanded');
        styledLayerControllerElement.parentNode.removeChild(styledLayerControllerElement);
        customLayerController.appendChild(styledLayerControllerElement);
        // Empty class list for this Form element
        // styledLayerControllerElement.firstElementChild.firstElementChild.classList = '';
    }
    static exportBlobFactory(fileType, selectedLeafletObjects, mapState, callback) {
        this.doNothing([fileType, selectedLeafletObjects, mapState, callback]);
        // const relevantExportedLayers: L.Layer[] = Utils.getRelevantExportedLayers(selectedLeafletObjects, mapState, map);
        // const geoJsonList: L.GeoJSON[] = Utils.shapeListToGeoJson(relevantExportedLayers);
        // return Utils.getBlobByType(fileType, geoJsonList, callback);
        return null;
    }
    static toggleCustomDropDownMenu(elm) {
        const toogleState = elm.style.display;
        Utils.closeAllCustomDropDownMenus();
        elm.style.display = (toogleState === 'block') ? 'none' : 'block';
        if (elm.style.display === 'block') {
            document.querySelector('.custom-toolbar-button.layer-controller').classList.remove('clicked');
            document.querySelector('.custom-layer-controller').classList.remove('show');
        }
    }
    static closeAllCustomDropDownMenus() {
        const allDropDownMenus = document.querySelectorAll('.menu');
        _.forEach(allDropDownMenus, (menu) => {
            menu.style.display = 'none';
        });
    }
    static setRadioButtonsByCheckedValue(customDropDownPluginEl, groupName, checkedValue) {
        const groupItems = customDropDownPluginEl.getControl().getContainer().querySelectorAll(`.menu li.menu-item.custom-group [name="${groupName}"]`);
        _.forEach(groupItems, (input) => {
            // Unselect checked element
            if (input.getAttribute('checked')) {
                input.removeAttribute('checked');
            }
        });
        _.forEach(groupItems, (input) => {
            // Selecet element
            if (input.getAttribute('value') === checkedValue) {
                input.setAttribute('checked', 'true');
            }
        });
    }
    static initStoreWithMapTiles(tilesLayerList) {
        const baseMaps = {};
        if (tilesLayerList && tilesLayerList.length) {
            tilesLayerList.forEach((t) => {
                // Add other layers
                const tileOptions = Object.assign({}, t, { noWrap: true });
                // Create tile Layer from Uri
                baseMaps[t.name] = new L.TileLayer(t.tilesURI, tileOptions);
            });
        }
        else {
            const tileOptions = { minZoom: MIN_ZOOM, maxZoom: MAX_ZOOM, attributionControl: false, noWrap: true };
            baseMaps[DEFAULT_OSM_TILE.name] = new L.TileLayer(DEFAULT_OSM_TILE.address, tileOptions);
        }
        return baseMaps;
    }
    static initiateLayers(shapeLayers) {
        // if (!_.get(store, 'state.shapeLayers.length')) { return; }
        // const shapeLayers: ShapeLayerDefinition[] = store.state.shapeLayers;
        const initialLayersTemp = [];
        shapeLayers.forEach((item) => {
            const shapeLayerContainer = LayersFactory.createHeatAndClusterLayer(item);
            // this.addingNewLayerToLayerController(shapeLayerContainer, LayerNames.INITIAL_LAYERS)
            initialLayersTemp.push(shapeLayerContainer);
        });
        return initialLayersTemp;
    }
    static setEventsOnLeafletLayer(leafletObject, eventHandlers) {
        if (leafletObject && eventHandlers) {
            const eventNames = Object.keys(eventHandlers) || [];
            eventNames.forEach((eventName) => {
                if (eventHandlers[eventName]) {
                    leafletObject.on(eventName, eventHandlers[eventName]);
                }
            });
        }
    }
    static shapeOnClickHandler(manager, clickEvent) {
        if (store.state.mapConfig.isSelectionDisable) {
            return;
        }
        const groupId = clickEvent.target.groupId;
        let groupData = null;
        if (groupId === GENERATED_ID.DEFAULT_GROUP || groupId === GENERATED_ID.DRAW_LAYER_GROUP_ID) {
            groupData = {
                [clickEvent.target.id]: store.groupIdToShapeStoreMap[groupId][clickEvent.target.id]
            };
        }
        else {
            groupData = store.groupIdToShapeStoreMap[clickEvent.target.groupId];
        }
        _.forEach(groupData, (shapeStore) => {
            manager.toggleHighlight(shapeStore.leafletRef);
            if (clickEvent.originalEvent.ctrlKey) {
                manager.toggleSelectShape(shapeStore.leafletRef);
                manager.updateIsSelectedView(shapeStore.leafletRef);
                Utils.updateBubble(shapeStore.leafletRef);
            }
        });
        // context.props.onSelectionDone([clickEvent.target.shapeDef]);
    }
    static updateBubble(leafletObject) {
        const shapeData = store.groupIdToShapeStoreMap[leafletObject.groupId][leafletObject.id].shapeDef.data;
        // Update popup
        const bubbleContent = Utils.generatePopupMarkupFromData(shapeData);
        if (leafletObject._layers) {
            // Multipolygon flow
            Object.values(leafletObject._layers).forEach((polygonItem) => {
                updateBubbleByLayerAndContent(polygonItem, bubbleContent);
            });
        }
        else {
            // Other shapes flow
            updateBubbleByLayerAndContent(leafletObject, bubbleContent);
        }
        function updateBubbleByLayerAndContent(layer, bubbleData) {
            if (layer.getPopup()) {
                layer.setPopupContent(bubbleData);
            }
            if (layer.getTooltip()) {
                layer.setTooltipContent(bubbleData);
            }
        }
    }
    ;
    // public static updateIsSelectedClusterView(leafletObject: any) {
    //     // const leafletObjectParent: any = leafletObject.__parent && leafletObject.__parent._group.getVisibleParent(leafletObject);
    //     const clusterChilds: (L.Layer | L.FeatureGroup)[] = leafletObject.__parent.getAllChildMarkers();
    //     const isClusterSelected: boolean = _.some(clusterChilds, (layer: L.Layer | L.FeatureGroup) => {
    //         if (layer.id && layer.groupId) {
    //             const shapeStore: ShapeStore = store.groupIdToShapeIdMap[layer.groupId][layer.id];
    //             const isSelected = _.get(shapeStore, 'shapeDef.data.isSelected');
    //             return isSelected;
    //         }
    //     })
    //     if (isClusterSelected) {
    //         // leafletObjectParent._icon.classList.add('selected-cluster');
    //     } else {
    //         // leafletObjectParent._icon.classList.remove('selected-cluster');
    //     }
    // }
    static removeHighlightPOIs() {
        const highlighted = document.querySelectorAll('.highlighted');
        _.forEach(highlighted, (elm) => {
            elm.classList.remove('highlighted');
        });
    }
    static highlightPOIsByGroupId(groupId) {
        if (!groupId) {
            return;
        }
        const groupIdData = store.groupIdToShapeStoreMap[groupId];
        if (groupIdData) {
            _.forEach(groupIdData, (shapeStore) => {
                const manager = ShapeManagerRepository.getManagerByType(_.get(shapeStore, 'shapeDef.shapeObject.type'));
                const isMarkerManager = manager && (manager.getType() === ShapeType.MARKER);
                const isIntercept = _.get(shapeStore, 'leafletRef._icon') && _.get(shapeStore, 'shapeDef.data.type') === 'intercept';
                const shouldBeHighLighted = groupId === _.get(shapeStore, 'shapeDef.data.groupId');
                const highlightMarkerCluster = /* (shapeStore.shapeDef.data.groupId === groupId) &&  */ _.get(shapeStore, 'leafletRef.__parent._group');
                if (!!highlightMarkerCluster) {
                    const cluster = highlightMarkerCluster.getVisibleParent(shapeStore.leafletRef);
                    if (_.get(cluster, '_icon')) {
                        cluster._icon.classList.add('highlighted');
                    }
                }
                if (shouldBeHighLighted && isMarkerManager && isIntercept && _.get(shapeStore, 'leafletRef._icon')) {
                    // add highilight
                    shapeStore.leafletRef._icon.classList.add('highlighted');
                }
                else if (isMarkerManager && isIntercept && _.get(shapeStore, 'leafletRef._icon')) {
                    // remove highilight from preveus highlighted intercepts
                    shapeStore.leafletRef._icon.classList.remove('highlighted');
                }
            });
        }
    }
    static getVisibleLayers(mapLayers, map) {
        const shapeLayers = [];
        // collect all visible leaflet shapes from every layer
        // Initial layers
        mapLayers.initialLayers.forEach((dataLayer) => {
            const isLayerVisible = map.hasLayer(dataLayer.leafletClusterLayer);
            if (isLayerVisible) {
                // Add all layers-objects to the output list
                shapeLayers.push(...dataLayer.leafletClusterLayer.getLayers());
            }
        });
        // Imported layers
        if (mapLayers.importedLayers) {
            FILE_TYPES_ARRAY.forEach((fileType) => {
                mapLayers.importedLayers[fileType].forEach((dataLayer) => {
                    const isLayerVisible = map.hasLayer(dataLayer.leafletClusterLayer);
                    if (isLayerVisible) {
                        // Add all layers-objects to the output list
                        shapeLayers.push(...dataLayer.leafletClusterLayer.getLayers());
                    }
                });
            });
        }
        // Drawable layers
        mapLayers.drawableLayers.forEach((drawLayer) => {
            const isLayerVisible = map.hasLayer(drawLayer);
            if (isLayerVisible) {
                // Add all layers-objects to the output list
                shapeLayers.push(...drawLayer.getLayers());
            }
        });
        return shapeLayers;
    }
    // public static getSelectedObjects(): ShapeStore[] {
    //     // get all selected object
    //     let allSelectedObjects: ShapeStore[] = [];
    //     _.forEach(store.idToSelectedObjectsMap, (selectedObjectsValue: SelectedObjectsValue) => {
    //         const selectedShapeStore: ShapeStore = this.getShapeStoreByShapeId(shapeIds.shapeId, shapeIds.groupId);
    //         allSelectedObjects.push(selectedShapeStore);
    //     })
    //     return allSelectedObjects;
    // }
    static getShapeStoreByShapeId(shapeId, groupId) {
        let groupDataList = [];
        if (groupId) {
            groupDataList.push(store.groupIdToShapeStoreMap[groupId]);
        }
        else {
            _.forEach(store.groupIdToShapeStoreMap, (groupData) => {
                groupDataList.push(groupData);
            });
        }
        let selectedShape = null;
        _.forEach(groupDataList, (groupData) => {
            _.forEach(groupData, (shapeStore) => {
                if (shapeStore.leafletRef.id === shapeId) {
                    selectedShape = shapeStore;
                }
            });
        });
        return selectedShape;
    }
    // public isLayerNeedToBeSelected(layer: L.Layer| L.FeatureGroup): boolean {
    //     if (layer.groupId.includes(GENERATED_ID.DEFAULT_GROUP)
    //         || layer.groupId.includes(GENERATED_ID.DRAW_LAYER_GROUP_ID)) {
    //         // Add shape-id to selected list
    //         // this.selectedIds[shapeIds.shapeId] = shapeIds
    //     } else {
    //         // Add group-id to selected list
    //         // this.selectedIds[shapeIds.groupId] = { groupId: '', shapeId: '' };
    //     }
    // }
    static clustersReselection() {
        const clusters = store.gisMap.getContainer().querySelectorAll('.selected-cluster') || [];
        _.forEach(clusters, ((cluster) => cluster.classList.remove('selected-cluster')));
        Utils.selectClustersBySelectedLeafletObjects(store.idToSelectedObjectsMap); // O.A
    }
    static updateViewForSelectedObjects() {
        // const selectedObjects: ShapeStore[] = Utils.getSelectedObjects();
        // // TBD check e for inner shapes instead of iterate all visibleLayers
        // selectedObjects.forEach((shapeStore: ShapeStore) => {
        //     const manager = ShapeManagerRepository.getManagerByType(_.get(shapeStore, 'shapeDef.shapeObject.type'));
        //     if (manager) {
        //         if (store.gisMap.getBounds().contains((shapeStore.leafletRef as any).getLatLng())) {
        //             manager.updateIsSelectedView(shapeStore.leafletRef);
        //         }
        //     }
        // });
        _.forEach(store.idToSelectedObjectsMap, (selectedObjectsValue, key) => {
            let groupData = {};
            switch (selectedObjectsValue.selectionType) {
                case 'group':
                    // Whole group was selected (cant be DEFAULT_GROUP or DRAW_LAYER_GROUP_ID)
                    groupData = store.groupIdToShapeStoreMap[selectedObjectsValue.groupId];
                    break;
                case 'single':
                    // just one shape was selected
                    groupData = {
                        [key]: store.groupIdToShapeStoreMap[selectedObjectsValue.groupId][key]
                    };
                    break;
                default:
                    break;
            }
            _.forEach(groupData, (shapeStore) => {
                const manager = ShapeManagerRepository.getManagerByType(_.get(shapeStore, 'shapeDef.shapeObject.type'));
                if (manager) {
                    if (store.gisMap.getBounds().contains(shapeStore.leafletRef.getLatLng())) {
                        manager.updateIsSelectedView(shapeStore.leafletRef);
                        // Fix for unselected shapes that theier group is selected
                        Utils.updateBubble(shapeStore.leafletRef);
                    }
                }
            });
        });
        // _.forEach(store.idToSelectedObjectsMap, (selectedObjectsValue: SelectedObjectsValue, key: string) => {
        // const shapeType: ShapeType = _.get(shapeStore, 'shapeDef.shapeObject.type');
        // const manager: ShapeManagerInterface = ShapeManagerRepository.getManagerByType(shapeType);
        // manager.updateIsSelectedView(layer);
        // _.forEach(groupData, shapeStore => {
        // })
    }
    static selectClustersBySelectedLeafletObjects(selectedObjects) {
        // if (_.isEmpty(selectedLeafletObjects)) { return; }
        // const selectedIdsList: string[] = Object.keys(selectedIds)
        _.forEach(selectedObjects, (selectedObjectsValue, key) => {
            // const shapeType: ShapeType = _.get(shapeStore, 'shapeDef.shapeObject.type');
            // const manager: ShapeManagerInterface = ShapeManagerRepository.getManagerByType(shapeType);
            // manager.updateIsSelectedView(layer);
            let groupData = {};
            switch (selectedObjectsValue.selectionType) {
                case 'group':
                    // Whole group was selected (cant be DEFAULT_GROUP or DRAW_LAYER_GROUP_ID)
                    groupData = store.groupIdToShapeStoreMap[selectedObjectsValue.groupId];
                    break;
                case 'single':
                    // just one shape was selected
                    groupData = {
                        [key]: store.groupIdToShapeStoreMap[selectedObjectsValue.groupId][key]
                    };
                    break;
                default:
                    break;
            }
            _.forEach(groupData, shapeStore => {
                const highlightMarkerCluster = _.get(shapeStore, 'leafletRef.__parent._group');
                if (!!highlightMarkerCluster) {
                    const cluster = highlightMarkerCluster && highlightMarkerCluster.getVisibleParent(shapeStore.leafletRef);
                    let isSelected = false;
                    if (store.idToSelectedObjectsMap.hasOwnProperty(shapeStore.leafletRef.groupId)
                        || store.idToSelectedObjectsMap.hasOwnProperty(shapeStore.leafletRef.id)) {
                        isSelected = true;
                    }
                    if (_.has(cluster, '_icon') && isSelected) {
                        cluster._icon.classList.add('selected-cluster');
                    }
                }
            });
        });
    }
    // public static selectedLeafletObjectHandler(leafletObject: L.FeatureGroup | L.Layer, shapeDef: ShapeDefinition) {
    //     // Single/Multi select a shape flow
    //     // const layerId: string = String(L.Util.stamp(leafletObject));	// Get leaflet layer id
    //     const leafletObjectParent: any = leafletObject.__parent && leafletObject.__parent._group.getVisibleParent(leafletObject);
    //     // Selected leaflet shpae list
    //     if (shapeDef.data.isSelected) {
    //         // Save leaflet shape reference to selected list
    //         // context.selectedLeafletObjects[layerId] = leafletObject; // O.A
    //         if (leafletObjectParent) {
    //             leafletObjectParent._icon.classList.add('selected-cluster');
    //         }
    //     } else {
    //         // Remove selected object from selectedLeafletObjects
    //         // delete context.selectedLeafletObjects[layerId];
    //         if (leafletObjectParent) {
    //             leafletObjectParent._icon.classList.remove('selected-cluster');
    //         }
    //     }
    //     if (_.isEmpty(store.selectedObjects)) {
    //         // Utils.zoomToExtend(store.selectedObjects, store.mapLayers, store.gisMap);
    //     }
    // }
    // public static zoomToExtend(selectedLeafletObjects: SelectedObjects, mapState: MapLayers, map: L.Map): boolean {
    //     let tempLayers: L.FeatureGroup = new L.FeatureGroup([]);
    //     const relevantShapes: L.Layer[] = this.getRelevantExportedLayers(selectedLeafletObjects, mapState, map);
    //     relevantShapes.map((shape: L.Layer) => {
    //         tempLayers.addLayer(shape);
    //     });
    //     if (tempLayers.getLayers().length === 0) {
    //         map.fitWorld();
    //         return true;
    //     } else {
    //         const bounds: L.LatLngBounds = tempLayers.getBounds();
    //         const boundsMaxZoom: number = map.getBoundsZoom(bounds);
    //         if (bounds && bounds._northEast && bounds._southWest && boundsMaxZoom) {
    //             map.fitBounds(bounds, { padding: ZOOM_TO_EXTEND_PADDING, maxZoom: boundsMaxZoom });
    //             return true;
    //         } else {
    //             console.log('Currently there is not any shapes on any layer');
    //         }
    //     }
    //     return false;
    // }
    // private static getRelevantExportedLayers(selectedLeafletObjects: { [key: string]: L.Layer }, mapState: MapLayers, map: L.Map): L.Layer[] {
    //     // Check if there are selected objects
    //     if (Object.keys(selectedLeafletObjects).length) {
    //         return this.getSelectedObjects(selectedLeafletObjects);
    //     } else {
    //         return this.getVisibleLayers(mapState, map);
    //     }
    // }
    static createBubble(leafletObject, shapeData, type) {
        // Create bubble
        const bubbleContent = Utils.generatePopupMarkupFromData(shapeData);
        if (leafletObject._layers) {
            // Multipolygon flow
            Object.values(leafletObject._layers).forEach((polygonItem) => {
                createBubbleByLayerAndContent(polygonItem, bubbleContent);
            });
        }
        else {
            // Other shapes flow
            createBubbleByLayerAndContent(leafletObject, bubbleContent);
        }
        function createBubbleByLayerAndContent(layer, bubbleData) {
            layer['bind' + type](bubbleData);
        }
    }
    ;
    static generatePopupMarkupFromData(shapeData) {
        const popupFields = _.omit(shapeData, ['id', 'groupId', /* 'isSelected', */ 'isSelectedFade', 'type', 'count']);
        let htmlTemplate = '';
        _.forIn(popupFields, (value, key) => {
            htmlTemplate +=
                `<div class="tooltip-row">
				<label class="tooltip-row-key">${key}</label><label class="tooltip-row-value">${value}</label>
			</div>`;
        });
        return htmlTemplate;
    }
}
Utils.appendHtmlWithContext = function (elm, dom, context) {
    elm.innerHTML = dom;
    const elements = elm.querySelectorAll("[attachEvent]");
    _.forEach(elements, (element) => {
        element.getAttribute("attachEvent").split(";").forEach(function (event) {
            const eventNameAndHandler = event.split(":");
            const eventName = eventNameAndHandler[0];
            const eventHandler = eventNameAndHandler[1];
            if (eventName && eventHandler) {
                element.addEventListener(eventName, context[eventHandler].bind(context));
            }
        });
    });
};
