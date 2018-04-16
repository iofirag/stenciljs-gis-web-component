import { Component, Prop, State, Method } from "@stencil/core";
import { DrawBarConfig, ShapeStore, ShapeType, ShapeDefinition, ShapeData, ShapeObject } from "../../../../../models";
import * as leafletDraw from 'leaflet-draw';
import L from "leaflet";
import { DRAW_BAR_PLUGIN_TAG, LAYER_MANAGER_PLUGIN_TAG } from "../../../../../utils/statics";
import Utils from "../../../../../utils/utilities";
import _ from "lodash";
import store from "../../../../store/store";
import { reaction } from "mobx";
import { ShapeManagerRepository } from "../../../../../utils/shapes/ShapeManagerRepository";
import { ShapeManagerInterface } from "../../../../../utils/shapes/ShapeManager";
import Generator from 'id-generator';
const drawIdGenerator = new Generator(() => { return 'draw_layer' })

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

    @State() control: L.Control;
    @State() drawnLayer: L.FeatureGroup;
    layerManagerEl: HTMLLayerManagerPluginElement;

    @Method()
    getControl(): L.Control {
        return this.control;
    }

    constructor() {
        reaction(
            () => store.state.mapConfig.distanceUnitType,
            distanceUnitType => console.log(`${this.compName} ${distanceUnitType}`)
        );
    }
    
    componentWillLoad() {
        // Dedicated Draw layer
        this.drawnLayer = new L.FeatureGroup();
        store.mapLayers.drawableLayers.push(this.drawnLayer);   // can bring leak

        let drawBarCloneOptions: any = this.config.drawBarOptions;
        drawBarCloneOptions.edit = {
            featureGroup: this.drawnLayer,
            remove: _.get(this, 'config.drawBarOptions.edit.remove', true)
        }
        this.control = new L.Control.Draw(drawBarCloneOptions);
    }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        this.layerManagerEl = this.gisMap.getContainer().querySelector(LAYER_MANAGER_PLUGIN_TAG);
        this.layerManagerEl.addingDrawableLayerToLayerController(this.drawnLayer);
        Utils.doNothing(leafletDraw);
        
        this.gisMap.addLayer(this.drawnLayer);
        this.gisMap.addControl(this.control);
        


        this.gisMap.on(L.Draw.Event.CREATED, this.onDrawCreated.bind(this));
        this.gisMap.on(L.Draw.Event.EDITED, (/* e: any */) => {
            // this.drawnLayer.addLayer(e.layer);
        });
        this.gisMap.on(L.Draw.Event.DELETED, (/* e: any */) => {
            // this.drawnLayer.addLayer(e.layer);
        });
    }

    componentDidUnload() {
        console.log(`componentDidUnload - ${this.compName}`);
        this.gisMap.removeControl(this.control);
    }

    private onDrawCreated(e: any): void {
        
        const layerEnumType: ShapeType = ShapeManagerRepository.getTypeNumberByDrawableTypeName(e.layerType);
        const shapeDef: ShapeDefinition = this.createShapeDefFromDrawLayer(e.layer, layerEnumType);

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
        const shapeStore: ShapeStore = {
            leafletRef: e.layer,
            shapeDef: shapeDef
        }
        store.addShape(shapeStore);
    }
    private createShapeDefFromDrawLayer(layer: L.Layer, shapeType: ShapeType): ShapeDefinition {
        const manager: ShapeManagerInterface = ShapeManagerRepository.getManagerByType(shapeType);
        if (!manager) { return null; }

        // Calculate area size
        const shapeObject: ShapeObject = manager.getShapeObjectFromDrawingLayer(layer);

        // Create WktShape from wkt, id, area size
        const shapeWkt: string = manager.shapeObjectToWkt(shapeObject);
        const shapeData: ShapeData = {
            groupId: 'draw_group',
            id: drawIdGenerator.newId(),
            name: 'Editable layer', 
            isSelected: false, 
            count: 1, 
            type: 'marker'     
        };
        return { shapeObject, shapeWkt, data: shapeData };
    }
}