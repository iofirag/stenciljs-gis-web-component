import { Component, Prop, Element, Method } from '@stencil/core';
import { MAP_CONTAINER_TAG, ZOOM_TO_EXTENT_PLUGIN_TAG, MAX_NORTH_EAST, MAX_SOUTH_WEST, 
  DRAW_BAR_PLUGIN_TAG, GIS_VIEWER_TAG } from '../../../utils/statics';
import Utils from '../../../utils/utilities';
import { GisViewerProps, CoordinateSystemType, DistanceUnitType, ShapeDefinition, Coordinate, 
  ShapeIds, ShapeStore, ShapeLayerContainer_Dev, MapBounds, SelectedObjects, 
  GroupIdToShapeStoreMap, ShapeData, WktShape, FILE_TYPES, ShapeType } from '../../../models';
import _ from 'lodash';
import L from 'leaflet';
import store from '../../store/store';
import { reaction, toJS } from 'mobx';
import { ShapeManagerRepository } from '../../../utils/shapes/ShapeManagerRepository';
import { ShapeManagerInterface } from '../../../utils/shapes/ShapeManager';

@Component({
  tag: "map-container",
  // shadow: true,
  styleUrls: [
    // '../../../../node_modules/leaflet/dist/leaflet.css',
    // '../../../../node_modules/leaflet.markercluster/dist/MarkerCluster.css',
    // '../../../../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css',
    // '../gis-viewer.scss',

    'map-container.scss',
    '../../../utils/shapes/ShapeManager.scss'
  ]
})
export class MapContainer {
  compName: string = MAP_CONTAINER_TAG;
  private nextBoundsChangeIsProgrammatic: boolean;
  @Prop() gisViewerProps: GisViewerProps;

  @Element() el: HTMLElement;

  @Method()
  zoomToExtent() {
    const zoomToExtentEl: HTMLZoomToExtentPluginElement = this.el.querySelector(ZOOM_TO_EXTENT_PLUGIN_TAG);
    zoomToExtentEl.zoomToExtent();
    this.nextBoundsChangeIsProgrammatic = true;
  }
  @Method()
  changeDistanceUnits() {
    const distanceUnitTypes: DistanceUnitType[] = ['km', 'mile', 'nauticalmiles'];
    let index = distanceUnitTypes.indexOf(store.state.mapConfig.distanceUnitType);
    index++;
    if (index === distanceUnitTypes.length) index = 0;
    store.state.mapConfig.distanceUnitType = distanceUnitTypes[index];
  }
  @Method()
  changeCoordinateSystem(unit?: CoordinateSystemType) {
    // User wants specific unit
    if (unit) {
      store.state.mapConfig.coordinateSystemType = unit;
      return;
    }
    // Change to another coordinate in order
    const coordinateSystemTypes: CoordinateSystemType[] = ['utm','utmref','gps'];
    let index = coordinateSystemTypes.indexOf(store.state.mapConfig.coordinateSystemType);
    index++;
    if (index === coordinateSystemTypes.length ) index = 0;
    store.state.mapConfig.coordinateSystemType = coordinateSystemTypes[index];
  }

  @Method()
  getBounds(isProgrammatic: boolean = false): MapBounds {
    const bounds: L.LatLngBounds = store.gisMap.getBounds();

    const boundsState: MapBounds = {
        precision: store.gisMap.getZoom(),
        bounds: {
            topLeft: {
                lat: bounds._northEast.lat,
                lng: bounds._southWest.lng
            },
            bottomRight: {
                lat: bounds._southWest.lat,
                lng: bounds._northEast.lng
            }
        },
        isProgrammatic
    };

    return boundsState;
  }

  @Method()
  getSelectedShapes(): ShapeDefinition[] {
    const selectedLeafletObjects: SelectedObjects = store.idToSelectedObjectsMap;
    const groupIdToShapeStoreMap: GroupIdToShapeStoreMap = store.groupIdToShapeStoreMap;

    if (_.isEmpty(toJS(selectedLeafletObjects))) { return; }

    // converting array of ShapeStore to an array of ShapeDefinition
    const selectedObjects: ShapeDefinition[] = Utils.getSelectedObjects(selectedLeafletObjects, groupIdToShapeStoreMap).map((shapeStore: ShapeStore) => {
      shapeStore.shapeDef.data.isSelected = true;
      return toJS(shapeStore.shapeDef);
    });

    return selectedObjects;
  }

  @Method()
  clearDrawLayer() {
    const drawBarEl: HTMLDrawBarPluginElement = this.el.querySelector(DRAW_BAR_PLUGIN_TAG);
    drawBarEl.clear();
  }

  @Method()
  exportDrawLayer(): WktShape[] {
    const drawBarEl: HTMLDrawBarPluginElement = this.el.querySelector(DRAW_BAR_PLUGIN_TAG);
    return drawBarEl.export();
  }

  @Method()
  importDrawState(wktShapes: Array<WktShape>): void {
    const drawBarEl: HTMLDrawBarPluginElement = this.el.querySelector(DRAW_BAR_PLUGIN_TAG);
    drawBarEl.import(wktShapes);
  }

  @Method()
  updateSelectionMode(shapeDataArr: ShapeData[]): void {
    const changedIds: SelectedObjects = {};
    const shapeDefList: ShapeDefinition[] = [];

    const visibleLayers: L.Layer[] = Utils.getVisibleLayers(store.mapLayers, store.gisMap);
    shapeDataArr.forEach((item: ShapeData) => {
      // TBD need to find better solution
      visibleLayers.forEach((layer: L.Layer) => {
        const shapeIds: ShapeIds = {
          groupId: layer.groupId,
          shapeId: layer.id,
        }
        if (shapeIds.groupId === item.groupId || shapeIds.shapeId === item.id) {
          Utils.createShapeDefList(shapeIds, item.isSelected, changedIds, shapeDefList);
        }
      })
    })
    const gisViewerEl: HTMLGisViewerElement = document.querySelector(GIS_VIEWER_TAG);
    gisViewerEl.brodcastEvent('selectionDone', shapeDefList);
  }

  @Method()
  exportBlobByFileTypeCommand(fileType: FILE_TYPES): Blob {
    return Utils.exportBlobFactory(fileType, store.mapLayers, store.gisMap);
  }

  // @Method()
  // fitBounds(bounds: L.LatLngBoundsExpression, options?: FitBoundsOptions): void {
  //   this.nextBoundsChangeIsProgrammatic = true;
  //   store.gisMap.fitBounds(bounds, options);
  // }

  constructor() {
    reaction(() => store.idToSelectedObjectsMap,
      (/* e */) => {
        // console.log(e)
        // _.map(toJS(e), (item, key: string)=> {
        //   console.log(key, item);
        //   debugger
        // })
        _.forEach(store.mapLayers.initialLayers, (initialLayer: ShapeLayerContainer_Dev) => {
          let leafletClusterLayer = initialLayer.leafletClusterLayer;
          _.map(leafletClusterLayer._featureGroup._layers, layer => {
            if (layer._updateIcon) {
              // Cluster
              layer._updateIcon();
            } else {
              // Single
              if (store.idToSelectedObjectsMap[layer.groupId] || store.idToSelectedObjectsMap[layer.id]) {
                // Selected object
                const shapeStore: ShapeStore = store.groupIdToShapeStoreMap[layer.groupId][layer.id]
                const shapeType: ShapeType = _.get(shapeStore, 'shapeDef.shapeObject.type');
                const manager: ShapeManagerInterface = ShapeManagerRepository.getManagerByType(shapeType);
                manager.updateIsSelectedView(layer);
              }
            }
          })
        })
      }
    )
  }

  componentWillLoad() {
    Utils.log_componentWillLoad(this.compName);
    this.nextBoundsChangeIsProgrammatic = false;
    // Set first base map as working tile
    store.mapLayers.baseMaps = Utils.initStoreWithMapTiles(this.gisViewerProps.tileLayers);
    // Set initial layers
    store.mapLayers.initialLayers = Utils.initiateLayers(this.gisViewerProps.shapeLayers);


    store.gisMap = this.createMap();
  }

  render() {
    return (
      <div>
        <tool-bar
          gisMap={store.gisMap}
          config={store.state.toolbarConfig}
        // mouseCoordinateConfig={store.state.mapPluginsConfig.mouseCoordinateConfig}
        // isZoomControl={store.state.mapConfig.isZoomControl}
        />

        {
          _.get(this, 'gisViewerProps.mapPluginsConfig.scaleConfig.enable', false) ? (
            <scale-plugin
              gisMap={store.gisMap}
              config={store.state.mapPluginsConfig.scaleConfig}
            />
          ) : null
        }

        {
          _.get(this, 'gisViewerProps.mapPluginsConfig.miniMapConfig.enable', false) ? (
            <mini-map-plugin
              gisMap={store.gisMap}
              config={store.state.mapPluginsConfig.miniMapConfig}
            />
          ) : null
        }

        {
          _.get(this, 'gisViewerProps.mapPluginsConfig.mouseCoordinateConfig.enable', false) ? (
            <mouse-coordinate-plugin
              gisMap={store.gisMap}
              config={store.state.mapPluginsConfig.mouseCoordinateConfig}
            />
          ) : null
        }
      </div>
    )
  }
  componentDidLoad() {
    Utils.log_componentDidLoad(this.compName);
    this.createEvents()
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
  private createEvents() {
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

    store.gisMap.on('drag zoomstart', (e: any) => {
      store.gisMap.panInsideBounds(e.target.options.maxBounds, { animate: false });
    });

    // Selecting area
    store.gisMap.on('boxzoomend', this.areaSelection);

    store.gisMap.on('zoomstart', () => {
      // console.log(1)
    })
    store.gisMap.on('movestart', () => {
      // console.log(2)
    })

    // store.gisMap.on('zoomlevelschange', () => {
    //   console.log(3)  // not triggerd
    // })
    store.gisMap.on('load', () => {
    })
    store.gisMap.on('zoom', () => {
      // console.log(4)
    })
    store.gisMap.on('move', () => {
      // console.log(5)
    })

    store.gisMap.on('zoomend', () => {
      // console.log(6)
      // const clusters: any = store.gisMap.getContainer().querySelectorAll('.selected-cluster') || [];
      // _.forEach(clusters, ((cluster) => cluster.classList.remove('selected-cluster')));
    })
    store.gisMap.on('moveend', () => { // O.A
      console.log('moveend')
      // console.log(7)
      const clusters: any = store.gisMap.getContainer().querySelectorAll('.selected-cluster') || [];
      _.forEach(clusters, ((cluster) => cluster.classList.remove('selected-cluster')));
      Utils.selectClustersBySelectedLeafletObjects(store.idToSelectedObjectsMap); // O.A
      Utils.updateViewForSelectedObjects(store.idToSelectedObjectsMap);

      const gisViewerEl: HTMLGisViewerElement = document.querySelector(GIS_VIEWER_TAG);
      gisViewerEl.brodcastEvent('boundsChanged', this.getBounds(this.nextBoundsChangeIsProgrammatic));
      this.nextBoundsChangeIsProgrammatic = false;
    });

    // Leaflet mouse wheel zoom only after click on map
    const wheelZoomOnlyAfterClick: boolean = _.get(store, 'state.mapConfig.isWheelZoomOnlyAfterClick');
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

  private createMap(): L.Map {
    // Map options
    const extendedOptions: any = {}; // this.tileLayersComp.setTileLayers(this.context.mapState.baseMaps, tileProps);

    // Zoom control
    extendedOptions.zoomControl = _.get(store, 'state.mapConfig.isZoomControl', true);

    // MAX Bounds
    const northEast = L.latLng(MAX_NORTH_EAST.lat, MAX_NORTH_EAST.lng);
    const southWest = L.latLng(MAX_SOUTH_WEST.lat, MAX_SOUTH_WEST.lng);
    const bounds = new L.LatLngBounds(southWest, northEast);

    Object.assign(extendedOptions, {
      noWrap: true,
      maxBounds: bounds,
      minZoom: 3, // _.max([extendedOptions.minZoom, 2]),
      maxBoundsViscosity: 1.0,
      //   doubleClickZoom: false,
      bounceAtZoomLimits: false,
      zoom: 1,
      center: {
        lat: 0.076304,
        lng: 0.013960
      },
      // preferCanvas: true,
      // renderer: L.canvas(),
    });
    return new L.Map('map', extendedOptions);  // Create Map
  }
  private areaSelection(event: any): void {
    if (store.state.mapConfig.isSelectionDisable) { return; }

    const changedIds: SelectedObjects = {};
    const shapeDefList: ShapeDefinition[] = [];

    const visibleLayers = Utils.getVisibleLayers(store.mapLayers, store.gisMap);
    visibleLayers.forEach((layer: L.Layer) => {
      const shapeIds: ShapeIds = {
        groupId: layer.groupId,
        shapeId: layer.id
      };
      const latLng: Coordinate | Coordinate[] = layer._latlngs ? layer._latlngs : layer._latlng;
      const isSelected: boolean = store.idToSelectedObjectsMap.hasOwnProperty(shapeIds.shapeId)/* shapeStore.shapeDef.data.isSelected; */
      
      // Object found in bounds
      if (latLng && event.boxZoomBounds.contains(latLng)) {
        if (!isSelected) {
          Utils.createShapeDefList(shapeIds, true, changedIds, shapeDefList);
        }
      }
    });

    if (!_.isEmpty(changedIds)) {
      Utils.updateViewForSelectedObjects(changedIds);
    }
    // Execute onSelectionDone callback
    const gisViewerEl: HTMLGisViewerElement = document.querySelector(GIS_VIEWER_TAG);
    gisViewerEl.brodcastEvent('selectionDone', shapeDefList);
  }
}
