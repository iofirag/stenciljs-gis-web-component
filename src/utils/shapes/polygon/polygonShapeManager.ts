import { ShapeObject, PolygonShape, ShapeType, ShapeDefinition, PolygonShapeOptions, Coordinate } from '../../../models';
import { ShapeEventHandlers, ShapeManagerBase } from "../ShapeManager";
import _ from 'lodash';
import L from 'leaflet';
import Utils from '../../utilities';

export class PolygonShapeManager extends ShapeManagerBase {

  // getCoordinateAsString(shapeObject: ShapeObject): string {
  //   const polygon: PolygonShape = shapeObject.shape as PolygonShape;
  //   const coordinatesStrArr: string[] = [];

  //   polygon.coordinates.forEach((coordinate: Coordinate) => {
  //     Utils.doNothing(coordinate)
  //     // Iterate coordinates
  //     // coordinatesStrArr.push(Utils.getCoordinageStrByCoordinate(coordinate));
  //   });
  //   return coordinatesStrArr.join(',');
  // }

  getCoordinateList(shapeObject: ShapeObject): Coordinate[] {
    const polygon: PolygonShape = shapeObject.shape as PolygonShape;
    return polygon.coordinates;
  }

  getType(): ShapeType {
    return ShapeType.POLYGON;
  }

  shapeObjectToWkt(shapeObject: ShapeObject): string {
    const polygon = <PolygonShape>shapeObject.shape;

    if (polygon.coordinates) {


      if (!this.hasClosePoint(polygon.coordinates)) {
        polygon.coordinates.push(polygon.coordinates[0]);
      }
      const coordinates: string = polygon.coordinates.map((item: Coordinate) => (`${item.lng} ${item.lat}`)).join(',');
      return `POLYGON((${coordinates}))`;
    } else {
      throw new Error('Polygon has no coordinates');
    }
  }

  hasClosePoint(coordList: Coordinate[]): boolean {
    if (coordList.length > 0) {
      if (coordList[0].lat === coordList[coordList.length - 1].lat && coordList[0].lng === coordList[coordList.length - 1].lng) {
        return true;
      } else {
        return false;
      }
    } else {
      throw 'error: polygon with one coordinate';
    }
  }

  shapeWktToObject(shapeWkt: string): ShapeObject {
    const lngLatsStr = shapeWkt.replace(/[^0-9\.\,\ \-]/g, '');
    const lngLatsArr: string[] = lngLatsStr.split(',');
    const coordinates: Coordinate[] = [];

    lngLatsArr.forEach((coordinatesStr) => {
      const coordinate: string[] = coordinatesStr.split(' ');
      const coord: Coordinate = {
        lng: Number(coordinate[0]),
        lat: Number(coordinate[1])
      };
      coordinates.push(coord);
    });

    const polygonObj: ShapeObject = {
      shape: <PolygonShape>{ coordinates: coordinates },
      type: ShapeType.POLYGON
    };

    return polygonObj;
  }

  isWktOfType(wkt: string): boolean {
    /* TBD use shapeWktToObject method to parse wkt string, 
      if success and get the object, return true
      else return false
    */
    return (wkt.indexOf('MULTIPOLYGON(') === -1 && wkt.indexOf('POLYGON(') > -1);
    // return true; // tbd, start with circle
  }

  addShapeToLayer(shapeDef: ShapeDefinition, container: L.LayerGroup, eventHandlers: ShapeEventHandlers): L.FeatureGroup {
    Utils.doNothing(eventHandlers)
    if (shapeDef.shapeObject) {
      // Create Circle from shape values
      const polygonShape: PolygonShape = <PolygonShape>shapeDef.shapeObject.shape;
      const polygonShapeOptions: PolygonShapeOptions = <PolygonShapeOptions>shapeDef.options;
      const { coordinates } = polygonShape;

      // Clusterable Polygon ********************************************
      const ClusterablePolygon = L.Polygon.extend({
        _originalInitialize: L.Polygon.prototype.initialize,

        initialize: function (bounds: any, options: any) {
          this._originalInitialize(bounds, options);
          this._latlng = this.getBounds().getCenter();
        },
        getLatLng: function () {
          return this._latlng;
        },
        setLatLng: function () { }
      });
      // ****************************************************************

      const leafletObject: L.FeatureGroup = <any>new ClusterablePolygon(coordinates, polygonShapeOptions);

      leafletObject.shapeDef = _.merge(shapeDef, {
        data: {
          isSelected: _.get(shapeDef, 'data.isSelected', false),
          count: _.get(shapeDef, 'data.count', 1),
        }
      });

      // Utils.setEventsOnLeafletLayer(leafletObject, eventHandlers);	// Add events
      container.addLayer(leafletObject);	// Add to layerGroup
      return leafletObject;
    } else {
      console.error('shapeDef.shapeObject.shape is missing for creating the circle');
      return null;
    }
    // tbd , use _.defaults for default options
  }

  getShapeObjectFromDrawingLayer(layer: L.Polygon): ShapeObject {
    const polygon: PolygonShape = {
      coordinates: layer.getLatLngs()[0] as any
    };

    const polygonObj: ShapeObject = {
      shape: polygon,
      type: ShapeType.POLYGON
    };

    return polygonObj;
  }

  public getAreaSize(shapeObject: ShapeObject): number {
    const polygonShape: PolygonShape = <PolygonShape>shapeObject.shape;
    const areaSizeCalc: number = L.GeometryUtil.geodesicArea(polygonShape.coordinates);
    return areaSizeCalc || 0;
  }
  public isLayerOfThisShapeType(leafletLayer: L.Polygon): boolean {
    let success: boolean = false;

    const tagName: string = _.get(leafletLayer, 'feature.geometry.type');
    if (tagName && tagName.toLowerCase() === 'polygon') {
      // Way A
      success = true;
    } else {
      // Way B
      // Polygon | Polyline
      const item: any = _.get(leafletLayer, '_rings[0][0]');
      if (item) {
        const itemKeys: string[] = Object.keys(item);
        success = (itemKeys.indexOf('_code') > -1);
      }
    }

    return success;
  }
}
