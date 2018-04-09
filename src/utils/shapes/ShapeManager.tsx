// import './ShapeManager.css';	// commented out

// import { ShapeType, ShapeObject, ShapeDefinition, Coordinate, ShapeObjectOptions } from '../../../../api-generated/wrapper/api-src';
// import { GisPluginContext } from '../pluginBase';
// import Utils from '../utils';
import _ from 'lodash';
import { ShapeType, ShapeObject, ShapeDefinition, Coordinate, ShapeObjectOptions } from '../../models';
import Utils from '../utilities';

export interface ShapeManagerInterface {
	getName(): string;
	getType(): ShapeType;

	// wkt to object conversions
	isWktOfType(wkt: string): boolean;
	shapeObjectToWkt(shapeObject: ShapeObject, shapeObjectOptions?: ShapeObjectOptions): string;
	updateIsSelectedView(leafletObject: any): void;
	toggleHighlight(element: any,context: any /*GisPluginContext*/): void;
	shapeWktToObject(shapeWkt: string): ShapeObject;
	toggleSelectShape(context: any /*GisPluginContext*/, leafletObject: any): void;
	selectShape(context: any /*GisPluginContext*/, leafletObject: any): void;

	// data layer
	addShapeToLayer(shapeDef: ShapeDefinition, container: L.LayerGroup, eventHandlers?: ShapeEventHandlers): L.Layer | L.FeatureGroup;

	// draw layer
	getShapeObjectFromDrawingLayer(layer: L.Layer): ShapeObject;

	getHeatLayerPoints(shapeObject: ShapeObject): Coordinate;
	// getCoordinateAsString(shapeObject: ShapeObject): string;
	getCoordinateList(shapeObject: ShapeObject): Coordinate[];
	getMiddleCoordinate(shapeObject: ShapeObject): Coordinate;

	getAreaSize(shapeObject: ShapeObject): number;
	isLayerOfThisShapeType(leafletLayer: L.Layer | L.FeatureGroup): boolean;
}

export type ShapeEventHandlers = {
	click?: (e: any) => void;
	dblClick?: (e: any) => void;
	mouseover?: (e: any) => void;
	mouseout?: (e: any) => void;
};

// info on shape for internal use of Gis conponent
// contains ShapeDefinition, which was received from props from external application

export abstract class ShapeManagerBase implements ShapeManagerInterface {

	abstract getType(): ShapeType;

	// wkt to object conversions
	abstract isWktOfType(wkt: string): boolean;
	abstract shapeObjectToWkt(shapeObject: ShapeObject, shapeObjectOptions?: ShapeObjectOptions): string;
	abstract shapeWktToObject(shapeWkt: string): ShapeObject;

	// data layer
	abstract addShapeToLayer(shapeDef: ShapeDefinition, container: L.LayerGroup, eventHandlers?: any): L.Layer | L.FeatureGroup;
	// abstract getCoordinateAsString(shapeObject: ShapeObject): string;
	abstract getShapeObjectFromDrawingLayer(layer: L.Layer): ShapeObject;
	abstract getAreaSize(shapeObject: ShapeObject): number;
	abstract isLayerOfThisShapeType(leafletLayer: any): boolean;

	getName(): string {
		return ShapeType[this.getType()];
	}

	getHeatLayerPoints(shapeObject: ShapeObject): Coordinate {
		Utils.doNothing(shapeObject)
		return null;
	}

	toggleSelectShape(context: any /*GisPluginContext*/, leafletObject: L.FeatureGroup | L.Layer): void {
		Utils.doNothing(context);
		// Change isSelected state
		leafletObject.shapeDef.data.isSelected = !leafletObject.shapeDef.data.isSelected;
		if(leafletObject.shapeDef.data.isSelectedFade) {
			leafletObject.shapeDef.data.isSelectedFade = false;
		}
		// Handle Selected-leaflet-shpae-list
		// Utils.selectedLeafletObjectHandler(context, leafletObject);
	}
	selectShape(context: any /*GisPluginContext*/, leafletObject: L.FeatureGroup | L.Layer): void {
		Utils.doNothing([context, leafletObject])
		// Change isSelected state
		// leafletObject.shapeDef.data.isSelected = !leafletObject.shapeDef.data.isSelected;
		// Handle Selected-leaflet-shpae-list
		// Utils.selectedLeafletObjectHandler(context, leafletObject);
	}

	updateIsSelectedView(leafletObject: L.Layer): void {
		const isSelected = _.get(leafletObject, 'shapeDef.data.isSelected');
		const leafletObjectParent:any = leafletObject.__parent && leafletObject.__parent._group.getVisibleParent(leafletObject);

		const color = isSelected ? 'orange' : '#38f';
		const styles = {
			color,
			opacity: !!_.get(leafletObject, 'shapeDef.data.isSelectedFade') ? '0.5' : '1'
		};

		if (isSelected && leafletObjectParent) {
			leafletObjectParent._icon.classList.add('selected-cluster');
		} else if (leafletObjectParent) {
			leafletObjectParent._icon.classList.remove('selected-cluster');
		}

		(leafletObject as L.FeatureGroup).setStyle(styles as any);
	}

	toggleHighlight(element: any,context: any /*GisPluginContext*/) {
		Utils.doNothing(context)
		const target = element._icon || element.path; // point or other svg shape

		if(!target || !_.get(element, 'shapeDef.data.groupId')) {return;}

		const isHighLighted = target.classList.contains('highlighted');

		if (isHighLighted) {
			// Utils.removeHighlightPOIs();
		} else {
			// Utils.highlightPOIsByGroupId(context, element.shapeDef.data.groupId);
		}
	}

	getCoordinateList(shapeObject: ShapeObject): Coordinate[] {
		Utils.doNothing(shapeObject)
		return [];
	};

	getMiddleCoordinate(shapeObject: ShapeObject): any {
		Utils.doNothing(shapeObject)
		// TBD get middle coordinate for selecting with shift and mouse - zoomboxend
		return null;
	};
}