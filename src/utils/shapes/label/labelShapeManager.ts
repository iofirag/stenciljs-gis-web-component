import { ShapeType, ShapeObject, ShapeDefinition, LabelShape, LabelShapeOptions, Coordinate } from '../../../models';
import _ from 'lodash';
import L from 'leaflet';
import { ShapeEventHandlers, ShapeManagerBase } from "../ShapeManager";
import Utils from '../../utilities';

export class LabelShapeManager extends ShapeManagerBase {

	getType(): ShapeType {
		return ShapeType.LABEL;
	}

	isWktOfType(wkt: string): boolean {
		return (wkt.indexOf('LABEL(') > -1);
	}
	shapeObjectToWkt(shapeObject: ShapeObject): string {
		const label = <LabelShape>shapeObject.shape;
		return 'LABEL(' + label.coordinate.lng + ' ' + label.coordinate.lat + ',' + label.text + ')';
	}
	shapeWktToObject(shapeWkt: string): ShapeObject {
		const labelParts = shapeWkt.split(',');

		if (labelParts.length === 2) {
			const lnglatStr = labelParts[0].replace(/[^0-9\.\ \-]/g, '');
			let strValue = labelParts[1];
			
			if (lnglatStr && strValue) {
				const lnglatArr: string[] = lnglatStr.split(' ');

				if (lnglatArr.length === 2) {
					const lnglat: Coordinate = {
						lng: Number(lnglatArr[0]),
						lat: Number(lnglatArr[1])
					};

					strValue = strValue.replace(/[)]/g, '');

					// Create label object
					const labelObj: ShapeObject = {
						shape: <LabelShape>{ coordinate: lnglat, text: strValue },
						type: ShapeType.LABEL
					};

					return labelObj;
				} else {
					throw 'missing latitude or longitude';
				}
			} else {
				throw 'format are not valid';
			}
		} else {
			throw 'missing latitude/longitude or label text';
		}
	}

	createShape(shapeDef: ShapeDefinition, eventHandlers: ShapeEventHandlers): L.Layer {
		Utils.doNothing(eventHandlers)
		if (shapeDef.shapeObject) { // everytime true, because shapeDef.shapeObject filled with value at shape initialize
			// Create Circle from shape values
			const labelShape: LabelShape = <LabelShape>shapeDef.shapeObject.shape;
			const labelShapeOptions: LabelShapeOptions = <LabelShapeOptions>shapeDef.options || {};
			const { lat, lng } = labelShape.coordinate;
			const textIcon = L.divIcon({
				className: 'leaflet-marker-icon textLabelClass leaflet-zoom-animated leaflet-interactive',
				html: labelShape.text
			});

			labelShapeOptions.icon = textIcon;

			const leafletObject: L.Layer = <any>L.marker([lat, lng], labelShapeOptions);

			/* leafletObject.shapeDef = _.merge(shapeDef, { O.A
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
	}

	updateIsSelectedView(leafletObject: L.Label): void {
		Utils.doNothing(leafletObject)
		console.error('TBD for label');
	}
	getShapeObjectFromDrawingLayer(layer: L.Label): ShapeObject {
		const label: LabelShape = {
			coordinate: layer.getLatLng(),
			text: layer.value
		};

		return {
			shape: label,
			type: ShapeType.LABEL
		};
	}
	getCoordinateList(shapeObject: ShapeObject): Coordinate[] {
		const label = <LabelShape>shapeObject.shape;
		return [label.coordinate];
	}

	public getAreaSize(shapeObject: ShapeObject): number {
		Utils.doNothing(shapeObject)
		return 0;
	}

	public isLayerOfThisShapeType(leafletLayer: L.Label): boolean {
		// Marker | Label
		const markerClassNames: string = _.get(leafletLayer, '_icon.className');
		if (!markerClassNames) { return false; };

		return markerClassNames.indexOf('textLabelClass') > -1;
	}
}