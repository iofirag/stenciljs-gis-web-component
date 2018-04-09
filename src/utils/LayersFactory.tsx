import L from 'leaflet';
// Leaflet Heat-Map
import 'leaflet.heat';

// Leaflet Marker-Cluster
// import 'leaflet.markercluster/dist/MarkerCluster.css';	// commented out
// import 'leaflet.markercluster/dist/MarkerCluster.Default.css';	// commented out
import 'leaflet.markercluster';

import _ from 'lodash';
import { ShapeLayerDefinition, Coordinate, ClusterOptions, ShapeLayerContainer_Dev } from '../models';
import { ShapeManagerInterface } from './shapes/ShapeManager';
import { MIN_OPACITY } from './statics';
import { ShapeManagerRepository } from './shapes/ShapeManagerRepository';
import store from '../components/store/store';
// import Utils from './utilities';
// import Utils from './utilities';

export const HEAT_LAYER    = 'Heat Layer';
export const CLUSTER_LAYER = 'Cluster Layer';

export default class LayersFactory {
	public static defaultClusterOptions: any = {
		singleMarkerMode: false,
		// disableClusteringAtZoom: 13,
		chunkedLoading: true,
		// chunkProgress: LayersCreatorComp.updateProgressBar,
		iconCreateFunction: LayersFactory.iconCreateFunction,
	};

	public static createHeatAndClusterLayer(shapeLayerDef: ShapeLayerDefinition): ShapeLayerContainer_Dev  {
		// Utils.doNothing(context)
		const layerContainer: ShapeLayerContainer_Dev = {
		  	layerDefinition: shapeLayerDef,
		    leafletHeatLayer: null,
		    leafletClusterLayer: null,
			isDisplay: _.get(shapeLayerDef, 'isDisplay', true)
		};

		if (!_.get(shapeLayerDef,'shapes.length')) { return layerContainer; };

		layerContainer.leafletHeatLayer = LayersFactory.createHeatLayer(shapeLayerDef); // will be added later
		layerContainer.leafletClusterLayer = LayersFactory.createClusterLayer(shapeLayerDef, layerContainer.isDisplay); // will be added later
		return layerContainer;
	}

	public static createHeatLayer(layer: ShapeLayerDefinition): L.HeatLayer {
		let heatLayerGroup: L.HeatLayer = null;
		const coordinateList: Coordinate[] = [];

		for (const shapeDef of layer.shapes) {
			// Iterate all shapes in this layer (some object types)
			const manager: ShapeManagerInterface | null = ShapeManagerRepository.getManagerByShapeDefinition(shapeDef);

			if (manager) {
				// Fix missing wkt flow
				if (shapeDef.shapeObject && !shapeDef.shapeWkt) {
					shapeDef.shapeWkt = manager.shapeObjectToWkt(shapeDef.shapeObject, shapeDef.options);
				}

				// Fix missing shapeObject flow
				if (!shapeDef.shapeObject && shapeDef.shapeWkt) {
					shapeDef.shapeObject = manager.shapeWktToObject(shapeDef.shapeWkt);
				}
				const coords: Coordinate = manager.getHeatLayerPoints(shapeDef.shapeObject);

				if (coords) {
					coordinateList.push(coords);
				}
			}
		}

		if (coordinateList.length) {
			heatLayerGroup = _createHeatLayerByCoordinates(coordinateList);
		}
		return heatLayerGroup;

		function _createHeatLayerByCoordinates(heatData: Coordinate[]): L.HeatLayer {
			return new L.HeatLayer(heatData, { minOpacity: MIN_OPACITY });
		}
	}

	public static createClusterLayer(layer: ShapeLayerDefinition, isDisplay: boolean): L.MarkerClusterGroup {
		let clusterLayer: L.MarkerClusterGroup = null;
		const clusterOptions: ClusterOptions = _.get(store,'state.mapConfig.clusterOptions', {});
		const {
			singleMarkerMode,
			// disableClusteringAtZoom,
			chunkedLoading,
			chunkProgress
		} = clusterOptions;

		const clusterOptions_Dev: ClusterOptions_Dev = {
			singleMarkerMode: singleMarkerMode || LayersFactory.defaultClusterOptions.singleMarkerMode,
			// disableClusteringAtZoom: disableClusteringAtZoom || LayersCreatorComp.defaultClusterOptions.disableClusteringAtZoom,
			chunkedLoading: chunkedLoading || LayersFactory.defaultClusterOptions.chunkedLoading,
			iconCreateFunction: LayersFactory.defaultClusterOptions.iconCreateFunction
		};

		// clusterOptions_Dev.disableClusteringAtZoom = LayersCreatorComp.defaultClusterOptions.disableClusteringAtZoom;

		if (chunkProgress) {
			_.assign(clusterOptions_Dev, { chunkProgress: LayersFactory.defaultClusterOptions.chunkProgress });
		}

		// Create cluster layer
		clusterLayer = new L.MarkerClusterGroup(clusterOptions_Dev);

		// Copy shapes
		const layerShapesCloned = layer.shapes;

		for (const shapeDef of layerShapesCloned) {
			shapeDef.options = shapeDef.options || {};
			// Iterate all shapes in this layer (some object types)
			const manager: ShapeManagerInterface | null = ShapeManagerRepository.getManagerByShapeDefinition(shapeDef);

			if (manager) {
				console.log(isDisplay)
				// const managerType = manager.getType();
				// const { id/* , groupId */ } = shapeDef.data;
				const leafletObject: L.Layer | L.FeatureGroup = manager.addShapeToLayer(shapeDef, clusterLayer);
				console.log(leafletObject)
				// clusterLayer.addLayer()

				// Utils.setEventsOnLeafletLayer(leafletObject, {
				// 	click: Utils.shapeOnClickHandler.bind(this, manager, context),
				// 	mouseover: context.props.onFetchDataByShapeId ? (e) => { this.onHoverShapeHandler(e, context, id, groupId, leafletObject); } :  (e) => {this.shapeHoverTooltipHandler(e); },
				// 	mouseout: () => { this.onOutShape(leafletObject, managerType); },
				// });	// Add events

				// if (isDisplay) {
				// 	// Layer should be displayed
				// 	const isSelected: boolean = _.get(shapeDef, 'data.isSelected');
				// 	const layerId: string = String(L.Util.stamp(leafletObject));	// Get leaflet layer id

				// 	if (isSelected) {
				// 		// Selected Object
				// 		// Add leaflet id to selected object list
				// 		context.selectedLeafletObjects[layerId] = leafletObject;
				// 		// Select layer if need
				// 		manager.updateIsSelectedView(leafletObject);
				// 	} else {
				// 		delete context.selectedLeafletObjects[layerId] ;
				// 	}
				// }
				// // Create bubble
				// Utils.createBubble(leafletObject, BUBBLE_TYPE.TOOLTIP);

				// leafletObject.layerName = layer.layerName;	// For Exporting layer name of this object
			}
		}

		// clusterLayer.on('animationend', (e: any) => {
		// 	// fix for selected cluters that don't need to be selected;
		// 	const currentClusterLayers = e.target._featureGroup.getLayers();
		// 	const clusters: any = context.map.getContainer().querySelectorAll('.selected-cluster') || [];
		// 	clusters.forEach((cluster: any) => cluster.classList.remove('selected-cluster'));

		// 	Utils.selectClustersBySelectedLeafletObjects(context.selectedLeafletObjects);

		// 	// update shapes select view
		// 	_.forEach(currentClusterLayers, (layer: any) => {
		// 		if (layer.shapeDef) {
		// 			const shapeType: ShapeType = _.get(layer, 'shapeDef.shapeObject.type');
		// 			const manager: ShapeManagerInterface = ShapeManagerRepository.getManagerByType(shapeType);

		// 			manager.updateIsSelectedView(layer);
		// 		}
		// 	});
		// });

		// clusterLayer.on('clusterclick', (e: any) => {
		// 	if (!e.originalEvent.ctrlKey || context.props.isSelectionDisable === true) { return; }

		// 	// Update isSelected view
		// 	const selectedLayersShapeDef: ShapeDefinition[] = [];
		// 	const isClusterSelected = e.layer.options.icon._icon.classList.contains('selected-cluster');

		// 	// if (e.originalEvent.ctrlKey) {
		// 	const markersInsideCluster: any = e.layer.getAllChildMarkers();

		// 	markersInsideCluster.forEach((layer: any) => {
		// 		const manager: ShapeManagerInterface = ShapeManagerRepository.getManagerByType(layer.shapeDef.shapeObject.type);
		// 		if (!isClusterSelected) {
		// 			layer.shapeDef.data.isSelected = true;
		// 			selectedLayersShapeDef.push(layer.shapeDef);
		// 		} else {
		// 			if (layer.shapeDef.data.isSelected) {
		// 				layer.shapeDef.data.isSelected = false;
		// 				layer.shapeDef.data.isSelectedFade = false;
		// 				selectedLayersShapeDef.push(layer.shapeDef);
		// 			}
		// 		}

		// 		manager.selectShape(context, layer);
		// 		// Utils.updateBubble(layer);
		// 		setTimeout(()=> {
		// 			manager.updateIsSelectedView(layer);
		// 		}, 0);
		// 	});
		// 	// }
		// 	context.props.onSelectionDone(selectedLayersShapeDef);
		// });

		return clusterLayer;
	}

	// public static updateProgressBar(processed: number, total: number, elapsed: number, layersArray?: any[]) {
	// 	var progress = document.getElementById('progress');
	// 	var progressBar = document.getElementById('progress-bar');

	// 	if (!progress || !progressBar) { return; }

	// 	if (elapsed > 1000) {
	// 		// if it takes more than a second to load, display the progress bar:
	// 		progress.style.display = 'block';
	// 		progressBar.style.width = Math.round(processed / total * 100) + '%';
	// 	}
	// 	if (processed === total) {
	// 		// all markers processed - hide the progress bar:
	// 		progress.style.display = 'none';
	// 	}
	// }

	public static iconCreateFunction(cluster: L.MarkerClusterGroup): any {
		const numberWithCommas = (x: number) => {
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		};
		// iterate all markers and count
		const childrenList = cluster.getAllChildMarkers();
		let weight = 0;
		let isClusterSelected = false;

		childrenList.forEach((leafletLayer: any) => {
			const isSelected = leafletLayer.shapeDef.data.isSelected;
			if (!isClusterSelected && isSelected) {
				isClusterSelected = isSelected;
			}
			const count: number = _.get(leafletLayer, 'shapeDef.data.count');
			weight += (count || 1);
		});

		// const size: string = (weight < 10) ? 'small' : ((weight < 100)
		// 	? 'medium'
		// 	: 'large');

		const selectedClusterClass = isClusterSelected ? 'selected-cluster' : '';
		// create the icon with the "weight" count, instead of marker count
		return L.divIcon({
			html: `<div><span>${numberWithCommas(weight)}</span></div>`,
			className: `marker-cluster ${selectedClusterClass}`, // marker-cluster-${size}`
			iconSize: new L.Point(32, 32)
		});
	}

	// private static onOutShape(leafletObject: any, shapeType?: number) {
	// 	if (shapeType !== ShapeType.MARKER) { return; }

	// 	_.forIn(leafletObject.shapeDef.data, (value: string, key: string, obj: any) => {
	// 		if (!ShapeDefExcludeDefalutKeys.includes(key)) {
	// 			delete obj[key];
	// 		}
	// 	});

	// 	// reset bubble (tooltip)
	// 	// Utils.updateBubble(leafletObject);
	// }

	// private static async onHoverPOI(context: GisPluginContext, id: string, groupId: string, leafletObject?: any) {
	// 	if (id === undefined) { return; }
	// 	const data = await context.props.onFetchDataByShapeId(id);

	// 	_.merge(leafletObject.shapeDef.data, data);

	// 	Utils.updateBubble(leafletObject);
	// }

	// private static onHoverShapeHandler(event: any, context: GisPluginContext, id: string, groupId: string, leafletObject?: any) {
	// 	if (!event.originalEvent.ctrlKey) {
	// 		this.onHoverPOI(context, id, groupId, leafletObject);
	// 	}

	// 	this.shapeHoverTooltipHandler(event);
	// }

	// private static shapeHoverTooltipHandler(event: any) {
	// 	if (event.originalEvent.ctrlKey || event.originalEvent.shiftKey) {
	// 		// event.target.closeTooltip();
	// 		event.target._tooltip._container.style.display = 'none';
	// 	} else  {
	// 		// check if tooltip is display on the map
	// 		if (event.target.getTooltip()._container) {
	// 			event.target.getTooltip()._container.style.removeProperty('display');
	// 		}
	// 	}
	// }
}

export type ClusterOptions_Dev = ClusterOptions & {
	iconCreateFunction?: Function; // (cluster: LPlus.MarkerClusterGroup) => any;
	chunkProgress?: Function; // (processed: number, total: number, elapsed: number, layersArray?: any[]) => void;
};
