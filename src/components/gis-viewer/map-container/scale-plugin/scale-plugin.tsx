import L from 'leaflet';
import {Component, Prop, State, Method } from '@stencil/core';
import { SCALE_PLUGIN_TAG } from '../../../../utils/statics';
import Utils from '../../../../utils/utilities';
import { ScaleConfig, DistanceUnitType } from '../../../../models';
import _ from 'lodash';
import { reaction } from 'mobx';
import store from '../../../store/store';
import { Control } from 'leaflet';

@Component({
  tag: "scale-plugin",
  styleUrls: ["scale-plugin.scss"]
})
export class ScalePlugin {
  compName = SCALE_PLUGIN_TAG;
  pluginSupportedUnits: string[] = ['km', 'mi'];

  @Prop() gisMap: L.Map;
  @Prop() config: ScaleConfig;

  @State() control: L.Control.Scale;

  @Method()
  getControl(): Control {
    return this.control;
  }

  constructor() {
    reaction(
      () => store.state.mapConfig.distanceUnitType,
      distanceUnitType => this.showScaleUnitsElementByType(distanceUnitType)
    );
  }
  private showScaleUnitsElementByType(globalDistanceUnitType: DistanceUnitType) { 
    this.pluginSupportedUnits.forEach((unit:string) => {
      this.setScaleUnitsElementVisibility(unit, globalDistanceUnitType);
    })
  }
  private setScaleUnitsElementVisibility(unit: string, globalDistanceUnitType) {
    let scaleUnitElement: HTMLElement = this.gisMap.getContainer().querySelector(`.leaflet-control-scale-line.${unit}`);
    let visibilityForThisUnit: boolean = unit === this.fromGlobalUnitToElementUnit(globalDistanceUnitType);
    if (visibilityForThisUnit) {
      scaleUnitElement.classList.remove('hidden')
    } else {
      scaleUnitElement.classList.add('hidden');
    }
  }
  private fromGlobalUnitToElementUnit(globalUnit: DistanceUnitType): string {
    switch (globalUnit.toLowerCase()) {
      case 'km':
        return 'km';
      case 'mile':
        return 'mi';
      case 'nauticalmiles':
        return ''
    }
  }
  componentWillLoad() {
    Utils.log_componentWillLoad(this.compName);
    // Create new component
    const options: L.Control.ScaleOptions = {
      position: this.config.scaleOptions.position,
      metric: true,
      imperial: true,
    };
    this.control = L.control.scale(options);
  }
  componentWillUpdate() { }

  componentDidLoad() {
    Utils.log_componentDidLoad(this.compName);
    this.gisMap.addControl(this.control);
    this.initUnitElementsWithClasses();
    this.showScaleUnitsElementByType(store.state.mapConfig.distanceUnitType);
  }

  private initUnitElementsWithClasses() {
    // Initialization for element's class
    let scaleElementList = this.gisMap.getContainer().querySelectorAll('.leaflet-control-scale-line');
    _.forEach(scaleElementList, element => {
      const elmInnerHtml = element.innerHTML.toLowerCase();
      this.pluginSupportedUnits.forEach(unit => {
        if (elmInnerHtml.indexOf(unit) > -1) {
          element.classList.add(unit);
        }
      })
    });
  }
  componentDidUnload() {
    Utils.log_componentDidUnload(this.compName);
    this.gisMap.removeControl(this.control);
  }
}