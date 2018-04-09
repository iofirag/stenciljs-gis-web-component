import { Component, State, Prop, Element, Method } from '@stencil/core';
import { MAP_CONTAINER_TAG, ZOOM_TO_EXTENT_PLUGIN_TAG, MAX_NORTH_EAST, 
  MAX_SOUTH_WEST } from '../../../utils/statics';
import Utils from '../../../utils/utilities';
import { GisViewerProps, CoordinateSystemType, DistanceUnitType } from '../../../models';
import _ from 'lodash';
import L from 'leaflet';
import store from '../../store/store';

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
  @State() gisMap: L.Map;
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

  constructor() {
  }
  
  componentWillLoad() {
    Utils.log_componentWillLoad(this.compName);
    // Set first base map as working tile
    store.mapLayers.baseMaps = Utils.initStoreWithMapTiles(this.gisViewerProps.tileLayers);
    // Set initial layers
    store.mapLayers.initialLayers = Utils.initiateLayers(this.gisViewerProps.shapeLayers);
    this.gisMap = this.createMap();
  }

  render() {
    return (
      <div>
        <tool-bar
          gisMap={this.gisMap}
          config={store.state.toolbarConfig}
        // mouseCoordinateConfig={store.state.mapPluginsConfig.mouseCoordinateConfig}
        // isZoomControl={store.state.mapConfig.isZoomControl}
        />

        {_.get(this, "gisViewerProps.mapPluginsConfig.scaleConfig.enable") ? (
            <scale-plugin
              gisMap={this.gisMap}
              config={store.state.mapPluginsConfig.scaleConfig}
            />
          ) : ('')
        }

        {_.get(this, "gisViewerProps.mapPluginsConfig.miniMapConfig.enable") ? (
            <mini-map-plugin
              gisMap={this.gisMap}
              config={store.state.mapPluginsConfig.miniMapConfig}
            />
          ) : ('')
        }

        {_.get(this, "gisViewerProps.mapPluginsConfig.mouseCoordinateConfig.enable") ? (
            <mouse-coordinate-plugin
              gisMap={this.gisMap}
              config={store.state.mapPluginsConfig.mouseCoordinateConfig}
            />
          ) : ('')
        }  
      </div>
    )
  }
  componentDidLoad() {
    Utils.log_componentDidLoad(this.compName);
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
      minZoom: 2, // _.max([extendedOptions.minZoom, 2]),
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
}