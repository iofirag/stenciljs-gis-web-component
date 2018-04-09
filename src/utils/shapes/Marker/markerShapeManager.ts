import { MarkerShape, ShapeObject, ShapeType, MarkerShapeOptions, ShapeDefinition, Coordinate } from '../../../models';
import { ShapeManagerBase } from '../ShapeManager';
import _ from 'lodash';
import L from 'leaflet';
import { interceptSvg } from './intercept';
import { markerSvg } from './maker';
import Utils from '../../utilities';

export class MarkerShapeManager extends ShapeManagerBase {

	// getCoordinateAsString(shapeObject: ShapeObject): string {
	// 	const marker = shapeObject.shape as MarkerShape;
	// 	Utils.doNothing(marker)
	// 	return null // Utils.getCoordinageStrByCoordinate(marker.coordinate);
	// }

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

	isWktOfType(wkt: string): boolean {
		return (wkt.indexOf('POINT(') > -1);
	}

	addShapeToLayer(shapeDef: ShapeDefinition, container: L.LayerGroup): L.Layer {
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

			leafletObject.shapeDef = _.merge(shapeDef, {
				data: {
					isSelected: _.get(shapeDef, 'data.isSelected', false),
					count: _.get(shapeDef, 'data.count', 1),
				}
			});
			container.addLayer(leafletObject);	// Add to layerGroup
			return leafletObject;
		} else {
			console.error('shapeDef.shapeObject.shape is missing for creating the marker');
			return null;
		}
		// tbd , use _.defaults for default options
	}

	updateIsSelectedView(leafletObject: L.Marker): void {
		const isSelected = _.get(leafletObject, 'shapeDef.data.isSelected');
		const leafletObjectParent:any = leafletObject.__parent && leafletObject.__parent._group.getVisibleParent(leafletObject);

		if (isSelected && leafletObjectParent) {
			leafletObjectParent._icon.classList.add('selected-cluster');
		} else if (leafletObjectParent) {
			leafletObjectParent._icon.classList.remove('selected-cluster');
		}


		if (!leafletObject._icon) { return; } // Object that hide under cluster

		// add or remove 'selected' css class
		const shapeData          = _.get(leafletObject, 'shapeDef.data');
		const unselected         = '#505050';
		const strokeSelected     = 'rgba(0, 166, 218, 1)';
		const backGroundSelected = '#ffffcc';

		// set lcation styling must be inline styling,
		if (shapeData.isSelected) {
			const interceptStroke = !shapeData.isSelectedFade ? strokeSelected : unselected;

			if (shapeData.type === 'intercept') {
				const circle = leafletObject._icon.querySelector('#circle');

				if (!circle) {return;}

				const sign   = leafletObject._icon.querySelector('#v-sign');

				circle.style.strokeWidth = '2px';
				circle.style.fill        = backGroundSelected;
				circle.style.stroke      = interceptStroke;
				sign.style.stroke        = interceptStroke;
			} else {
				const marker = leafletObject._icon.querySelector('path');

				if (!marker) {return;}

				marker.style.fill   = backGroundSelected;
				marker.style.stroke = interceptStroke;
			}

		} else {
			if (shapeData.type === 'intercept') {
				const circle = leafletObject._icon.querySelector('#circle');

				if (!circle) {return;}

				const sign = leafletObject._icon.querySelector('#v-sign');

				circle.style.fill        = unselected;
				circle.style.stroke      = 'white';
				circle.style.strokeWidth = "1px";
				sign.style.stroke = unselected;
			} else {
				const marker = leafletObject._icon.querySelector('path');

				if (!marker) { return; }

				marker.style.fill   = unselected;
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
		Utils.doNothing(shapeObject)
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