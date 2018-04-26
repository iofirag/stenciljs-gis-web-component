import { ShapeObject, PolygonShape, ShapeType, ShapeDefinition, PolygonShapeOptions, Coordinate, ShapeStore } from '../../../models';
import { ShapeEventHandlers, ShapeManagerBase } from "../ShapeManager";
import _ from 'lodash';
import L from 'leaflet';
import store from '../../../components/store/store';

export class PolygonShapeManager extends ShapeManagerBase {

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

  createShape(shapeDef: ShapeDefinition, eventHandlers: ShapeEventHandlers): L.FeatureGroup {
    _.noop(eventHandlers)
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
    // tbd , use _.defaults for default options
  }

  highlightElement(polygon: L.Polygon) {
    let isHighLighted: boolean = false;
    if (_.get(polygon, '_icon.classList.contains("highlighted")', false)
      || _.get(polygon, 'path.classList.contains("highlighted")', false)
      || _.get(polygon, '__parent._icon.classList.contains("highlighted")', false)
    ) {
      isHighLighted = true;
    }
    // const isHighLighted = ;

    if (!isHighLighted) {
      // Utils.highlightPOIsByGroupId(element.groupId);
      // Utils.highlightPOIsByElement(element)

      // target = element.__parent._icon
      // element.__parent._icon.classList.add('highlighted');

      const shapeStore: ShapeStore = store.groupIdToShapeStoreMap[polygon.groupId][polygon.id];

      // const manager = ShapeManagerRepository.getManagerByType(_.get(shapeStore, 'shapeDef.shapeObject.type'));
      // const shouldBeHighLighted: boolean = groupId === _.get(shapeStore, 'shapeDef.data.groupId');
      const highlightMarkerCluster = /* (shapeStore.shapeDef.data.groupId === groupId) &&  */_.get(shapeStore, 'leafletRef.__parent._group');
      if (!!highlightMarkerCluster) {
        const cluster = highlightMarkerCluster.getVisibleParent(shapeStore.leafletRef);
        if (_.get(cluster, '_icon')) {
          cluster._icon.classList.add('highlighted');
        }
      }

      if (polygon._path) {
        // add highilight
        polygon._path.classList.add('highlighted');
      }
      // else if (isIntercept && marker._icon) {
      // 	// remove highilight from preveus highlighted intercepts
      // 	marker._icon.classList.remove('highlighted');
      // }
    }
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
