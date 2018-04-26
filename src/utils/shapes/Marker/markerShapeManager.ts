import { MarkerShape, ShapeObject, ShapeType, MarkerShapeOptions, 
	ShapeDefinition, Coordinate, ShapeStore } from '../../../models';
import { ShapeManagerBase, ShapeEventHandlers } from '../ShapeManager';
import _ from 'lodash';
import L from 'leaflet';
import { interceptSvg } from './intercept';
import { markerSvg } from './maker';
import store from '../../../components/store/store';

export class MarkerShapeManager extends ShapeManagerBase {

	getHeatLayerPoints(shapeObject: ShapeObject): Coordinate {
		const marker = shapeObject.shape as MarkerShape;
		return marker.coordinate;
	}

	getType(): ShapeType {
		return ShapeType.MARKER;
	}

	shapeObjectToWkt(shapeObject: ShapeObject): string {
		const marker = <MarkerShape>shapeObject.shape;
		return `POINT(${marker.coordinate.lng} ${marker.coordinate.lat})`;
	}

	shapeWktToObject(shapeWkt: string): ShapeObject {
		const lnglatArr: string[] = shapeWkt.replace(/[^0-9\.\ \-]/g, '').split(' ');

		if (lnglatArr.length === 2) {
			const lnglat: Coordinate = {
				lng: Number(lnglatArr[0]),
				lat: Number(lnglatArr[1])
			};

			// Create label object
			const markerObj: ShapeObject = {
				shape: <MarkerShape>{ coordinate: lnglat },
				type: ShapeType.MARKER
			};

			return markerObj;
		} else {
			throw 'missing latitude or longitude';
		}
	}

	highlightElement(marker: L.Marker) {
		let isHighLighted: boolean = false;
		if (_.get(marker, '_icon.classList.contains("highlighted")', false)
			|| _.get(marker, 'path.classList.contains("highlighted")', false)
			|| _.get(marker, '__parent._icon.classList.contains("highlighted")', false)
		) {
			isHighLighted = true;
		}
		// const isHighLighted = ;

		if (!isHighLighted) {
			// Utils.highlightPOIsByGroupId(element.groupId);
			// Utils.highlightPOIsByElement(element)

			// target = element.__parent._icon
			// element.__parent._icon.classList.add('highlighted');

			const shapeStore: ShapeStore = store.groupIdToShapeStoreMap[marker.groupId][marker.id];

			// const manager = ShapeManagerRepository.getManagerByType(_.get(shapeStore, 'shapeDef.shapeObject.type'));
			const isIntercept: boolean = marker._icon && _.get(shapeStore, 'shapeDef.data.type') === 'intercept';
			// const shouldBeHighLighted: boolean = groupId === _.get(shapeStore, 'shapeDef.data.groupId');
			const highlightMarkerCluster = /* (shapeStore.shapeDef.data.groupId === groupId) &&  */_.get(shapeStore, 'leafletRef.__parent._group');
			if (!!highlightMarkerCluster) {
				const cluster = highlightMarkerCluster.getVisibleParent(shapeStore.leafletRef);
				if (_.get(cluster, '_icon')) {
					cluster._icon.classList.add('highlighted');
				}
			}

			if (isIntercept && marker._icon) {
				// add highilight
				marker._icon.classList.add('highlighted');
			} 
			// else if (isIntercept && marker._icon) {
			// 	// remove highilight from preveus highlighted intercepts
			// 	marker._icon.classList.remove('highlighted');
			// }
		}
	}
	isWktOfType(wkt: string): boolean {
		return (wkt.indexOf('POINT(') > -1);
	}

	createShape(shapeDef: ShapeDefinition, eventHandlers: ShapeEventHandlers): L.Layer {
		_.noop(eventHandlers);
		if (shapeDef.shapeObject) {
			// Create Marker from shape values
			const markerShape:        MarkerShape        = <MarkerShape>shapeDef.shapeObject.shape;
			const markerShapeOptions: MarkerShapeOptions = <MarkerShapeOptions>shapeDef.options || {};
			const { lat, lng } = markerShape.coordinate;
			const isInercept = (_.get(shapeDef, 'data.type') === 'intercept');

			const interceptIcon = L.divIcon({
				html: isInercept ? interceptSvg : markerSvg,
				className: isInercept ? 'intecept-svg' : 'marker-svg',
				iconSize: isInercept ? new L.Point(30, 30) : new L.Point(20, 27)
			});

			_.assign(markerShapeOptions, { icon: interceptIcon});

			const leafletObject: L.Layer = new L.Marker([lat, lng], markerShapeOptions);

			
			/* leafletObject.shapeDef = _.merge(shapeDef, {// O.A
				data: {
					isSelected: _.get(shapeDef, 'data.isSelected', false),
					count: _.get(shapeDef, 'data.count', 1),
				}
			}); */
			// container.addLayer(leafletObject);	// Add to layerGroup
			return leafletObject;
		} else {
			console.error('shapeDef.shapeObject.shape is missing for creating the marker');
			return null;
		}
		// tbd , use _.defaults for default options
	}

	updateIsSelectedView(leafletObject: L.Marker): void {
		const shapeStore: ShapeStore = store.groupIdToShapeStoreMap[leafletObject.groupId][leafletObject.id];

		const leafletMarker = shapeStore.leafletRef as L.Marker;
		// const isSelected = _.get(shapeStore, 'shapeDef.data.isSelected');
		// const leafletObjectParent: any = leafletMarker.__parent && leafletMarker.__parent._group.getVisibleParent(leafletMarker);

		// if (isSelected && leafletObjectParent) {
		// 	leafletObjectParent._icon.classList.add('selected-cluster');
		// } else if (leafletObjectParent) {
		// 	leafletObjectParent._icon.classList.remove('selected-cluster');
		// }

		if (!leafletMarker._icon) { return; } // Object that hide under cluster

		// add or remove 'selected' css class
		const shapeData = _.get(shapeStore, 'shapeDef.data');
		const unselected = '#505050';
		const strokeSelected = 'rgba(0, 166, 218, 1)';
		const backGroundSelected = '#ffffcc';

		// set lcation styling must be inline styling,
		if (store.idToSelectedObjectsMap[shapeStore.leafletRef.groupId]
			|| store.idToSelectedObjectsMap[shapeStore.leafletRef.id]) {
			// Importent - this layer is selected even thow shapeDef.data.isSelected is false 
			const interceptStroke = !shapeData.isSelectedFade ? strokeSelected : unselected;

			if (shapeData.type === 'intercept') {
				const circle = leafletMarker._icon.querySelector('#circle');

				if (!circle) { return; }

				const sign = leafletMarker._icon.querySelector('#v-sign');

				circle.style.strokeWidth = '2px';
				circle.style.fill = backGroundSelected;
				circle.style.stroke = interceptStroke;
				sign.style.stroke = interceptStroke;
			} else {
				const marker = leafletMarker._icon.querySelector('path');

				if (!marker) { return; }

				marker.style.fill = backGroundSelected;
				marker.style.stroke = interceptStroke;
			}

		} else {
			if (shapeData.type === 'intercept') {
				const circle = leafletMarker._icon.querySelector('#circle');

				if (!circle) { return; }

				const sign = leafletMarker._icon.querySelector('#v-sign');

				circle.style.fill = unselected;
				circle.style.stroke = 'white';
				circle.style.strokeWidth = "1px";
				sign.style.stroke = unselected;
			} else {
				const marker = leafletMarker._icon.querySelector('path');

				if (!marker) { return; }

				marker.style.fill = unselected;
				marker.style.stroke = 'initial';
			}
		}
	}

	getShapeObjectFromDrawingLayer(layer: L.Marker): ShapeObject {
		const marker: MarkerShape = {
			coordinate: layer.getLatLng()
		};

		// Create label object
		const markerObj: ShapeObject = {
			shape: marker,
			type: ShapeType.MARKER
		};

		return markerObj;
	}

	getCoordinateList(shapeObject: ShapeObject): Coordinate[] {
		const marker = <MarkerShape>shapeObject.shape;
		return [marker.coordinate];
	}

	public getAreaSize(shapeObject: ShapeObject): number {
		_.noop(shapeObject)
		return 0;
	}

	public isLayerOfThisShapeType(leafletLayer: L.Marker): boolean {
		let success: boolean = false;

		const tagName: string = _.get(leafletLayer, 'feature.geometry.type');
		if (tagName && tagName.toLowerCase()==='point') {
			// Way A
			success = true;
		} else {
			// Way B
			// Marker | Label
			const markerClassNames: string = _.get(leafletLayer, '_icon.className');
			if (markerClassNames) {
				success = (markerClassNames.indexOf('textLabelClass') === -1);
			}
		}

		return success;
	}
}


// const ClusterableMarker = LPlus.Marker.extend({
// 	getLatLng: function () {
// 		return this._latlng;
// 	},
// 	getBounds: function () {
// 		return this.getLatLng();
// 	},
// 	setLatLng: function () { }
// });