import * as leafletDraw from 'leaflet-draw';
import L from "leaflet";
import { DRAW_BAR_PLUGIN_TAG, LAYER_MANAGER_PLUGIN_TAG } from "../../../../../utils/statics";
import Utils from "../../../../../utils/utilities";
import _ from "lodash";
import store from "../../../../store/store";
import { reaction } from "mobx";
import { ShapeManagerRepository } from "../../../../../utils/shapes/ShapeManagerRepository";
import Generator from 'id-generator';
const drawIdGenerator = new Generator(() => { return 'draw_layer'; });
export class DrawBarPlugin {
    constructor() {
        this.compName = DRAW_BAR_PLUGIN_TAG;
        reaction(() => store.state.mapConfig.distanceUnitType, distanceUnitType => console.log(`${this.compName} ${distanceUnitType}`));
    }
    getControl() {
        return this.control;
    }
    componentWillLoad() {
        // Dedicated Draw layer
        this.drawnLayer = new L.FeatureGroup();
        store.mapLayers.drawableLayers.push(this.drawnLayer); // can bring leak
        let drawBarCloneOptions = this.config.drawBarOptions;
        drawBarCloneOptions.edit = {
            featureGroup: this.drawnLayer,
            remove: _.get(this, 'config.drawBarOptions.edit.remove', true)
        };
        this.control = new L.Control.Draw(drawBarCloneOptions);
    }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        this.layerManagerEl = this.gisMap.getContainer().querySelector(LAYER_MANAGER_PLUGIN_TAG);
        this.gisMap.addLayer(this.drawnLayer);
        this.layerManagerEl.addingDrawableLayerToLayerController(this.drawnLayer); // check
        Utils.doNothing(leafletDraw);
        this.gisMap.addControl(this.control);
        this.gisMap.on(L.Draw.Event.CREATED, this.onDrawCreated.bind(this));
        this.gisMap.on(L.Draw.Event.EDITED, ( /* e: any */) => {
            // this.drawnLayer.addLayer(e.layer);
        });
        this.gisMap.on(L.Draw.Event.DELETED, ( /* e: any */) => {
            // this.drawnLayer.addLayer(e.layer);
        });
    }
    componentDidUnload() {
        console.log(`componentDidUnload - ${this.compName}`);
        this.gisMap.removeControl(this.control);
    }
    onDrawCreated(e) {
        const layerEnumType = ShapeManagerRepository.getTypeNumberByDrawableTypeName(e.layerType);
        const shapeDef = this.createShapeDefFromDrawLayer(e.layer, layerEnumType);
        // Add shapeDef to layer
        // e.layer = this.addShapeDefToLayer(e.layer, shapeDef) as L.FeatureGroup;
        // // Event handler
        // this.drawEventHandler(e);
        // // Use callback of onDrawCreated
        // const wktShape: WktShape = this.getWktShapeFromWkt(e.layer);
        // this.context.props.onDrawCreated(wktShape);
        // Add shape to layer
        this.drawnLayer.addLayer(e.layer);
        ///////////
        const shapeStore = {
            leafletRef: e.layer,
            shapeDef: shapeDef
        };
        store.addShape(shapeStore);
    }
    createShapeDefFromDrawLayer(layer, shapeType) {
        const manager = ShapeManagerRepository.getManagerByType(shapeType);
        if (!manager) {
            return null;
        }
        // Calculate area size
        const shapeObject = manager.getShapeObjectFromDrawingLayer(layer);
        // Create WktShape from wkt, id, area size
        const shapeWkt = manager.shapeObjectToWkt(shapeObject);
        const shapeData = {
            groupId: 'draw_group',
            id: drawIdGenerator.newId(),
            name: 'Editable layer',
            isSelected: false,
            count: 1,
            type: 'marker'
        };
        return { shapeObject, shapeWkt, data: shapeData };
    }
    static get is() { return "draw-bar-plugin"; }
    static get properties() { return { "config": { "type": "Any", "attr": "config" }, "control": { "state": true }, "drawnLayer": { "state": true }, "getControl": { "method": true }, "gisMap": { "type": "Any", "attr": "gis-map" } }; }
    static get style() { return "/**style-placeholder:draw-bar-plugin:**/"; }
}
