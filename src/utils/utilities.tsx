import _ from "lodash";
import { FILE_TYPES, DEFAULT_OSM_TILE, MIN_ZOOM, MAX_ZOOM, FILE_TYPES_ARRAY, GENERIC_ID, ZOOM_TO_EXTEND_PADDING, GIS_VIEWER_TAG } from "./statics";
import { zip } from "@cc/shp-write";
import { TileLayerDefinition, BaseMap, ShapeLayerContainer_Dev, ShapeLayerDefinition,
    ShapeType, MapLayers, GroupData, ShapeStore, SelectedObjects, ShapeData, SelectedObjectsValue, ShapeIds,
    GroupIdToShapeStoreMap,
    Coordinate,
    ShapeDefinition,
    EXPORT_SHAPE_FIELDS,
    ExportedCSVFormat} from "../models";
import L from "leaflet";
import html2canvas from "html2canvas";
import LayersFactory from "./LayersFactory";
import { ShapeEventHandlers, ShapeManagerInterface } from "./shapes/ShapeManager";
import store from "../components/store/store";
import { ShapeManagerRepository } from "./shapes/ShapeManagerRepository";
import * as uuid from 'node-uuid';
import tokml from 'tokml';
import { toJS } from "mobx";

export default class Utils {
    public static log_componentWillLoad(compName: string) {
        console.log(`componentWillLoad ${compName}`);
    }
    public static log_componentDidLoad(compName: string) {
        console.log(`componentDidLoad ${compName}`);
    }
    public static log_componentDidUnload(compName: string) {
        console.log(`componentDidUnload ${compName}`);
    }
    public static appendHtmlWithContext = function (elm: HTMLElement, dom: string, context: any) {
        elm.innerHTML = dom;
        const elements = elm.querySelectorAll("[attachEvent]");

        _.forEach(elements, (element: any) => {
            element.getAttribute("attachEvent").split(";").forEach(function (event: any) {
                const eventNameAndHandler = event.split(":");
                const eventName = eventNameAndHandler[0];
                const eventHandler = eventNameAndHandler[1];

                if (eventName && eventHandler) {
                    element.addEventListener(eventName, context[eventHandler].bind(context));
                }
            });
        });
    };

    public static async exportMapImage(): Promise<any> {
      const controllers: any = document.getElementsByClassName('leaflet-control-container')[0];

      controllers.style.display = 'none';

      const markers = {};
      const markerLayer: any = document.querySelectorAll('.leaflet-marker-icon');

      // Remove tags css translate values and save the for after use
      if (markerLayer) {
        markerLayer.forEach((mark: any, i: number) => {
          const markTransformList = mark.style.transform.replace('translate3d(', '').split(',');
          mark.style.transform = '';

          if (markTransformList.length > 1) {
            const markX = parseFloat(markTransformList[0].replace('px', ''));
            mark.style.left = `${markX}px`;
            const markY = parseFloat(markTransformList[1].replace('px', ''));
            mark.style.top = `${markY}px`;
            markers[i] = { markX, markY };
          }
        });
      }

      // create the canvas from the leaflet map
      const canvas: any = await html2canvas(document.getElementById("map"), { useCORS: true, svgRendering: true });

      // return all the layers to their previous styles
      controllers.style.display = 'initial';

      if (markerLayer) {
        markerLayer.forEach((mark: any, i: number) => {
          const pos = markers[i];

          mark.style.transform = `translate3d(${pos.markX}px,${pos.markY}px, 0px)`;
          mark.style.top       = `${0}px`;
          mark.style.left      = `${0}px`;
        });
      }

      return canvas;
    }

    public static stopDoubleClickOnPlugin(htmlElement: HTMLElement) {
        // Disable double-click
        htmlElement.addEventListener("dblclick", (eventData: any) => {
            eventData.stopPropagation();
        });
    }

    public static b64toBlob = function (b64Data: string, contentType: string, sliceSize?: number) {
      contentType = contentType || '';
      sliceSize = sliceSize || 512;

      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });

      return blob;
    };

    public static fitLayerControllerPosition(LayerControllerMode: string = ''): void {
        const layerControllerButton: any = document.querySelector('.custom-toolbar-button.layer-controller');
        const layerControllerPlugin: any = document.querySelector('.custom-layer-controller');
        if (!(layerControllerButton && layerControllerPlugin)) { return; }
        layerControllerPlugin.style.left = layerControllerButton.offsetLeft + 'px';
        // layerControllerPlugin.className = layerControllerPlugin.className+ ' ' + isShowLayerController;

        const customLayerController: any = document.querySelector('.custom-layer-controller');
        customLayerController.className = layerControllerPlugin.className + ' ' + LayerControllerMode;
        const styledLayerControllerElement: any = document.querySelector('.leaflet-control-layers-expanded');

        styledLayerControllerElement.parentNode.removeChild(styledLayerControllerElement);
        customLayerController.appendChild(styledLayerControllerElement);

        // Empty class list for this Form element
        // styledLayerControllerElement.firstElementChild.firstElementChild.classList = '';
    }

    public static uglifyCsvJson(geoJson: L.GeoJSON): L.GeoJSON {
      // Uglify shapeDataObj
      if (geoJson.properties[EXPORT_SHAPE_FIELDS.shapeDataObj]) {
        geoJson.properties[EXPORT_SHAPE_FIELDS.shapeDataObj] = geoJson.properties[EXPORT_SHAPE_FIELDS.shapeDataObj].replace(/`/g, "");// delete all ` character
        geoJson.properties[EXPORT_SHAPE_FIELDS.shapeDataObj] = geoJson.properties[EXPORT_SHAPE_FIELDS.shapeDataObj].replace(/"/g, "`");// replace all " with `
      }

      return geoJson;
    }

    public static exportBlobFactory(
        fileType: FILE_TYPES,
        mapLayers: MapLayers,
        gisMap: L.Map,
        callback?: Function): Blob {

        const relevantExportedLayers: L.Layer[] = Utils.getRelevantExportedLayers(mapLayers, gisMap);
        const geoJsonList: L.GeoJSON[] = Utils.shapeListToGeoJson(relevantExportedLayers);

        return Utils.getBlobByType(fileType, geoJsonList, callback);
    }

    private static getBlobByType(type: FILE_TYPES, geoJsonList: L.GeoJSON[], callback?: Function): Blob {

      let blobData: Blob;
      switch (type) {
        case FILE_TYPES.kml:
          const kml: string = Utils.exportToKML(geoJsonList);
          blobData = new Blob([kml], { type: "text/plain;charset=utf-8" });
          break;
        case FILE_TYPES.csv:
          const csv: string = Utils.exportToCSV(geoJsonList);
          blobData = new Blob([csv], { type: "text/plain;charset=utf-8" });
          break;
        case FILE_TYPES.zip:
          const shp64b = Utils.exportToSHP(geoJsonList);
          blobData = Utils.b64toBlob(shp64b, 'application/zip');
          break;
        default:
          console.warn('File type is not recognize');
          break;
      }
      if (blobData && callback) {
        callback(blobData);
      }
      return blobData;
    }

    private static exportToCSV(geoJsonList: L.GeoJSON[]): string {
      const csv: string = Utils.createCsvFormatFromGeoJsonList(geoJsonList);
      return csv;
    }

    private static exportToSHP(geoJsonList: L.GeoJSON[]): any {
      // TODO Fix Export Shp file
      let shpBase64: any = undefined;
      try {
        shpBase64 = zip({
          type: 'FeatureCollection',
          features: geoJsonList
        });
      } catch(e) {
        console.error('Shp file failed: ', e.message);
      }

      return shpBase64;
    }

    private static exportToKML(geoJsonList: L.GeoJSON[]): string {
      const kml: string = Utils.createKmlFormatFromLayers(geoJsonList);
      return kml;
    }

    private static createCsvFormatFromGeoJsonList(geoJsonList: L.GeoJSON[]): string {
      let allRows: ExportedCSVFormat[] = [];
      // var jsonToCsv = require('convert-json-to-csv');

      geoJsonList.forEach((geoJson: L.GeoJSON) => {
        geoJson = Utils.uglifyCsvJson(geoJson);	// Fix data for creating valid csv	// Check
        const row: ExportedCSVFormat = geoJson.properties;
        allRows.push(row);
      });
      return this.convertArrayOfObjectsToCSV(allRows);
    }

    private static convertArrayOfObjectsToCSV(dataList: ExportedCSVFormat[], columnDelimiter?: any, lineDelimiter?: string): string {
      let result: string;
      let ctr: number;
      let keys: string[];

      if (dataList === null || !dataList.length) {
        return '';
      }

      columnDelimiter = columnDelimiter || ',';
      lineDelimiter = lineDelimiter || '\n';
      keys = Object.keys(dataList[0]);
      result = '';
      result += keys.join(columnDelimiter);

      dataList.forEach((item: any) => {
        ctr = 0;
        result += lineDelimiter;
        keys.forEach((key: any) => {
          if (ctr > 0) {
            result += columnDelimiter;
          }
          result += "\"" + item[key] + "\"";
          ctr++;
        });
      });
      return result;
    }

    private static createKmlFormatFromLayers(geoJsonLayers: L.GeoJSON[]): string {
      if (!geoJsonLayers) { return undefined; }

      let kmlStrHeader = '';
      let kmlStrFooter = '';
      let kmlStrContent = '';

      geoJsonLayers.forEach((geoJson: L.GeoJSON, i: number) => {
        const kml: string = tokml(geoJson);
        const placeMarkStartTag: string = '<Placemark>';
        const placeMarkEndTag: string = '</Placemark>';
        const documentStartTag: string = '<Document>';
        const documentEndTag: string = '</Document>';
        const endOfExtendedData = '</ExtendedData>';
        // const emptyExtendedDataTag: string = '<ExtendedData></ExtendedData>';

        // // kml content
        // const startPlacemarkIndex: number = kml.indexOf(placeMarkStartTag) + placeMarkStartTag.length;
        // const endPlacemarkIndex: number = kml.lastIndexOf(placeMarkEndTag) + placeMarkEndTag.length;

        const indexOfEndOfExtendedData  = kml.indexOf(endOfExtendedData) + endOfExtendedData.length;
        const indexOfEndOfPlacemark = kml.indexOf(placeMarkEndTag) + placeMarkEndTag.length;
        kmlStrContent = kml.slice(indexOfEndOfExtendedData, indexOfEndOfPlacemark);

        // kmlStrContent = kml.slice(startPlacemarkIndex, endPlacemarkIndex).replace(emptyExtendedDataTag, '');

        if (i === 0) {
          // kml header syntax tags
          kmlStrHeader = kml.slice(0, kml.indexOf(documentStartTag) + documentStartTag.length);
          // Create schema here & kmlStrHeader += schema;
          // kml closing tags
          kmlStrFooter = kml.slice(kml.lastIndexOf(documentEndTag));
        }
        kmlStrHeader += placeMarkStartTag;
        kmlStrHeader += this.createKmlExtendedData(geoJson);
        kmlStrHeader += kmlStrContent;
      });
      kmlStrHeader += kmlStrFooter; // Valid KML format
      return kmlStrHeader;
    }

    private static createKmlExtendedData(geoJson: L.GeoJSON): string {
      const shapeData: ShapeData = JSON.parse(geoJson.properties[EXPORT_SHAPE_FIELDS.shapeDataObj]);
      const shapeDef: ShapeDefinition = {...store.groupIdToShapeStoreMap[shapeData.groupId][shapeData.id].shapeDef};
      if (_.isEmpty(shapeDef)) { return ''; };

      const manager: ShapeManagerInterface = ShapeManagerRepository.getManagerByType(shapeDef.shapeObject.type);
      const areaSize: number = manager.getAreaSize(shapeDef.shapeObject);

      const extendedData: string =
        `<ExtendedData>
          ${shapeDef.shapeWkt ? `<Data name="${EXPORT_SHAPE_FIELDS.shapeWkt}"><value>${shapeDef.shapeWkt}</value></Data>` : ''}
          ${shapeData ? `<Data name="${EXPORT_SHAPE_FIELDS.shapeDataObj}"><value>${JSON.stringify(shapeData)}</value></Data>` : ''}
          <Data name="${EXPORT_SHAPE_FIELDS.areaSize}"><value>${areaSize}</value></Data>
        </ExtendedData>`;

      return extendedData;
    }

    // private static updateShapeDefIsSelected(id: string, groupId: string): ShapeData {
    //   const shape: ShapeStore = store.groupIdToShapeStoreMap[groupId][id];
    //   const shapeData: ShapeData = {...shape.shapeDef.data};
    //   const isSelectedObjectsContainsShape: boolean = store.idToSelectedObjectsMap.hasOwnProperty(id)|| store.idToSelectedObjectsMap.hasOwnProperty(groupId);

    //   shapeData.isSelected = isSelectedObjectsContainsShape;

    //   return shapeData;
    // }

    private static shapeListToGeoJson(visibleLayers: L.Layer[]): L.GeoJSON[] {
      const geoJsonList: L.GeoJSON[] = [];

      visibleLayers.forEach((layer: L.Layer) => {
        const shapeStore:             ShapeStore = Utils.getShapeStoreByShapeId(layer.id, layer.groupId);
        const shapeDefObj:       ShapeDefinition = shapeStore.shapeDef as ShapeDefinition;
        const shapeData:               ShapeData = toJS(shapeDefObj.data);
        const manager:     ShapeManagerInterface = ShapeManagerRepository.getManagerByType(shapeDefObj.shapeObject.type);
        const geoJson:                 L.GeoJSON = (layer as L.LayerGroup).toGeoJSON() as any;

        // delete shapeData.isSelected;
        // delete shapeData.isSelectedFade;

        // shapeDefObj.data = Utils.updateShapeDefIsSelected(layer.id, layer.groupId);
        geoJson.properties[EXPORT_SHAPE_FIELDS.shapeWkt]     = shapeDefObj.shapeWkt || '';
        geoJson.properties[EXPORT_SHAPE_FIELDS.areaSize]     = manager.getAreaSize(shapeDefObj.shapeObject);
        geoJson.properties[EXPORT_SHAPE_FIELDS.shapeDataObj] = JSON.stringify(shapeData) || JSON.stringify({});

        geoJsonList.push(geoJson);
      });

      return geoJsonList;
    }
    public static toggleCustomDropDownMenu(elm: HTMLElement) {
        const toogleState = elm.style.display;
        Utils.closeAllCustomDropDownMenus();
        elm.style.display = (toogleState === 'block') ? 'none' : 'block';
        if (elm.style.display === 'block') {
            document.querySelector('.custom-toolbar-button.layer-controller').classList.remove('clicked');
            document.querySelector('.custom-layer-controller').classList.remove('show');
        }
    }
    public static closeAllCustomDropDownMenus() {
        const allDropDownMenus = document.querySelectorAll('.menu');
        _.forEach(allDropDownMenus, (menu: HTMLElement) => {
            menu.style.display = 'none';
        });
    }
    public static setRadioButtonsByCheckedValue(customDropDownPluginEl: HTMLCustomDropDownPluginElement, groupName: string, checkedValue: any) {
        const groupItems: NodeListOf<Element> = customDropDownPluginEl.getControl().getContainer().querySelectorAll(`.menu li.menu-item.custom-group [name="${groupName}"]`);
        _.forEach(groupItems, (input: Element) => {
            // Unselect checked element
            if (input.getAttribute('checked')) {
                input.removeAttribute('checked');
            }
        });
        _.forEach(groupItems, (input: Element) => {
            // Selecet element
            if (input.getAttribute('value') === checkedValue) {
                input.setAttribute('checked', 'true');
            }
        });
    }
    static initStoreWithMapTiles(tilesLayerList: TileLayerDefinition[]): BaseMap {
        const baseMaps: BaseMap = {};
        if (tilesLayerList && tilesLayerList.length) {
            tilesLayerList.forEach((t: L.TileLayerOptions) => {
                // Add other layers
                const tileOptions: L.TileLayerOptions = { ...t, noWrap: true };
                // Create tile Layer from Uri
                baseMaps[t.name] = new L.TileLayer(t.tilesURI, tileOptions);
            });
        } else {
            const tileOptions: L.TileLayerOptions = { minZoom: MIN_ZOOM, maxZoom: MAX_ZOOM, attributionControl: false, noWrap: true };
            baseMaps[DEFAULT_OSM_TILE.name] = new L.TileLayer(DEFAULT_OSM_TILE.address, tileOptions);
        }
        return baseMaps;
    }
    static initiateLayers(shapeLayers: ShapeLayerDefinition[]) {
        // if (!_.get(store, 'state.shapeLayers.length')) { return; }

        // const shapeLayers: ShapeLayerDefinition[] = store.state.shapeLayers;
        const initialLayersTemp: ShapeLayerContainer_Dev[] = [];
        shapeLayers.forEach((item: ShapeLayerDefinition) => {
            const shapeLayerContainer: ShapeLayerContainer_Dev = LayersFactory.createHeatAndClusterLayer(item);
            // this.addingNewLayerToLayerController(shapeLayerContainer, LayerNames.INITIAL_LAYERS)
            initialLayersTemp.push(shapeLayerContainer);
        });
        return initialLayersTemp;
    }
    static setEventsOnLeafletLayer(leafletObject: L.Layer, eventHandlers: ShapeEventHandlers): void {
        if (leafletObject && eventHandlers) {
            const eventNames: string[] = Object.keys(eventHandlers) || [];
            eventNames.forEach((eventName: string) => {
                if (eventHandlers[eventName]) {
                    leafletObject.on(eventName, eventHandlers[eventName]);
                }
            });
        }
    }
    public static createShapeDefList(shapeIds: ShapeIds, newIsSelectedState: boolean, 
        alreadyChangedIds: SelectedObjects, shapeDefList: ShapeDefinition[]): void {
        // Build Changed object list for on-Selection-done 
        if (shapeIds.groupId === GENERIC_ID.DEFAULT_GROUP
            || shapeIds.groupId === GENERIC_ID.DRAW_LAYER_GROUP_ID) {
            // Single
            alreadyChangedIds[shapeIds.shapeId] = { selectionType: 'single', groupId: shapeIds.groupId };
            const oldIsSelectedState: boolean = store.idToSelectedObjectsMap.hasOwnProperty(shapeIds.shapeId);
            // Detect if isSelected change
            if (newIsSelectedState !== oldIsSelectedState) {
                // Update Selected state
                const shapeDef: ShapeDefinition = store.groupIdToShapeStoreMap[shapeIds.groupId][shapeIds.shapeId].shapeDef;
                shapeDef.data.isSelected = newIsSelectedState; // Update isSelected state of this object
                shapeDefList.push(toJS(shapeDef));
                // Do the change
                store.setSelectionMode(shapeIds, newIsSelectedState);
            }
        } else {
            // Group
            if (!alreadyChangedIds[shapeIds.groupId]) {
                alreadyChangedIds[shapeIds.groupId] = { selectionType: 'group', groupId: shapeIds.groupId };
                const currIsSelectedState: boolean = store.idToSelectedObjectsMap.hasOwnProperty(shapeIds.groupId);
                // Detect if isSelected change
                if (newIsSelectedState !== currIsSelectedState) {
                    // Update Selected state
                    _.map(store.groupIdToShapeStoreMap[shapeIds.groupId], (itemInGroup: ShapeStore) => {
                        const shapeDef: ShapeDefinition = itemInGroup.shapeDef;
                        shapeDef.data.isSelected = newIsSelectedState; // Update isSelected state of this object
                        shapeDefList.push(toJS(shapeDef));
                        // Do the change
                        store.setSelectionMode(shapeIds, newIsSelectedState);
                    });
                }
            }
        }
    }
    public static shapeOnClickHandler(clickEvent: any) {
        L.DomEvent.stopPropagation(clickEvent);

        // Remove last highlight
        Utils.removeHighlightPOIs();
        // Toggle selection for this shape ids
        const shapeIds: ShapeIds = {
            groupId: clickEvent.target.groupId,
            shapeId: clickEvent.target.id
        }
        const changedIds: SelectedObjects = {};
        const shapeDefList: ShapeDefinition[] = [];
        if (!store.state.mapConfig.isSelectionDisable && clickEvent.originalEvent.ctrlKey) {
            let currIsSelectedState: boolean = false;
            if (store.idToSelectedObjectsMap.hasOwnProperty(shapeIds.groupId)
                || store.idToSelectedObjectsMap.hasOwnProperty(shapeIds.shapeId)) {
                currIsSelectedState = true;
            }
            // Build Changed object list for on-Selection-done 
            Utils.createShapeDefList(shapeIds, !currIsSelectedState, changedIds, shapeDefList);

            // store.toggleSelectionMode(shapeIds);
        }

        let groupData: GroupData = null;
        if (shapeIds.groupId === GENERIC_ID.DEFAULT_GROUP || shapeIds.groupId === GENERIC_ID.DRAW_LAYER_GROUP_ID) {
            groupData = {
                [shapeIds.shapeId]: store.groupIdToShapeStoreMap[shapeIds.groupId][shapeIds.shapeId]
            }
            // const shapeStore: ShapeStore = store.groupIdToShapeStoreMap[shapeIds.groupId][shapeIds.shapeId];
            // const shapeType: ShapeType = _.get(shapeStore, 'shapeDef.shapeObject.type');
            // const manager: ShapeManagerInterface = ShapeManagerRepository.getManagerByType(shapeType);
            // manager.toggleHighlight(shapeStore.leafletRef);
        } else {
            groupData = store.groupIdToShapeStoreMap[shapeIds.groupId];
            // Utils.highlightPOIsByGroupId(shapeIds.groupId);
        }

        _.forEach(groupData, (shapeStore: ShapeStore) => {
            const shapeType: ShapeType = _.get(shapeStore, 'shapeDef.shapeObject.type');
            const manager: ShapeManagerInterface = ShapeManagerRepository.getManagerByType(shapeType);
            manager.highlightElement(shapeStore.leafletRef);

            if (!store.state.mapConfig.isSelectionDisable && clickEvent.originalEvent.ctrlKey) {
                manager.updateIsSelectedView(shapeStore.leafletRef);
                Utils.updateBubble(shapeStore.leafletRef);
            }
        })
        const gisViewerEl: HTMLGisViewerElement = document.querySelector(GIS_VIEWER_TAG);
        gisViewerEl.brodcastEvent('selectionDone', shapeDefList);
    }
    public static updateBubble(leafletObject: L.Layer): void {
        const shapeData: ShapeData = store.groupIdToShapeStoreMap[leafletObject.groupId][leafletObject.id].shapeDef.data;
        // Update popup
        const bubbleContent: string = Utils.generatePopupMarkupFromData(shapeData);
        if (leafletObject._layers) {
            // Multipolygon flow
            Object.values(leafletObject._layers).forEach((polygonItem: L.Polygon) => {
                updateBubbleByLayerAndContent(polygonItem, bubbleContent);
            });
        } else {
            // Other shapes flow
            updateBubbleByLayerAndContent(leafletObject, bubbleContent);
        }

        function updateBubbleByLayerAndContent(layer: any, bubbleData: string) {
            if (layer.getPopup()) {
                layer.setPopupContent(bubbleData);
            }
            if (layer.getTooltip()) {
                layer.setTooltipContent(bubbleData);
            }
        }
    };
    // public static updateIsSelectedClusterView(leafletObject: any) {
    //     // const leafletObjectParent: any = leafletObject.__parent && leafletObject.__parent._group.getVisibleParent(leafletObject);

    //     const clusterChilds: (L.Layer | L.FeatureGroup)[] = leafletObject.__parent.getAllChildMarkers();
    //     const isClusterSelected: boolean = _.some(clusterChilds, (layer: L.Layer | L.FeatureGroup) => {
    //         if (layer.id && layer.groupId) {
    //             const shapeStore: ShapeStore = store.groupIdToShapeIdMap[layer.groupId][layer.id];
    //             const isSelected = _.get(shapeStore, 'shapeDef.data.isSelected');
    //             return isSelected;
    //         }
    //     })
    //     if (isClusterSelected) {
    //         // leafletObjectParent._icon.classList.add('selected-cluster');
    //     } else {
    //         // leafletObjectParent._icon.classList.remove('selected-cluster');
    //     }
    // }
    public static removeHighlightPOIs() {
        const highlighted: NodeListOf<Element> = document.querySelectorAll('.highlighted');

        _.forEach(highlighted, (elm: HTMLElement) => {
            elm.classList.remove('highlighted');
        });
    }
    public static highlightPOIsByElement(leaflet: L.Layer | L.FeatureGroup): void {
        const shapeStore: ShapeStore = store.groupIdToShapeStoreMap[leaflet.groupId][leaflet.id];

        const manager = ShapeManagerRepository.getManagerByType(_.get(shapeStore, 'shapeDef.shapeObject.type'));
        const isMarkerManager: boolean = manager && (manager.getType() === ShapeType.MARKER);
        const isIntercept: boolean = _.get(shapeStore, 'leafletRef._icon') && _.get(shapeStore, 'shapeDef.data.type') === 'intercept';
        // const shouldBeHighLighted: boolean = groupId === _.get(shapeStore, 'shapeDef.data.groupId');
        const highlightMarkerCluster = /* (shapeStore.shapeDef.data.groupId === groupId) &&  */_.get(shapeStore, 'leafletRef.__parent._group');
        if (!!highlightMarkerCluster) {
            const cluster = highlightMarkerCluster.getVisibleParent(shapeStore.leafletRef);
            if (_.get(cluster, '_icon')) {
                cluster._icon.classList.add('highlighted');
            }
        }

        if (/* shouldBeHighLighted && */ isMarkerManager && isIntercept && _.get(shapeStore, 'leafletRef._icon')) {
            // add highilight
            (shapeStore.leafletRef as any)._icon.classList.add('highlighted');
        } else if (isMarkerManager && isIntercept && _.get(shapeStore, 'leafletRef._icon')) {
            // remove highilight from preveus highlighted intercepts
            (shapeStore.leafletRef as any)._icon.classList.remove('highlighted');
        }
    }
    public static highlightPOIsByGroupId(groupId: string): void {
        if (!groupId) { return; }

        const groupIdData: GroupData = store.groupIdToShapeStoreMap[groupId];
        if (groupIdData) {
            _.forEach(groupIdData, (shapeStore: ShapeStore) => {
                const manager = ShapeManagerRepository.getManagerByType(_.get(shapeStore, 'shapeDef.shapeObject.type'));
                const isMarkerManager: boolean = manager && (manager.getType() === ShapeType.MARKER);
                const isIntercept: boolean = _.get(shapeStore,'leafletRef._icon') && _.get(shapeStore, 'shapeDef.data.type') === 'intercept';
                const shouldBeHighLighted: boolean = groupId === _.get(shapeStore, 'shapeDef.data.groupId');
                const highlightMarkerCluster = /* (shapeStore.shapeDef.data.groupId === groupId) &&  */_.get(shapeStore, 'leafletRef.__parent._group');

                if (!!highlightMarkerCluster) {
                    const cluster = highlightMarkerCluster.getVisibleParent(shapeStore.leafletRef);
                    if (_.get(cluster, '_icon')) {
                        cluster._icon.classList.add('highlighted');
                    }
                }

                if (shouldBeHighLighted && isMarkerManager && isIntercept && _.get(shapeStore, 'leafletRef._icon')) {
                    // add highilight
                    (shapeStore.leafletRef as any)._icon.classList.add('highlighted');
                } else if (isMarkerManager && isIntercept && _.get(shapeStore, 'leafletRef._icon')) {
                    // remove highilight from preveus highlighted intercepts
                    (shapeStore.leafletRef as any)._icon.classList.remove('highlighted');
                } else if (shouldBeHighLighted && (shapeStore.leafletRef as any)._path) {
                  // add highlight to polygon
                  (shapeStore.leafletRef as any)._path.classList.add('highlighted');
                } else if ((shapeStore.leafletRef as any)._path) {
                  // remove highlight from polygon
                  (shapeStore.leafletRef as any)._path.classList.remove('highlighted');
                }
            });
        }
    }
    public static getVisibleLayers(mapLayers: MapLayers, map: L.Map): L.Layer[] {
        const shapeLayers: any[] = [];

        // collect all visible leaflet shapes from every layer

        // Initial layers
        mapLayers.initialLayers.forEach((dataLayer: ShapeLayerContainer_Dev) => {
            const isLayerVisible: boolean = map.hasLayer(dataLayer.leafletClusterLayer);

            if (isLayerVisible) {
                // Add all layers-objects to the output list
                shapeLayers.push(...dataLayer.leafletClusterLayer.getLayers());
            }
        });

        // Imported layers
        if (mapLayers.importedLayers) {
            FILE_TYPES_ARRAY.forEach((fileType: string) => {
                mapLayers.importedLayers[fileType].forEach((dataLayer: ShapeLayerContainer_Dev) => {
                    const isLayerVisible: boolean = map.hasLayer(dataLayer.leafletClusterLayer);
                    if (isLayerVisible) {
                        // Add all layers-objects to the output list
                        shapeLayers.push(...dataLayer.leafletClusterLayer.getLayers());
                    }
                });
            });
        }

        // Drawable layers
        mapLayers.drawableLayers.forEach((drawLayer: L.FeatureGroup) => {
            const isLayerVisible: boolean = map.hasLayer(drawLayer);
            if (isLayerVisible) {
                // Add all layers-objects to the output list
                shapeLayers.push(...drawLayer.getLayers());
            }
        });

        return shapeLayers;
    }
    public static getSelectedObjects(selectedLeafletObjects: SelectedObjects, groupIdToShapeStoreMap: GroupIdToShapeStoreMap): ShapeStore[] {
        // get all selected object
      const selectedShapes:ShapeStore[] = [];
      // running on selectedLeafletObjects to pull out all selected shapeDef from groupIdToShapeStoreMap
      _.forIn(selectedLeafletObjects, (value: SelectedObjectsValue, key: string) => {
        if (value.selectionType === 'group') {
          const group: GroupData = groupIdToShapeStoreMap[value.groupId];

          _.forIn(group, (value: ShapeStore) => selectedShapes.push(value));
        } else if (value.selectionType === 'single') {
            const defaultGroup: GroupData = groupIdToShapeStoreMap[GENERIC_ID.DEFAULT_GROUP];
            const drawGroup: GroupData = groupIdToShapeStoreMap[GENERIC_ID.DRAW_LAYER_GROUP_ID];
          const valueInGroup: GroupData = defaultGroup || drawGroup;

          if (valueInGroup) {
            selectedShapes.push(valueInGroup[key]);
          }
        }
      });

      return selectedShapes;
    }
    public static getShapeStoreByShapeId(shapeId: string, groupId?: string): ShapeStore {
        let groupDataList: GroupData[] = [];
        if (groupId) {
            groupDataList.push(store.groupIdToShapeStoreMap[groupId]);
        } else {
            _.forEach(store.groupIdToShapeStoreMap, (groupData: GroupData) => {
                groupDataList.push(groupData);
            })
        }
        let selectedShape: ShapeStore = null;
        _.forEach(groupDataList, (groupData: GroupData) => {
            _.forEach(groupData, (shapeStore: ShapeStore) => {
                if (shapeStore.leafletRef.id === shapeId) {
                    selectedShape = shapeStore;
                }
            })
        })
        return selectedShape;
    }
    // public isLayerNeedToBeSelected(layer: L.Layer| L.FeatureGroup): boolean {
    //     if (layer.groupId.includes(GENERATED_ID.DEFAULT_GROUP)
    //         || layer.groupId.includes(GENERATED_ID.DRAW_LAYER_GROUP_ID)) {
    //         // Add shape-id to selected list
    //         // this.selectedIds[shapeIds.shapeId] = shapeIds
    //     } else {
    //         // Add group-id to selected list
    //         // this.selectedIds[shapeIds.groupId] = { groupId: '', shapeId: '' };
    //     }
    // }
    public static updateViewForSelectedObjects(changedObjects: SelectedObjects) {
        // const selectedObjects: ShapeStore[] = Utils.getSelectedObjects();
        // // TBD check e for inner shapes instead of iterate all visibleLayers
        // selectedObjects.forEach((shapeStore: ShapeStore) => {
        //     const manager = ShapeManagerRepository.getManagerByType(_.get(shapeStore, 'shapeDef.shapeObject.type'));
        //     if (manager) {
        //         if (store.gisMap.getBounds().contains((shapeStore.leafletRef as any).getLatLng())) {
        //             manager.updateIsSelectedView(shapeStore.leafletRef);
        //         }
        //     }
        // });
        _.forEach(changedObjects, (selectedObjectsValue: SelectedObjectsValue, key: string) => {
            let groupData: GroupData = {};
            switch (selectedObjectsValue.selectionType) {
                case 'group':
                    // Whole group was selected (cant be DEFAULT_GROUP or DRAW_LAYER_GROUP_ID)
                    groupData = store.groupIdToShapeStoreMap[selectedObjectsValue.groupId];
                    break;
                case 'single':
                    // just one shape was selected
                    groupData = {
                        [key]: store.groupIdToShapeStoreMap[selectedObjectsValue.groupId][key]
                    }
                    break;

                default:
                    break;
            }
            _.forEach(groupData, (shapeStore: ShapeStore) => {
                const manager = ShapeManagerRepository.getManagerByType(_.get(shapeStore, 'shapeDef.shapeObject.type'));
                if (manager && (shapeStore.leafletRef as any).getLatLng()) {
                    if (store.gisMap.getBounds().contains((shapeStore.leafletRef as any).getLatLng())) {
                        manager.updateIsSelectedView(shapeStore.leafletRef);
                        // Fix for unselected shapes that theier group is selected
                        Utils.updateBubble(shapeStore.leafletRef);
                    }
                }
            });
        })



        // _.forEach(store.idToSelectedObjectsMap, (selectedObjectsValue: SelectedObjectsValue, key: string) => {
            // const shapeType: ShapeType = _.get(shapeStore, 'shapeDef.shapeObject.type');
            // const manager: ShapeManagerInterface = ShapeManagerRepository.getManagerByType(shapeType);
            // manager.updateIsSelectedView(layer);


            // _.forEach(groupData, shapeStore => {

            // })
    }
    public static selectClustersBySelectedLeafletObjects(selectedObjects: SelectedObjects) {
        // if (_.isEmpty(selectedLeafletObjects)) { return; }
        // const selectedIdsList: string[] = Object.keys(selectedIds)
        _.forEach(selectedObjects, (selectedObjectsValue: SelectedObjectsValue, key: string) => {
            // const shapeType: ShapeType = _.get(shapeStore, 'shapeDef.shapeObject.type');
            // const manager: ShapeManagerInterface = ShapeManagerRepository.getManagerByType(shapeType);
            // manager.updateIsSelectedView(layer);

            let groupData: GroupData = {};
            switch (selectedObjectsValue.selectionType) {
                case 'group':
                    // Whole group was selected (cant be DEFAULT_GROUP or DRAW_LAYER_GROUP_ID)
                    groupData = store.groupIdToShapeStoreMap[selectedObjectsValue.groupId];
                    break;
                case 'single':
                    // just one shape was selected
                    groupData = {
                        [key]: store.groupIdToShapeStoreMap[selectedObjectsValue.groupId][key]
                    }
                    break;

                default:
                    break;
            }
            _.forEach(groupData, shapeStore => {
                const highlightMarkerCluster = _.get(shapeStore, 'leafletRef.__parent._group');

                if (!!highlightMarkerCluster) {

                    const cluster = highlightMarkerCluster.getVisibleParent(shapeStore.leafletRef);

                    let isSelected = false;
                    if (store.idToSelectedObjectsMap.hasOwnProperty(shapeStore.leafletRef.groupId)
                        || store.idToSelectedObjectsMap.hasOwnProperty(shapeStore.leafletRef.id)) {
                        isSelected = true;
                    }
                    if (_.has(cluster, '_icon') && isSelected) {
                        cluster._icon.classList.add('selected-cluster');
                    }
                }
            })
        });
    }
    // public static selectedLeafletObjectHandler(leafletObject: L.FeatureGroup | L.Layer, shapeDef: ShapeDefinition) {
    //     // Single/Multi select a shape flow
    //     // const layerId: string = String(L.Util.stamp(leafletObject));	// Get leaflet layer id
    //     const leafletObjectParent: any = leafletObject.__parent && leafletObject.__parent._group.getVisibleParent(leafletObject);
    //     // Selected leaflet shpae list
    //     if (shapeDef.data.isSelected) {
    //         // Save leaflet shape reference to selected list
    //         // context.selectedLeafletObjects[layerId] = leafletObject; // O.A

    //         if (leafletObjectParent) {
    //             leafletObjectParent._icon.classList.add('selected-cluster');
    //         }

    //     } else {
    //         // Remove selected object from selectedLeafletObjects
    //         // delete context.selectedLeafletObjects[layerId];

    //         if (leafletObjectParent) {
    //             leafletObjectParent._icon.classList.remove('selected-cluster');
    //         }
    //     }

    //     if (_.isEmpty(store.selectedObjects)) {
    //         // Utils.zoomToExtend(store.selectedObjects, store.mapLayers, store.gisMap);
    //     }
    // }
    public static zoomToExtend(mapState: MapLayers, map: L.Map): boolean {
        let tempLayers: L.FeatureGroup = new L.FeatureGroup([]);

        const relevantShapes: L.Layer[] = this.getRelevantExportedLayers(mapState, map);
        relevantShapes.map((shape: L.Layer) => {
            tempLayers.addLayer(shape);
        });

        if (tempLayers.getLayers().length) {
            const bounds: L.LatLngBounds = tempLayers.getBounds();
            const boundsMaxZoom: number = map.getBoundsZoom(bounds);
            if (bounds && bounds._northEast && bounds._southWest && boundsMaxZoom) {
                map.fitBounds(bounds, { padding: ZOOM_TO_EXTEND_PADDING, maxZoom: boundsMaxZoom });
                return true;
            } else {
                console.log('Currently there is not any shapes on any layer');
            }
        } else {
            map.fitWorld();
            return true;
        }
        return false;
    }
    private static getRelevantExportedLayers(mapState: MapLayers, map: L.Map): L.Layer[] {
        // Check if there are selected objects
        if (Object.keys(store.idToSelectedObjectsMap).length) {
            const selectedObjects: ShapeStore[] = this.getSelectedObjects(store.idToSelectedObjectsMap, store.groupIdToShapeStoreMap);
            return _.map(selectedObjects, (shapeStore: ShapeStore)=>{
                return shapeStore.leafletRef
            })
        } else {
            return this.getVisibleLayers(mapState, map);
        }
    }
    public static createBubble(leafletObject: L.Layer, shapeData: ShapeData, type: string): void {
        // Create bubble
        const bubbleContent: string = Utils.generatePopupMarkupFromData(shapeData);
        if (leafletObject._layers) {
            // Multipolygon flow
            Object.values(leafletObject._layers).forEach((polygonItem: L.Polygon) => {
                createBubbleByLayerAndContent(polygonItem, bubbleContent);
            });
        } else {
            // Other shapes flow
            createBubbleByLayerAndContent(leafletObject, bubbleContent);
        }
        function createBubbleByLayerAndContent(layer: any, bubbleData: string) {
            layer['bind' + type](bubbleData);
        }
    };
    public static generatePopupMarkupFromData(shapeData: ShapeData) {

        const isSelected: boolean = (store.idToSelectedObjectsMap[shapeData.groupId] || store.idToSelectedObjectsMap[shapeData.id])? true: false;
        const popupFields = _.omit(shapeData, ['id', 'groupId', /* 'isSelected', */ 'isSelectedFade', 'type', 'count']);
        popupFields.isSelected = isSelected;

        let htmlTemplate = '';
        _.forIn(popupFields, (value: any, key: string) => {
            htmlTemplate +=
                `<div class="tooltip-row">
				<label class="tooltip-row-key">${key}</label><label class="tooltip-row-value">${value}</label>
			</div>`;
        });

        return htmlTemplate;
    }
    public static computeNewCoordinateFromCoordinateAndDistance(vPoint: Coordinate, vAngle: number, vDistance: number) {
        const EARTH_RADIUS_IN_METERS = 6371000; // maybe this real  6371000
        const distance = vDistance / EARTH_RADIUS_IN_METERS;
        const angle = Utils.toRad(vAngle);

        const vLat1 = Utils.toRad(vPoint.lat);
        const vLng1 = Utils.toRad(vPoint.lng);

        const vNewLat = Math.asin(Math.sin(vLat1) * Math.cos(distance) +
            Math.cos(vLat1) * Math.sin(distance) * Math.cos(angle));

        const vNewLng = vLng1 + Math.atan2(Math.sin(angle) * Math.sin(distance) * Math.cos(vLat1), Math.cos(distance) - Math.sin(vLat1) * Math.sin(vNewLat));

        return (isNaN(vNewLat) || isNaN(vNewLng)) ? null : Utils.toDeg(vNewLat) + ' ' + Utils.toDeg(vNewLng);  // vNewLatLng;
    }
    public static generateIdWithPrefix (prefix) {
        return `${prefix}_${uuid.default()}`
    }
    private static toRad(vInput: number) {
        return vInput * Math.PI / 180;
    }
    private static toDeg(vInput: number) {
        return vInput * 180 / Math.PI;
    }
}
