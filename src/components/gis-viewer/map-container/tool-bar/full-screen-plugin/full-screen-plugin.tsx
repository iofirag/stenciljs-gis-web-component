import { FULL_SCREEN_PLUGIN_TAG } from "../../../../../utils/statics";
import Utils from "../../../../../utils/utilities";
import { Component, Prop, Method, State } from "@stencil/core";
import L from "leaflet";
import * as fullscreen from "leaflet-fullscreen";
import { FullScreenConfig } from "../../../../../models";
import _ from "lodash";

@Component({
  tag: "full-screen-plugin",
  styleUrls: [
    "../../../../../../node_modules/leaflet-fullscreen/dist/leaflet.fullscreen.css",
    "full-screen-plugin.scss"
  ]
})
export class FullScreenPlugin {
  compName: string = FULL_SCREEN_PLUGIN_TAG;
  @Prop() config: FullScreenConfig;
  @Prop() gisMap: L.Map;
  
  @State() control: L.Control;
  // @Event() distanceUnitsEm: EventEmitter;

  componentWillLoad() {
    Utils.log_componentWillLoad(this.compName);
    this.control = this.createPlugin();
  }

  componentDidLoad() {
    Utils.log_componentDidLoad(this.compName);
    this.gisMap.addControl(this.control);
  }

  componentDidUnload() {
    Utils.log_componentDidUnload(this.compName);
    this.gisMap.removeControl(this.control);
  }

  @Method() 
  getControl() {
    return this.control;
  }
  private createPlugin(): any {
    try {
      const customControl = L.Control.extend({
        // options: options,
        onAdd: () => {
          const container = L.DomUtil.create(
            "div",
            "leaflet-bar leaflet-control leaflet-control-custom leaflet-control-fullscreen"
          );
          let a = document.createElement("a");
          container.appendChild(a);
          container.setAttribute("title", "Full-Screen");

          container.addEventListener(
            "click",
            this.buttonClickHandler.bind(this)
          );

          return container;
        }
      });
      return new customControl();
    } catch (e) {
      console.error("failed to create custom control: " + e);
      return null;
    }
  }
  buttonClickHandler() {
    console.log(`${this.compName} click`);
    _.noop(fullscreen);
    this.gisMap.toggleFullscreen();
    // this.distanceUnitsEm.emit('mile');
    // this.distanceUnitsEm.emit('km');
  }
}
