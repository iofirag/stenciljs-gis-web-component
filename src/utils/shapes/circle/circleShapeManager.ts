import { ShapeEventHandlers, ShapeManagerBase } from "../ShapeManager";
// import _ from 'lodash';
import L from 'leaflet';
import { ShapeDefinition, CircleShape, CircleShapeOptions, ShapeType, ShapeObject, 
	ShapeObjectOptions, Coordinate } from '../../../models';
import _ from "lodash";
import Utils from "../../utilities";

export class CircleShapeManager extends ShapeManagerBase {

	getType(): ShapeType {
		return ShapeType.CIRCLE;
	}

	shapeObjectToWkt(shapeObject: ShapeObject, shapeObjectOptions: ShapeObjectOptions): string {
		_.noop(shapeObjectOptions)
		const circle = <CircleShape>shapeObject.shape;

		if (circle.coordinate && (circle.radius >= 0)) {
			const radius        = circle.radius;
			const centerPoint   = circle.coordinate;

			// const TOP_ANGLE     = 0;
			const RIGHT_ANGLE   = 90;
			const BOTTOM_ANGLE  = 180;
			const LEFT_ANGLE    = 270;
			const INITIAL_ANGLE = 360;

			const pi = Utils.computeNewCoordinateFromCoordinateAndDistance(centerPoint, INITIAL_ANGLE, radius);
			const pR = Utils.computeNewCoordinateFromCoordinateAndDistance(centerPoint, RIGHT_ANGLE, radius);
			const pB = Utils.computeNewCoordinateFromCoordinateAndDistance(centerPoint, BOTTOM_ANGLE, radius);
			const pL = Utils.computeNewCoordinateFromCoordinateAndDistance(centerPoint, LEFT_ANGLE, radius);
			// _.noop([radius, centerPoint, RIGHT_ANGLE, BOTTOM_ANGLE, LEFT_ANGLE, INITIAL_ANGLE])
			// const pT = Utils.computeNewCoordinateFromCoordinateAndDistance(centerPoint, TOP_ANGLE, radius);

			// return 'CIRCULARSTRING(' + pR + ',' + pB + ',' + pL + ',' + pT + ',' + pi  + ')';
			return 'CURVEPOLYGON(CIRCULARSTRING(' + pi + ',' + pR + ',' + pB + ',' + pL + ',' + pi + '))';
		} else {
			throw new Error("Please check if you have circle coordinate point and radius");
		}
	}
	
	shapeWktToObject(shapeWkt: string): ShapeObject {
		let stripped = shapeWkt.replace(/[^0-9\,\.\ \-]/g, '');
		let circlePointsArr = stripped.split(',');
		enum CIRCLE_POINTS { RIGHT, BOTTOM, LEFT, TOP }

		// Parse coords
		const bottomCoords = this._seperateCirclePoint(circlePointsArr, CIRCLE_POINTS.BOTTOM);
		const topCoords = this._seperateCirclePoint(circlePointsArr, CIRCLE_POINTS.TOP);

		// Calculate middle point
		const middlePoint: Coordinate = {
			lat: (bottomCoords.lat + topCoords.lat) / 2,
			lng: (bottomCoords.lng + topCoords.lng) / 2
		};

		// Circle
		const DEFAULT_RADIUS = 0;
		const radius = this._calculateDistanceBetween2Points(middlePoint, topCoords) || DEFAULT_RADIUS;

		if (middlePoint) {
			const circleObj: ShapeObject = {
				shape: <CircleShape>{ coordinate: middlePoint, radius },
				type: ShapeType.CIRCLE
			};

			return circleObj;
		} else {
			throw 'Error, invalid circle-wkt format';
		}
	}

	isWktOfType(wkt: string): boolean {
		return (wkt.indexOf('CIRCULARSTRING(') > -1);
	}

	createShape(shapeDef: ShapeDefinition, eventHandlers: ShapeEventHandlers): L.Layer {
		_.noop(eventHandlers)
		if (shapeDef.shapeObject) {
			// Create Circle from shape values
			const circleShape:        CircleShape        = <CircleShape>shapeDef.shapeObject.shape;
			const circleShapeOptions: CircleShapeOptions = <CircleShapeOptions>shapeDef.options;
			const DEFAULT_CIRCLE_OPTIONS = {
				radius: 0
			};
			const circleShapeOptionsExtended: any = <CircleShapeOptions>circleShapeOptions || DEFAULT_CIRCLE_OPTIONS;
			circleShapeOptionsExtended.radius = circleShape.radius;

			const ClusterableCircle = L.Circle.extend({
				getBounds: function () {
					return this.getLatLng().toBounds(this.getRadius() * 2);
				}
			});

			const leafletObject: L.Layer = <any> new ClusterableCircle(circleShape.coordinate, circleShapeOptionsExtended);
			/* leafletObject.shapeDef = _.merge(shapeDef,{ O.A
				data: {
					isSelected: _.get(shapeDef, 'data.isSelected', false),
					count: _.get(shapeDef, 'data.count', 1),
				}
			}); */

			// Utils.setEventsOnLeafletLayer(leafletObject, eventHandlers);	// Add events
			// container.addLayer(leafletObject);	// Add to layerGroup
			return leafletObject;
		} else {
			console.error('shapeDef.shapeObject.shape is missing for creating the circle');
			return null;
		}
		// tbd , use _.defaults for default options
	}

	getShapeObjectFromDrawingLayer(layer: L.Circle): ShapeObject {
		const circleItem: CircleShape = {
			coordinate: layer.getLatLng(),
			radius: layer.getRadius()
		};

		let circleObj: ShapeObject = {
			shape: circleItem,
			type: ShapeType.CIRCLE
		};
		return circleObj;
	}

	_seperateCirclePoint(circlePointsArr: string[], pDir: number): Coordinate {
		enum COORDS {
			LAT = 0,
			LNG = 1
		}

		const coordsArr = circlePointsArr[pDir].split(' ');
		const coords: Coordinate = {
			lat: Number(coordsArr[COORDS.LAT]),
			lng: Number(coordsArr[COORDS.LNG])
		};

		return coords;
	}
	_calculateDistanceBetween2Points(p1: Coordinate, p2: Coordinate) {
		const lat1: number = p1.lat;
		const lon1: number = p1.lng;

		const lat2: number = p2.lat;
		const lon2: number = p2.lng;

		const R = 6371e3; // metres
		const φ1 = this._toRad(lat1);
		const φ2 = this._toRad(lat2);
		const Δφ = this._toRad(lat2 - lat1);
		const Δλ = this._toRad(lon2 - lon1);

		const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		const distance = R * c;
		return distance;
	}

	_toRad(vInput: number) {
		return vInput * Math.PI / 180;
	}
	getCoordinateList(shapeObject: ShapeObject): Coordinate[] {
		const circle = <CircleShape>shapeObject.shape;
		return [circle.coordinate];
	}
	getRadius(shapeObject: ShapeObject): number {
		const circle = <CircleShape>shapeObject.shape;
		return circle.radius;
	}

	public getAreaSize(shapeObject: ShapeObject): number {
		const circle = <CircleShape>shapeObject.shape;
		const areaSizeCalc: number = Math.PI * Math.pow(circle.radius, 2);
		return areaSizeCalc || 0;
	}

	public isLayerOfThisShapeType(leafletLayer: L.Circle): boolean {
		if (!leafletLayer.getRadius) { return false; }

		return true;
	}
}
