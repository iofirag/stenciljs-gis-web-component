
// import { GisPluginBase, GisPluginContext } from '../../pluginBase';
// import './ScaleControlComp.css';
// import {FeaturesNames} from "../../statics";
// import { Units } from "../../MapContainer/MapContainer";
// import { ScaleControlOptions } from "../../../../../api-generated/wrapper/api-src/index";

// export default class ScaleControlComp extends GisPluginBase {
// 	element: any;

// 	constructor(private context: GisPluginContext) {
// 		super();
// 		// Do bind first
// 		this.toggleUnits = this.toggleUnits.bind(this);
// 		this.createElement = this.createElement.bind(this);

// 		this.init();
// 	}

// 	init() {
// 		const scaleControlEnable: boolean = _.get(this, 'context.props.scaleControl.enable');

// 		if (scaleControlEnable) {
// 			const { scaleControl } = this.context.props;

// 			// Component options
// 			const objCloned: any = Object.assign({}, scaleControl);
// 			objCloned.metric = true;
// 			objCloned.imperial = true;

// 			const optionsDev: ScaleControlOptions_Dev = objCloned;
// 			this.createElement(optionsDev);
// 		}
// 	}

// 	/**
// 	 * name
// 	 */
// 	public fixHiddenStyleClass() {
// 		const scaleControlDOM: HTMLElement = this.element._container as HTMLElement;
// 		const km:              HTMLElement = scaleControlDOM.childNodes[0] as HTMLElement;
// 		const mi:              HTMLElement = scaleControlDOM.childNodes[1] as HTMLElement;

// 		km.classList.add('scale-unit');
// 		mi.classList.add('scale-unit');

// 		if (this.context.mapUnits === Units.METRIC) {
// 			mi.classList.toggle('hidden');
// 		} else {
// 			km.classList.toggle('hidden');
// 		}
// 	}

// 	public toggleUnits(): void {
// 		const scaleControlDOM: HTMLElement = this.element._container as HTMLElement;
// 		const km:              HTMLElement = scaleControlDOM.childNodes[0] as HTMLElement;
// 		const mi:              HTMLElement = scaleControlDOM.childNodes[1] as HTMLElement;

// 		km.classList.toggle('hidden');
// 		mi.classList.toggle('hidden');
// 	}

// 	private createElement(scaleControlOptionsDev: ScaleControlOptions_Dev): void {
// 		this.element = L.control.scale(<any>scaleControlOptionsDev);
		
// 		this.context.onAddControlToFeatures(FeaturesNames.SCALE_CONTROL_COMP, this);
// 	}
// }





/////////////////////
import L from 'leaflet';
// import * as _ from 'lodash';
import {Component, Prop, State } from '@stencil/core';
import { SCALE_CONTROL_PLUGIN_TAG } from '../../../../utils/statics';
import Utils from '../../../../utils/utilities';

@Component({
  tag: "scale-control-plugin",
  styleUrls: ["scale-control-plugin.scss"]
})
export class ScaleControlPlugin {
  compName = SCALE_CONTROL_PLUGIN_TAG;

  @Prop() gisMap: L.Map;
  // @Prop() config: ScaleControlOptions;
  @Prop() metric: boolean;

  @State() scaleKmControl: any;
  @State() scaleMileControl: any;

  componentWillLoad() {
    Utils.log_componentWillLoad(this.compName);
  }
  componentWillUpdate() { }

  render() {
    // Create new component
    if (this.scaleKmControl) {
      
    }
    const options: L.Control.ScaleOptions = {
      metric: this.metric, 
      imperial: !this.metric,
      position: 'bottomright'
    };
    this.scaleControl = L.control.scale(options);
    this.gisMap.addControl(this.scaleControl);
    // Return nothing
    return null;
  }
  componentDidLoad() {
    Utils.log_componentDidLoad(this.compName);
  }
  // // public toggleUnits(): void {
  // // 	const scaleControlDOM: HTMLElement = this.element._container as HTMLElement;
  // // 	const km:              HTMLElement = scaleControlDOM.childNodes[0] as HTMLElement;
  // // 	const mi:              HTMLElement = scaleControlDOM.childNodes[1] as HTMLElement;

  // // 	km.classList.toggle('hidden');
  // // 	mi.classList.toggle('hidden');
  // // }

  // // private createElement(scaleControlOptionsDev: ScaleControlOptions_Dev): void {
  // // 	this.element = L.control.scale(<any>scaleControlOptionsDev);
  // // 	this.context.onAddControlToFeatures(FeaturesNames.SCALE_CONTROL_COMP, this);
  // // }
  componentDidUnload() {
    Utils.log_componentDidUnload(this.compName);
    this.gisMap.removeControl(this.scaleControl);
  }
}