import { Component, State, Prop, Listen, Method } from '@stencil/core';
// import * as leaflet from "leaflet";
import { MAP_CONTAINER_TAG } from '../../../utils/statics';
import Utils from '../../../utils/utilities';
import { GisViewerProps } from '../../../models/apiModels';
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

  @State() gisMap: L.Map;
  @State() metric: boolean;
  // @State() toolbarConfig: ToolbarConfig;

  @Listen("distanceUnitsEm")
  changeUnitsHandler(event: CustomEvent) {
    console.log("Received the custom mile event: ", event.detail);
    this.changeUnits();
  }
  @Method()
  changeUnits() {
    this.metric = !this.metric;
  }
  constructor() {}

  componentWillLoad() {
    Utils.log_componentWillLoad(this.compName);
    const mapOptions: L.MapOptions = {
      // fullscreenControl: true,
      zoom: 12,
      center: { lat: 32, lng: 35 }
    };
    this.gisMap = new L.Map("map", mapOptions);
    this.metric = this.gisViewerProps.mapConfig.metric;

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
  render() {
    return (
      <div>
        <tool-bar gisMap={this.gisMap} metric={this.metric} config={this.gisViewerProps.toolbarConfig} />

        {_.get(this, "gisViewerProps.mapPluginsConfig.scaleControlConfig.enable") ? (
          <scale-control-plugin
            gisMap={this.gisMap}
            config={this.gisViewerProps.mapPluginsConfig.scaleControlConfig}
            metric={this.metric}
          />
        ) : (
          ""
        )}
        
        {_.get(this, "gisViewerProps.mapPluginsConfig.miniMapConfig.enable") ? (
          <mini-map-plugin
            gisMap={this.gisMap}
            config={this.gisViewerProps.mapPluginsConfig.miniMapConfig}
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
      .addTo(this.gisMap)
      .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
      .openPopup();


    this.gisMap.on(L.Draw.Event.CREATED; function(e) {
      var type = e.layerType,
        layer = e.layer;
      if (type === 'marker') {
        // Do marker specific actions
      }
      // Do whatever else you need to. (save to db; add to map etc)
      map.addLayer(layer);
    });
  }

  
}