import { MAP_CONTAINER_TAG, ZOOM_TO_EXTENT_PLUGIN_TAG, MAX_NORTH_EAST, MAX_SOUTH_WEST } from '../../../utils/statics';
import Utils from '../../../utils/utilities';
import _ from 'lodash';
import L from 'leaflet';
import store from '../../store/store';
import { ShapeManagerRepository } from '../../../utils/shapes/ShapeManagerRepository';
import { reaction } from 'mobx';
// import { reaction } from 'mobx';
export class MapContainer {
    constructor() {
        this.compName = MAP_CONTAINER_TAG;
        reaction(() => store.idToSelectedObjectsMap, (e) => {
            console.log(e);
            _.forEach(store.mapLayers.initialLayers, (initialLayer) => {
                let leafletClusterLayer = initialLayer.leafletClusterLayer;
                for (let cluster in leafletClusterLayer._featureGroup._layers) {
                    leafletClusterLayer._featureGroup._layers[cluster]._updateIcon && leafletClusterLayer._featureGroup._layers[cluster]._updateIcon();
                }
            });
        });
    }
    // @State() gisMap: L.Map;
    // styleLayerManagerControl: L.Control.StyledLayerControl;
    // layerManagerEl: HTMLLayerManagerPluginElement;
    zoomToExtent() {
        const zoomToExtentEl = this.el.querySelector(ZOOM_TO_EXTENT_PLUGIN_TAG);
        zoomToExtentEl.zoomToExtent();
    }
    changeDistanceUnits() {
        const distanceUnitTypes = ['km', 'mile', 'nauticalmiles'];
        let index = distanceUnitTypes.indexOf(store.state.mapConfig.distanceUnitType);
        index++;
        if (index === distanceUnitTypes.length)
            index = 0;
        store.state.mapConfig.distanceUnitType = distanceUnitTypes[index];
    }
    changeCoordinateSystem(unit) {
        // User wants specific unit
        if (unit) {
            store.state.mapConfig.coordinateSystemType = unit;
            return;
        }
        // Change to another coordinate in order
        const coordinateSystemTypes = ['utm', 'utmref', 'gps'];
        let index = coordinateSystemTypes.indexOf(store.state.mapConfig.coordinateSystemType);
        index++;
        if (index === coordinateSystemTypes.length)
            index = 0;
        store.state.mapConfig.coordinateSystemType = coordinateSystemTypes[index];
    }
    componentWillLoad() {
        Utils.log_componentWillLoad(this.compName);
        // Set first base map as working tile
        store.mapLayers.baseMaps = Utils.initStoreWithMapTiles(this.gisViewerProps.tileLayers);
        // Set initial layers
        store.mapLayers.initialLayers = Utils.initiateLayers(this.gisViewerProps.shapeLayers);
        store.gisMap = this.createMap();
    }
    render() {
        return (h("div", null,
            h("tool-bar", { gisMap: store.gisMap, config: store.state.toolbarConfig }),
            _.get(this, "gisViewerProps.mapPluginsConfig.scaleConfig.enable") ? (h("scale-plugin", { gisMap: store.gisMap, config: store.state.mapPluginsConfig.scaleConfig })) : (''),
            _.get(this, "gisViewerProps.mapPluginsConfig.miniMapConfig.enable") ? (h("mini-map-plugin", { gisMap: store.gisMap, config: store.state.mapPluginsConfig.miniMapConfig })) : (''),
            _.get(this, "gisViewerProps.mapPluginsConfig.mouseCoordinateConfig.enable") ? (h("mouse-coordinate-plugin", { gisMap: store.gisMap, config: store.state.mapPluginsConfig.mouseCoordinateConfig })) : ('')));
    }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        this.createEvents();
    }
    /**
       * Map Events:
       * ----------
       * layerremove / layeradd
       * baselayerchange
       * overlayadd / overlayremove
       * boxzoomstart / boxzoomend
       * movestart / moveend - (check those)
       */
    createEvents() {
        // const hasOnBoundsChanged: boolean = _.hasIn(this, 'context.props.onBoundsChanged');  // O.A
        store.gisMap.on('click', () => {
            Utils.closeAllCustomDropDownMenus();
            Utils.removeHighlightPOIs();
            document.querySelector('.custom-toolbar-button.layer-controller').classList.remove('clicked');
            document.querySelector('.custom-layer-controller').classList.remove('show');
            // if (e.originalEvent.shiftKey && e.originalEvent.ctrlKey && e.originalEvent.altKey) {
            //   this.writePackageVersion();
            // }
        });
        store.gisMap.on('baselayerchange', () => {
            // store.gisMap.setMinZoom(e.layer.options.minZoom);
            // store.gisMap.setMaxZoom(e.layer.options.maxZoom);
        });
        store.gisMap.on('drag zoomstart', (e) => {
            store.gisMap.panInsideBounds(e.target.options.maxBounds, { animate: false });
        });
        // Selecting area
        store.gisMap.on('boxzoomend', this.areaSelection);
        // Zoom event
        // if (hasOnBoundsChanged) {// O.A
        //   store.gisMap.on('moveend', (e: any) => {
        //     // store.state.onBoundsChanged(this.getBounds(), this.nextBoundsChangeIsProgrammatic);  
        //     // this.nextBoundsChangeIsProgrammatic = false;
        //   });
        // }
        store.gisMap.on('zoomstart', () => {
            // console.log(1)
            Utils.clustersReselection();
        });
        store.gisMap.on('movestart', () => {
            // console.log(2)
            // Utils.clustersReselection();
        });
        // store.gisMap.on('zoomlevelschange', () => {
        //   console.log(3)  // not triggerd
        // })
        store.gisMap.on('load', () => {
        });
        store.gisMap.on('zoom', () => {
            // console.log(4)
        });
        store.gisMap.on('move', () => {
            // console.log(5)
        });
        store.gisMap.on('zoomend', () => {
            // console.log(6)
        });
        store.gisMap.on('moveend', () => {
            console.log('moveend');
            // console.log(7)
            Utils.selectClustersBySelectedLeafletObjects(store.idToSelectedObjectsMap); // O.A
            Utils.updateViewForSelectedObjects();
        });
        // Leaflet mouse wheel zoom only after click on map
        const wheelZoomOnlyAfterClick = _.get(store, 'state.mapConfig.isWheelZoomOnlyAfterClick');
        if (wheelZoomOnlyAfterClick) {
            store.gisMap.scrollWheelZoom.disable();
            store.gisMap.on('click', () => {
                store.gisMap.scrollWheelZoom.enable();
            });
            store.gisMap.on('mouseout', () => {
                store.gisMap.scrollWheelZoom.disable();
            });
        }
        // Set map overlays events right after map is ready
        // this.context.map.on("overlayadd", ()=>{});
        // this.context.map.on("overlayremove", ()=>{});
    }
    createMap() {
        // Map options
        const extendedOptions = {}; // this.tileLayersComp.setTileLayers(this.context.mapState.baseMaps, tileProps);
        // Zoom control
        extendedOptions.zoomControl = _.get(store, 'state.mapConfig.isZoomControl', true);
        // MAX Bounds
        const northEast = L.latLng(MAX_NORTH_EAST.lat, MAX_NORTH_EAST.lng);
        const southWest = L.latLng(MAX_SOUTH_WEST.lat, MAX_SOUTH_WEST.lng);
        const bounds = new L.LatLngBounds(southWest, northEast);
        Object.assign(extendedOptions, {
            noWrap: true,
            maxBounds: bounds,
            minZoom: 2,
            maxBoundsViscosity: 1.0,
            //   doubleClickZoom: false,
            bounceAtZoomLimits: false,
            zoom: 1,
            center: {
                lat: 0.076304,
                lng: 0.013960
            },
        });
        return new L.Map('map', extendedOptions); // Create Map
    }
    areaSelection(event) {
        if (store.state.mapConfig.isSelectionDisable) {
            return;
        }
        const shapeDefSelectedList = [];
        const visibleLayers = Utils.getVisibleLayers(store.mapLayers, store.gisMap);
        visibleLayers.forEach((layer) => {
            const layerIds = {
                groupId: layer.groupId,
                shapeId: layer.id
            };
            const shapeStore = store.groupIdToShapeStoreMap[layerIds.groupId][layerIds.shapeId];
            const manager = ShapeManagerRepository.getManagerByType(_.get(shapeStore, 'shapeDef.shapeObject.type'));
            if (manager) {
                const latLng = layer._latlngs ? layer._latlngs : layer._latlng;
                const isSelected = store.idToSelectedObjectsMap.hasOwnProperty(layerIds.shapeId); /* shapeStore.shapeDef.data.isSelected; */
                // Object found in bounds
                if (latLng && event.boxZoomBounds.contains(latLng)) {
                    if (!isSelected) {
                        manager.toggleSelectShape(layer);
                        manager.updateIsSelectedView(layer);
                        Utils.updateBubble(layer);
                        // shapeDefSelectedList.push(shapeStore.shapeDef);
                    }
                }
            }
        });
        // Execute onGetSelected callback
        if (shapeDefSelectedList.length) {
            // this.context.props.onSelectionDone(shapeDefSelectedList);  // O.A
        }
    }
    static get is() { return "map-container"; }
    static get properties() { return { "changeCoordinateSystem": { "method": true }, "changeDistanceUnits": { "method": true }, "el": { "elementRef": true }, "gisViewerProps": { "type": "Any", "attr": "gis-viewer-props" }, "zoomToExtent": { "method": true } }; }
    static get style() { return "/**style-placeholder:map-container:**/"; }
}
