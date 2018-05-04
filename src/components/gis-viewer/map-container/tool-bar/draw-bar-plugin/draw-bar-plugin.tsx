import { Component, Prop, State, Method, Event ,EventEmitter } from "@stencil/core";
import { DrawBarConfig, ShapeStore, ShapeType, ShapeDefinition, ShapeData, ShapeObject, WktShape, GroupIdToShapeStoreMap } from "../../../../../models";
// import * as leafletDraw from 'leaflet-draw';
import * as leafletDrawDrag from 'leaflet-draw-drag';
import L from "leaflet";
import { DRAW_BAR_PLUGIN_TAG, LAYER_MANAGER_PLUGIN_TAG, GENERATED_ID } from "../../../../../utils/statics";
import Utils from "../../../../../utils/utilities";
import _ from "lodash";
import store from "../../../../store/store";
import { reaction } from "mobx";
import { ShapeManagerRepository } from "../../../../../utils/shapes/ShapeManagerRepository";
import { ShapeManagerInterface } from "../../../../../utils/shapes/ShapeManager";
import Generator from 'id-generator';
import { markerSvg } from "../../../../../utils/shapes/Marker/maker";
const drawIdGenerator = new Generator(() => { return GENERATED_ID.DRAW_LAYER_GROUP_ID })

@Component({
    tag: 'draw-bar-plugin',
    styleUrls: [
        '../../../../../../node_modules/leaflet-draw/dist/leaflet.draw.css',
        './draw-bar-plugin.scss'
    ]
})
export class DrawBarPlugin {
    compName: string = DRAW_BAR_PLUGIN_TAG;
    @Prop() config: DrawBarConfig
    @Prop() gisMap: L.Map

    @Event() endImportDrawCB: EventEmitter<WktShape[]>;
    @Event() onDrawCreatedCB: EventEmitter<WktShape>;
    @Event() onDrawEditedCB: EventEmitter<WktShape[]>;
    @Event() onDrawDeletedCB: EventEmitter<WktShape[]>;

    @State() control: L.Control;
    @State() drawnLayer: L.FeatureGroup;
    layerManagerEl: HTMLLayerManagerPluginElement;

    @Method()
    getControl(): L.Control {
        return this.control;
    }
    @Method()
    public export(): WktShape[] {
        const exportDrawableLayers: Array<WktShape> = [];
        const layers: (L.Layer | L.FeatureGroup)[] = this.drawnLayer.getLayers();

        layers.forEach((layer: L.Layer) => {
            const shapeStore: ShapeStore = store.groupIdToShapeStoreMap[layer.groupId][layer.id];
            const shapeType: ShapeType = _.get(shapeStore, 'shapeDef.shapeObject.type');
            const manager: ShapeManagerInterface = ShapeManagerRepository.getManagerByType(shapeType);
            if (!manager) { return; }

            //const wkt: string = manager.shapeObjectToWkt(shapeStore.shapeDef.shapeObject);  // TBD can use the wkt that created at the creation of this layer. check can cause a wrong wkt if user has edit the shape
            const wkt: string = shapeStore.shapeDef.shapeWkt;
            const id: string = layer.id;
            const areaSize: number = manager.getAreaSize(shapeStore.shapeDef.shapeObject);
            exportDrawableLayers.push({ wkt, id, areaSize });
        });
        return exportDrawableLayers;
    }

    @Method()
    public import(wktShapesArr: Array<WktShape>) {
      // Iterate all imported WktShapes
      wktShapesArr.forEach((item: WktShape) => {
        const shapeWkt: string = item.wkt;
        const id: string = item.id;
        const manager: ShapeManagerInterface | null = ShapeManagerRepository.getManagerByWkt(shapeWkt);

        if (!manager) { return; };

        const shapeObject: ShapeObject = manager.shapeWktToObject(shapeWkt);
        const data: ShapeData = {
          groupId: GENERATED_ID.DRAW_LAYER_GROUP_ID,
          id,
          name: 'Editable layer',
          isSelected: false,
          count: 1
        };

        const shapeDef: ShapeDefinition = { shapeWkt, shapeObject, data };
        const leafletRef: L.Layer | L.FeatureGroup = manager.createShape(shapeDef);
        const shapeStore: ShapeStore = { leafletRef, shapeDef };

        // Add shape to layer
        this.drawnLayer.addLayer(leafletRef);

        // Set shape events
        Utils.setEventsOnLeafletLayer(leafletRef, {
          click: Utils.shapeOnClickHandler.bind(this)
          // mouseout: () => { this.onOutShape(leafletObject, managerType); },
        });

        // register shape to store
        store.addShape(shapeStore);
      });

      // Run onEndImportDraw Callback
      const allDrawableLayers: WktShape[] = this.export();
      this.endImportDrawCB.emit(allDrawableLayers);
    }

    @Method()
    clear(): void {
        // Remove from selected objects
        this.drawnLayer.eachLayer((l: L.Layer | L.FeatureGroup) => {
            store.removeSelectedShapeById(l.id);
        })

        // Remove from shapes data
        store.removeGroup(GENERATED_ID.DRAW_LAYER_GROUP_ID);

        // Clear shapes from layer
        this.drawnLayer.clearLayers();
    }

    constructor() {
        reaction(
            () => store.state.mapConfig.distanceUnitType,
            distanceUnitType => console.log(`${this.compName} ${distanceUnitType}`)
        );
        _.noop(leafletDrawDrag);
    }

    componentWillLoad() {
        // Dedicated Draw layer
        this.drawnLayer = new L.FeatureGroup();
        // store.mapLayers.drawableLayers.push(this.drawnLayer);   // can bring leak

        let drawBarCloneOptions: any = this.config.drawBarOptions;
        drawBarCloneOptions.edit = {
            featureGroup: this.drawnLayer,
            remove: _.get(this, 'config.drawBarOptions.edit.remove', true)
        }

        var MyCustomMarker = L.Icon.extend({
            options: {
                shadowUrl: null,
                iconSize: new L.Point(33, 40),
                iconUrl: `data:image/svg+xml;utf8,${markerSvg}`
            }
        });

        // set custom marker
        if (_.get(drawBarCloneOptions, 'draw.marker')) {
            _.merge(drawBarCloneOptions.draw, {
                marker: {
                    icon: new MyCustomMarker()
                }
            });
        }

        this.control = new L.Control.Draw(drawBarCloneOptions);
    }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        this.layerManagerEl = this.gisMap.getContainer().querySelector(LAYER_MANAGER_PLUGIN_TAG);
        this.gisMap.addLayer(this.drawnLayer);
        this.layerManagerEl.addingDrawableLayerToLayerController(this.drawnLayer);  // check

        this.gisMap.addControl(this.control);
        this.gisMap.on(L.Draw.Event.CREATED, this.onDrawCreated.bind(this));
        this.gisMap.on(L.Draw.Event.EDITED, this.onDrawEdited.bind(this));
        this.gisMap.on(L.Draw.Event.DELETED, this.onDrawDeleted.bind(this));
    }

    componentDidUnload() {
        console.log(`componentDidUnload - ${this.compName}`);
        this.gisMap.removeControl(this.control);
    }

    private onDrawEdited(e: any): void {
      // Save output
      const wktList: WktShape[] = [];
      const groupIdToShapeStoreMap: GroupIdToShapeStoreMap = store.groupIdToShapeStoreMap;

      e.layers.eachLayer((layer: L.Layer) => {
        // Create shapeDef object for this layer
        const prevShapeDef: ShapeDefinition = groupIdToShapeStoreMap[layer.groupId][layer.id].shapeDef;
        const newShapeDef: ShapeDefinition = this.createShapeDefFromDrawLayer(layer, prevShapeDef.shapeObject.type);

        groupIdToShapeStoreMap[layer.groupId][layer.id].shapeDef = newShapeDef;

        // Create WktShape from layer
        const wktShape: WktShape = this.getWktShapeFromWkt(newShapeDef);
        if (wktShape) {
          wktList.push(wktShape);
        }
      });

      // Use callback of onDrawEdited
      this.onDrawEditedCB.emit(wktList);
    }

    private onDrawCreated(e: any): void {
        const layerEnumType: ShapeType = ShapeManagerRepository.getTypeNumberByDrawableTypeName(e.layerType);
        const shapeDef: ShapeDefinition = this.createShapeDefFromDrawLayer(e.layer, layerEnumType);
        const manager = ShapeManagerRepository.getManagerByType(_.get(shapeDef, 'shapeObject.type'));

        if (manager) {
          e.layer = manager.createShape(shapeDef);
        }

        // // Use callback of onDrawCreated
        const wktShape: WktShape = this.getWktShapeFromWkt(shapeDef);
        this.onDrawCreatedCB.emit(wktShape);

        // Add shape to layer
        this.drawnLayer.addLayer(e.layer);

            // Set shape events
        Utils.setEventsOnLeafletLayer(e.layer, {
            click: Utils.shapeOnClickHandler.bind(this)
            // mouseout: () => { this.onOutShape(leafletObject, managerType); },
        });

        const shapeStore: ShapeStore = {
            leafletRef: e.layer,
            shapeDef: shapeDef
        }
        store.addShape(shapeStore);
    }

    private onDrawDeleted(e: any): void {
      const wktList: WktShape[] = this.getWktShapeListFromEvent(e);
      // Use callback of onDrawDeleted
      this.onDrawDeletedCB.emit(wktList);
    }

    private getWktShapeListFromEvent(e: any) {
      const wktList: WktShape[] = [];
      e.layers.eachLayer((layer: L.Layer) => {
        const wkt: WktShape = this.createWktFromEditableLayer(layer);
        if (wkt) {
          wktList.push(wkt);
        }
      });
      return wktList;
    }

    private createWktFromEditableLayer(drawShapeLayer: L.Layer): WktShape {
      const shapeStore: ShapeStore = store.groupIdToShapeStoreMap[drawShapeLayer.groupId][drawShapeLayer.id];
      const manager: ShapeManagerInterface = ShapeManagerRepository.getManagerByShapeDefLayer(shapeStore);

      if (manager) {
        // Calculate area size
        const shapeObj: ShapeObject = manager.getShapeObjectFromDrawingLayer(drawShapeLayer);

        // Create WktShape from wkt, id, area size
        const wkt: string = manager.shapeObjectToWkt(shapeObj);
        const id: string = drawShapeLayer.id; // L.Util.stamp(drawShapeLayer);	// Get leaflet layer id
        const areaSize: number = this.calculateAreaSizeFromShapeObj(manager, shapeObj);
        return { wkt, areaSize, id };
      } else {
        console.error('Cant find shape manager by ShapeManagerRepository.getManagerByShapeDefLayer()', drawShapeLayer);
        return null;
      }
    }

    private getWktShapeFromWkt(shapeDef: ShapeDefinition): WktShape {
      const { shapeWkt, shapeObject } = shapeDef;
      const manager: ShapeManagerInterface = ShapeManagerRepository.getManagerByWkt(shapeDef.shapeWkt);

      if (manager) {
        // Create WktShape from wkt, id, area size
        const id:       string = shapeDef.data.id;	// Get leaflet layer id
        const areaSize: number = this.calculateAreaSizeFromShapeObj(manager, shapeObject);
        return { wkt: shapeWkt, areaSize, id };
      } else {
        console.error('Cant find shape manager by ShapeManagerRepository.getManagerByWkt()', shapeDef);
        return null;
      }
    }

    private calculateAreaSizeFromShapeObj(manager: ShapeManagerInterface, shapeObj: ShapeObject): number {
      const areaSize = manager.getAreaSize(shapeObj);
      return areaSize || 0;
    }


    private createShapeDefFromDrawLayer(layer: L.Layer, shapeType: ShapeType): ShapeDefinition {
        const manager: ShapeManagerInterface = ShapeManagerRepository.getManagerByType(shapeType);
        if (!manager) { return null; }

        // Calculate area size
        const shapeObject: ShapeObject = manager.getShapeObjectFromDrawingLayer(layer);

        // Create WktShape from wkt, id, area size
        const shapeWkt: string = manager.shapeObjectToWkt(shapeObject);
        const shapeData: ShapeData = {
            groupId: GENERATED_ID.DRAW_LAYER_GROUP_ID,
            id: layer.id || drawIdGenerator.newId(),
            name: 'Editable layer',
            isSelected: false,
            count: 1,
            type: manager.getType() === ShapeType.MARKER ? 'marker' : undefined
        };
        return { shapeObject, shapeWkt, data: shapeData };
    }
}
