// import './ShapeManager.css';	// commented out

// import { ShapeType, ShapeObject, ShapeDefinition, Coordinate, ShapeObjectOptions } from '../../../../api-generated/wrapper/api-src';
// import { GisPluginContext } from '../pluginBase';
// import Utils from '../utils';
import _ from 'lodash';
import { ShapeType, ShapeObject, ShapeDefinition, Coordinate, ShapeObjectOptions, 
	ShapeStore } from '../../models';
import Utils from '../utilities';
import store from '../../components/store/store';
// import { GENERATED_ID } from '../statics';
// import { GENERATED_ID } from '../statics';
// import { ShapeManagerRepository } from './ShapeManagerRepository';
// import { ShapeManagerRepository } from './ShapeManagerRepository';

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
		// const groupId: string = leafletObject.groupId;
		
		// if (groupId === GENERATED_ID.DEFAULT_GROUP 
		// 	|| groupId === GENERATED_ID.DRAW_LAYER_GROUP_ID) {
			// Signle item
			// const shapeIds: ShapeIds = {
			// 	groupId: leafletObject.groupId,
			// 	shapeId: leafletObject.id
			// }
			// store.toggleSelectionMode(shapeIds);
			console.log(leafletObject);
		// } 
		// else {
		// 	// Item with group
		// 	const groupIdData: GroupData = store.groupIdToShapeStoreMap[groupId];
		// 	if (groupIdData) {
		// 		_.forEach(groupIdData, (shapeStore: ShapeStore) => {
		// 			const shapeIds: ShapeIds = {
		// 				groupId: shapeStore.leafletRef.groupId,
		// 				shapeId: shapeStore.leafletRef.id
		// 			}
		// 			// Change isSelected state
		// 			store.toggleSelectionMode(shapeIds);
		// 			debugger
		// 			// const manager = ShapeManagerRepository.getManagerByType(_.get(shapeStore, 'shapeDef.shapeObject.type'));
		// 			// if (manager) {
		// 			// 	manager.updateIsSelectedView(shapeStore.leafletRef);
		// 			// }


		// 			/* if (shapeStore.shapeDef.data.isSelectedFade) { // O.A
		// 				shapeStore.shapeDef.data.isSelectedFade = false;
		// 			} */
		// 			// Handle Selected-leaflet-shpae-list
		// 			// Utils.selectedLeafletObjectHandler(context, leafletObject); // O.A
		// 		})
		// 	}
		// }
	}
	selectShape(leafletObject: L.FeatureGroup | L.Layer): void {
		Utils.doNothing([leafletObject])
		// Change isSelected state
		// leafletObject.shapeDef.data.isSelected = !leafletObject.shapeDef.data.isSelected;
		// Handle Selected-leaflet-shpae-list
		// Utils.selectedLeafletObjectHandler(context, leafletObject);
	}

	updateIsSelectedView(leafletObject: L.Layer): void {
		const shapeStore: ShapeStore = store.groupIdToShapeStoreMap[leafletObject.groupId][leafletObject.id];
		let isSelected = false;
		if (store.idToSelectedObjectsMap.hasOwnProperty(leafletObject.groupId) 
			|| store.idToSelectedObjectsMap.hasOwnProperty(leafletObject.id)) {
			isSelected = true;
		}
		
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
		// Utils.removeHighlightPOIs();
		// let target = element._icon || element.path; // point or other svg shape

		

		// element.__parent._group.refreshClusters(element)
		// 
		let isHighLighted: boolean = false;
		if (_.get(element, '_icon.classList.contains("highlighted")', false)
			|| _.get(element, 'path.classList.contains("highlighted")', false)
			|| _.get(element, '__parent._icon.classList.contains("highlighted")', false)
		) {
			isHighLighted = true;
		}
		// const isHighLighted = ;

		if (!isHighLighted) {
			// Utils.highlightPOIsByGroupId(element.groupId);
			Utils.highlightPOIsByElement(element)

			// target = element.__parent._icon
			// element.__parent._icon.classList.add('highlighted');
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