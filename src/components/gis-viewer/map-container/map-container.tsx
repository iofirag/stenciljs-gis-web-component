import { Component, Prop, Element, Method } from '@stencil/core';
import { MAP_CONTAINER_TAG, ZOOM_TO_EXTENT_PLUGIN_TAG, MAX_NORTH_EAST,
  MAX_SOUTH_WEST,
  GENERATED_ID} from '../../../utils/statics';
import Utils from '../../../utils/utilities';
import { GisViewerProps, CoordinateSystemType, DistanceUnitType, ShapeDefinition, Coordinate, ShapeIds, ShapeStore, ShapeLayerContainer_Dev, MapBounds, SelectedObjects, GroupIdToShapeStoreMap, SelectedObjectsValue, GroupData } from '../../../models';
import _ from 'lodash';
import L from 'leaflet';
import store from '../../store/store';
import { ShapeManagerRepository } from '../../../utils/shapes/ShapeManagerRepository';
import { reaction, toJS } from 'mobx';
// import { reaction } from 'mobx';

@Component({
  tag: "map-container",
  styleUrls: [
    // "../../../../node_modules/leaflet/dist/leaflet.css"
    'map-container.scss',
    '../../../utils/shapes/ShapeManager.scss'
  ]
})
export class MapContainer {
  compName: string = MAP_CONTAINER_TAG;
  @Prop() gisViewerProps: GisViewerProps;

  @Element() el: HTMLElement;
  // @State() gisMap: L.Map;
  // styleLayerManagerControl: L.Control.StyledLayerControl;
  // layerManagerEl: HTMLLayerManagerPluginElement;

  @Method()
  zoomToExtent() {
    const zoomToExtentEl: HTMLZoomToExtentPluginElement = this.el.querySelector(ZOOM_TO_EXTENT_PLUGIN_TAG);
    zoomToExtentEl.zoomToExtent();
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
  getBounds(): MapBounds {
    const bounds: L.LatLngBounds = store.gisMap.getBounds();

    const boundsState = {
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
        }
    };

    return boundsState;
  }

  @Method()
  getSelectedShapes(): ShapeDefinition[] {
    const groupIdToShapeStoreMap: GroupIdToShapeStoreMap = store.groupIdToShapeStoreMap;
    const selectedLeafletObjects: SelectedObjects = store.idToSelectedObjectsMap;

    if (_.isEmpty(toJS(selectedLeafletObjects))) { return; }

    const selectedShapes:ShapeDefinition[] = [];
    // running on selectedLeafletObjects to pull out all selected shapeDef from groupIdToShapeStoreMap
    _.forIn(selectedLeafletObjects, (value: SelectedObjectsValue, key: string) => {
      if (value.selectionType === 'group') {
        const group: GroupData = groupIdToShapeStoreMap[value.groupId];

        _.forIn(group, (value: ShapeStore) => {
          value.shapeDef.data.isSelected = true;
          selectedShapes.push(toJS(value.shapeDef));
        });
      } else if (value.selectionType === 'single') {
        const defaultGroup: GroupData = groupIdToShapeStoreMap[GENERATED_ID.DEFAULT_GROUP];
        const drawGroup:    GroupData = groupIdToShapeStoreMap[GENERATED_ID.DRAW_LAYER_GROUP_ID];
        const valueInGroup: GroupData = defaultGroup || drawGroup;

        if (valueInGroup) {
          valueInGroup[key].shapeDef.data.isSelected = true;
          selectedShapes.push(toJS(valueInGroup[key].shapeDef));
        }
      }
    });

    // console.log('groupIdToShapeStoreMap', groupIdToShapeStoreMap);
    // console.log('selectedLeafletObjects', selectedLeafletObjects);
    // console.log('selectedShapes', selectedShapes);

    return selectedShapes;
  }

  constructor() {
    reaction(() => store.idToSelectedObjectsMap,
      (e) => {
        console.log(e)
        _.forEach(store.mapLayers.initialLayers, (initialLayer: ShapeLayerContainer_Dev) => {
          let leafletClusterLayer = initialLayer.leafletClusterLayer;
          for (let cluster in leafletClusterLayer._featureGroup._layers) {
            leafletClusterLayer._featureGroup._layers[cluster]._updateIcon && leafletClusterLayer._featureGroup._layers[cluster]._updateIcon();
          }
        })
      }
    )

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
    return (
      <div>
        <tool-bar
          gisMap={store.gisMap}
          config={store.state.toolbarConfig}
        // mouseCoordinateConfig={store.state.mapPluginsConfig.mouseCoordinateConfig}
        // isZoomControl={store.state.mapConfig.isZoomControl}
        />

        {_.get(this, "gisViewerProps.mapPluginsConfig.scaleConfig.enable") ? (
            <scale-plugin
              gisMap={store.gisMap}
              config={store.state.mapPluginsConfig.scaleConfig}
            />
          ) : ('')
        }

        {_.get(this, "gisViewerProps.mapPluginsConfig.miniMapConfig.enable") ? (
            <mini-map-plugin
              gisMap={store.gisMap}
              config={store.state.mapPluginsConfig.miniMapConfig}
            />
          ) : ('')
        }

        {_.get(this, "gisViewerProps.mapPluginsConfig.mouseCoordinateConfig.enable") ? (
            <mouse-coordinate-plugin
              gisMap={store.gisMap}
              config={store.state.mapPluginsConfig.mouseCoordinateConfig}
            />
          ) : ('')
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

    store.gisMap.on('drag zoomstart', (e: any) => {
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
    })
    store.gisMap.on('movestart', () => {
      // console.log(2)
      // Utils.clustersReselection();
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
    })
    store.gisMap.on('moveend', () => { // O.A
      console.log('moveend')
      // console.log(7)
      Utils.selectClustersBySelectedLeafletObjects(store.idToSelectedObjectsMap); // O.A
      Utils.updateViewForSelectedObjects();
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

    const shapeDefSelectedList: ShapeDefinition[] = [];
    const visibleLayers = Utils.getVisibleLayers(store.mapLayers, store.gisMap);

    visibleLayers.forEach((layer: L.Layer) => {
      const layerIds: ShapeIds = {
        groupId: layer.groupId,
        shapeId: layer.id
      };
      const shapeStore: ShapeStore = store.groupIdToShapeStoreMap[layerIds.groupId][layerIds.shapeId];

      const manager = ShapeManagerRepository.getManagerByType(_.get(shapeStore, 'shapeDef.shapeObject.type'));
      if (manager) {
        const latLng: Coordinate | Coordinate[] = layer._latlngs ? layer._latlngs : layer._latlng;
        const isSelected: boolean = store.idToSelectedObjectsMap.hasOwnProperty(layerIds.shapeId)/* shapeStore.shapeDef.data.isSelected; */

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
}
