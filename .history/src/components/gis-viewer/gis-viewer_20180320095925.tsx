import { Component, Prop, Method, EventEmitter, Event } from '@stencil/core';
import { GIS_VIEWER_TAG } from '../../utils/statics';
import Utils from '../../utils/utilities';
import { GisViewerProps } from '../../models/apiModels';

@Component({
  tag: "gis-viewer",
  styleUrls: [
    "gis-viewer.scss",
    "../../../node_modules/leaflet/dist/leaflet.css"
  ]
})
export class GisViewer {
  compName: string = GIS_VIEWER_TAG;
  mapContainerEl: HTMLMapContainerElement;
  // @Element() gisEl: HTMLElement;
  @Prop() gisViewerProps: GisViewerProps;

  @Event() zoomToExtentDoneEm: EventEmitter;

  @Method()
  zoomToExtent() {
    this.mapContainerEl.zoomToExtent();
    // this.zoomToExtentDoneEm.emit()
  }
  @Method()
  changeDistanceUnits() {
    this.mapContainerEl.changeDistanceUnits();
  }
  @Method()
  changeCoordinateSystem() {
    this.mapContainerEl.changeCoordinateSystem();
  }

  render() {
    return <map-container id="map" gisViewerProps={this.gisViewerProps} />;
  }

  componentDidLoad() {
    Utils.log_componentDidLoad(this.compName);
    this.mapContainerEl = document.querySelector("map-container");

    // const osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
    // L.tileLayer(osmUrl, {}).addTo(mapContainerEl.gisMap);

    // L.marker([32, 35]).addTo(mapContainerEl.gisMap)
    //   .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    //   .openPopup();
  }
}
