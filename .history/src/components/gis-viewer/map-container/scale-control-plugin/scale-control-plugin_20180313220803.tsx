import L from 'leaflet';
import {Component, Prop, State, Watch } from '@stencil/core';
import { SCALE_CONTROL_PLUGIN_TAG } from '../../../../utils/statics';
import Utils from '../../../../utils/utilities';
import { ScaleControlConfig, DistanceUnitType } from '../../../../models/apiModels';
import _ from 'lodash';

@Component({
  tag: "scale-control-plugin",
  styleUrls: ["scale-control-plugin.scss"]
})
export class ScaleControlPlugin {
  compName = SCALE_CONTROL_PLUGIN_TAG;
  // units: string[] = ['km', 'mi'];

  @Prop() gisMap: L.Map;
  @Prop() config: ScaleControlConfig;
  @Prop() distanceUnitType: DistanceUnitType;

  @State() elementControl: any;

  @Watch('distanceUnitType')
  watchDistanceUnitType(newValue: DistanceUnitType) {
    // Visibility
    this.showScaleUnitsElementByType(newValue);
  }

  private showScaleUnitsElementByType(distanceUnitType: DistanceUnitType) { 
    this.setScaleUnitsElementVisibility('mi', 'mile' === distanceUnitType); // Hide mile
    this.setScaleUnitsElementVisibility('km', 'km' === distanceUnitType);  // Show km
  }
  private setScaleUnitsElementVisibility(unit: string, visibility: boolean) {
    let scaleUnitElement: HTMLElement = this.gisMap.getContainer().querySelector(`.leaflet-control-scale-line.${unit}`);
    if (visibility) {
      scaleUnitElement.classList.remove('hidden')
    } else {
      scaleUnitElement.classList.add('hidden');
    }
  }
  private fromGlobalUnitToElementUnit(globalUnit: DistanceUnitType): string {
    // 'metres', 'landmiles', 'nauticalmiles'
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
  }
  componentWillUpdate() { }

  componentDidLoad() {
    Utils.log_componentDidLoad(this.compName);
    // Create new component
    const options: L.Control.ScaleOptions = {
      position: this.config.scaleControlOptions.position,
      metric: true,
      imperial: true,
    };
    this.elementControl = L.control.scale(options);
    this.gisMap.addControl(this.elementControl);
    
    // Initialization
    // let scaleElementList = this.gisMap.getContainer().querySelectorAll('.leaflet-control-scale-line');
    // _.forEach(scaleElementList, element => {
    //   const elmInnerHtml = element.innerHTML.toLowerCase();
    //   debugger
    //   let elementTextUnitShouldBe: string = this.fromGlobalUnitToElementUnit(this.distanceUnitType);
    //   if (elmInnerHtml.indexOf(elementTextUnitShouldBe) > -1) {
    //     element.classList.add(elementTextUnitShouldBe);
    //   }

    //   // this.units.forEach(unit => {
    //   //   if (elmInnerHtml.indexOf(unit) > -1) {
    //   //     element.classList.add(unit);
    //   //   }
    //   // })
    // });

    this.showScaleUnitsElementByType(this.distanceUnitType);
  }

  componentDidUnload() {
    Utils.log_componentDidUnload(this.compName);
    this.gisMap.removeControl(this.elementControl);
  }
}