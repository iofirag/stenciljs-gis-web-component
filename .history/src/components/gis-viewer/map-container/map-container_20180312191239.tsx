import { Component, State, Prop, /* Listen ,*/ Method } from '@stencil/core';
// import * as leaflet from "leaflet";
import { MAP_CONTAINER_TAG } from '../../../utils/statics';
import Utils from '../../../utils/utilities';
import { GisViewerProps, CoordinateSystemType } from '../../../models/apiModels';
import _ from 'lodash';
import L from 'leaflet';
// import L from "leaflet-minimap";


@Component({
  tag: "map-container",
  styleUrls: [
    // "../../../../node_modules/leaflet/dist/leaflet.css"
    // "../../../../node_modules/leaflet-fullscreen/dist/leaflet.fullscreen.css",
    // 'map-container.scss',
  ]
})
export class MapContainer {
  compName: string = MAP_CONTAINER_TAG;
  @Prop() gisViewerProps: GisViewerProps;

  @State() gisMapState: L.Map;
  @State() isMetricState: boolean;
  @State() coordinateSystemTypeState: CoordinateSystemType;
  // @State() toolbarConfig: ToolbarConfig;

  // @Listen("distanceUnitsEm")
  // changeUnitsHandler(event: CustomEvent) {
  //   console.log("Received the custom mile event: ", event.detail);
  //   this.changeUnits();
  // }
  @Method()
  changeUnits() {
    this.isMetricState = !this.isMetricState;
  }
  @Method()
  changeCoordinateSystem() {
    const coordinateSystemTypes: CoordinateSystemType[] = ['utm','utmref','gps'];
    let index = coordinateSystemTypes.indexOf(this.coordinateSystemTypeState);
    index++;
    if (index === this.coordinateSystemTypeState.length ) index = 0;
    this.coordinateSystemTypeState = coordinateSystemTypes[index];
  }
  constructor() {}

  componentWillLoad() {
    Utils.log_componentWillLoad(this.compName);
    const mapOptions: L.MapOptions = {
      // fullscreenControl: true,
      zoom: 12,
      center: { lat: 32, lng: 35 }
    };
    this.gisMapState = new L.Map("map", mapOptions);
    this.isMetricState = this.gisViewerProps.mapConfig.isMetric;
    this.coordinateSystemTypeState = this.gisViewerProps.mapConfig.coordinateSystemType;

    // const { layersControllerConfig,
    //   fullScreenConfig,
    //   zoomToExtentConfig,
    //   zoomControlConfig,
    //   searchBoxConfig,
    //   polylineMeasureConfig,
    //   unitsChangerConfig,
    //   drawBarConfig} = this.gisViewerProps.too;
    
    // this.toolbarConfig = this.gisViewerProps.too
  }

  // componentWillUpdate() {
  //   console.log('The component will update');
  //   debugger
  //   this.metric = this.gisViewerProps.mapConfig.metric;
  //   this.coordinateSystem = this.gisViewerProps.mapConfig.coordinateSystem;
  // }

  render() {
    // debugger
    // this.metric = this.gisViewerProps.mapConfig.metric;
    // this.coordinateSystem = this.gisViewerProps.mapConfig.coordinateSystem;

    return (
      <div>
        <tool-bar gisMap={this.gisMapState} isMetric={this.isMetricState} config={this.gisViewerProps.toolbarConfig} />

        {_.get(this, "gisViewerProps.mapPluginsConfig.scaleControlConfig.enable") ? (
          <scale-control-plugin
            gisMap={this.gisMapState}
            config={this.gisViewerProps.mapPluginsConfig.scaleControlConfig}
            isMetric={this.isMetricState}
          />
        ) : (
          ""
        )}
        
        {_.get(this, "gisViewerProps.mapPluginsConfig.miniMapConfig.enable") ? (
          <mini-map-plugin
            gisMap={this.gisMapState}
            config={this.gisViewerProps.mapPluginsConfig.miniMapConfig}
          />
        ) : (
          ""
        )}

        {_.get(this, "gisViewerProps.mapPluginsConfig.mouseCoordinateConfig.enable") ? (
          <mouse-coordinate-plugin
            gisMap={this.gisMapState}
            config={this.gisViewerProps.mapPluginsConfig.mouseCoordinateConfig}
            coordinateSystemType={this.coordinateSystemTypeState}
          />
        ) : (
            ""
          )}
      </div>
    );
  }
  componentDidLoad() {
    Utils.log_componentDidLoad(this.compName);
    const osmUrl = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";
    L.tileLayer(osmUrl, {}).addTo(this.gisMap);

    L.marker([32, 35])
      .addTo(this.gisMapState)
      .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
      .openPopup();
  }
}