// import './ShapeManager.css';	// commented out

// import { ShapeType, ShapeObject, ShapeDefinition, Coordinate, ShapeObjectOptions } from '../../../../api-generated/wrapper/api-src';
// import { GisPluginContext } from '../pluginBase';
// import Utils from '../utils';
import _ from 'lodash';
import { ShapeType, ShapeObject, ShapeDefinition, Coordinate, ShapeObjectOptions, GroupData, ShapeStore, ShapeIds } from '../../models';
import Utils from '../utilities';
import store from '../../components/store/store';
import { ShapeManagerRepository } from './ShapeManagerRepository';

export interface ShapeManagerInterface {
	getName(): string;
	getType(): ShapeType;

	// wkt to object conversions
	isWktOfType(wkt: string): boolean;
	shapeObjectToWkt(shapeObject: ShapeObject, shapeObjectOptions?: ShapeObjectOptions): string;
	updateIsSelectedView(leafletObject: any): void;
	toggleHighlight(element: any): void;
	shapeWktToObject(shapeWkt: string): ShapeObject;
	toggleSelectShape(leafletObject: any): void;
	selectShape(leafletObject: any): void;

	// data layer
	createShape(shapeDef: ShapeDefinition, eventHandlers?: ShapeEventHandlers): L.Layer | L.FeatureGroup;

	// draw layer
	getShapeObjectFromDrawingLayer(layer: L.Layer): ShapeObject;

	getHeatLayerPoints(shapeObject: ShapeObject): Coordinate;
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
	abstract createShape(shapeDef: ShapeDefinition, eventHandlers?: any): L.Layer | L.FeatureGroup;

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

	toggleSelectShape(leafletObject: L.FeatureGroup | L.Layer): void {
		const groupId: string = leafletObject.groupId;
		const groupIdData: GroupData = store.groupIdToShapeIdMap[groupId];
		if (groupIdData) {
			_.forEach(groupIdData, (shapeStore: ShapeStore) => {
				const shapeIds: ShapeIds = {
					groupId: shapeStore.leafletRef.groupId,
					shapeId: shapeStore.leafletRef.id
				}
				// Change isSelected state
				store.toggleSelectionMode(shapeIds)
				const manager = ShapeManagerRepository.getManagerByType(_.get(shapeStore, 'shapeDef.shapeObject.type'));
				if (manager) {
					manager.updateIsSelectedView(shapeStore.leafletRef);
				}


				/* if (shapeStore.shapeDef.data.isSelectedFade) { // O.A
					shapeStore.shapeDef.data.isSelectedFade = false;
				} */
				// Handle Selected-leaflet-shpae-list
				// Utils.selectedLeafletObjectHandler(context, leafletObject); // O.A
			})
		}
	}
	selectShape(leafletObject: L.FeatureGroup | L.Layer): void {
		Utils.doNothing([leafletObject])
		// Change isSelected state
		// leafletObject.shapeDef.data.isSelected = !leafletObject.shapeDef.data.isSelected;
		// Handle Selected-leaflet-shpae-list
		// Utils.selectedLeafletObjectHandler(context, leafletObject);
	}

	updateIsSelectedView(leafletObject: L.Layer): void {
		const shapeStore: ShapeStore = store.groupIdToShapeIdMap[leafletObject.groupId][leafletObject.id];
		const isSelected = _.get(shapeStore, 'shapeDef.data.isSelected');
		// const leafletObjectParent:any = leafletObject.__parent && leafletObject.__parent._group.getVisibleParent(leafletObject);

		const color = isSelected ? 'orange' : '#38f';
		const styles = {
			color,
			opacity: !!_.get(shapeStore, 'shapeDef.data.isSelectedFade') ? '0.5' : '1'
		};

		// if (isSelected && leafletObjectParent) {
		// 	leafletObjectParent._icon.classList.add('selected-cluster');
		// } else if (leafletObjectParent) {
		// 	leafletObjectParent._icon.classList.remove('selected-cluster');
		// }

		(leafletObject as L.FeatureGroup).setStyle(styles as any);
	}

	toggleHighlight(element: any) {
		Utils.removeHighlightPOIs();
		const target = element._icon || element.path; // point or other svg shape

		if(!target || !_.get(element, 'groupId')) {return;}

		const isHighLighted = target.classList.contains('highlighted');

		if (isHighLighted) {
			// Utils.removeHighlightPOIs();
		} else {
			Utils.highlightPOIsByGroupId(element.groupId);
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