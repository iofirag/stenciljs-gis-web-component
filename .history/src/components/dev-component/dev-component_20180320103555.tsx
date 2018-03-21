import { Component, State } from "@stencil/core";
import {
  GisViewerProps,
  TileLayerDefinition,
  ShapeLayerDefinition,
  LayerManagerConfig,
  ScaleConfig,
  SearchConfig,
  MiniMapConfig,
  DrawBarConfig,
  MouseCoordinateConfig,
  MeasureConfig,
  ZoomToExtentConfig,
  UnitsChangerConfig,
  MapPluginsConfig,
  ToolbarConfig,
  FullScreenConfig,
  MapConfig,
} from "../../models/apiModels";
import { GIS_VIEWER_TAG } from "../../utils/statics";

@Component({
  tag: "dev-component",
  styleUrl: "dev-component.scss"
})
export class DevComponent {
  gisViewerEl: HTMLGisViewerElement;
  @State() gisViewerState: GisViewerProps;

  //document.querySelector('gis-viewer').addEventListener('drawCreated', (e) => { console.log(e.detail) })
  // @Listen('mapReady') mapReadyEventHandler(e: CustomEvent) {
  //     console.log('Received the custom mapReady event', e);
  // }
  // @Listen('moveEnd') moveEndEventHandler(e: CustomEvent) {
  //     console.log('Received the custom moveEnd event:', e.detail);
  // }
  // @Listen('drawCreated') drawCreatedEventHandler(e: CustomEvent) {
  //     console.log(e.detail)
  // }
  // @Listen('drawEdited') drawEditedEventHandler(e: CustomEvent) {
  //     console.log(e.detail)
  // }
  // @Listen('drawDeleted') drawDeletedEventHandler(e: CustomEvent) {
  //     console.log(e.detail)
  // }
  // @Listen('endImportDraw') endImportDrawEventHandler(e: CustomEvent) {
  //     console.log(e.detail)
  // }
  // @Listen('selectionDone') selectionDoneEventHandler(e: CustomEvent) {
  //     console.log(e.detail)
  // }
  // @Listen('boundsChanged') boundsChangedEventHandler(e: CustomEvent) {
  //     console.log(e.detail)
  // }

  componentWillLoad() {
    this.gisViewerState = this.createDevState();
  }
  render() {
    return <div class="dev-components">
      <div class="header">
        <header title="This is a GIS Viewer component Application" />
      </div>
      <div class="body">
        <div class="sideMenu">
          <input type="button" value="Zoom To Extend" onClick={e => this.testZoomToExtend(e)} />
          <input type="button" value="Change Units distance" onClick={e => this.testChangeDistanceUnits(e)} />
          <input type="button" value="Change Coordinate System" onClick={e => this.testChangeCoordinateSystem(e)} />
          {/* <input type="button" value="" onClick={() => {}} /> */}

          {/* <RaisedButton label="Export draw" primary={true} onClick={this.testExportDraw} />
                      <RaisedButton label="Import user draw" primary={true} onClick={this.testImportUserDraw} />
                      <RaisedButton label="Clear draws" primary={true} onClick={this.testClearDraws} />
                      <RaisedButton label="Export bounds" primary={true} onClick={this.testExportBounds} />
                      <RaisedButton label="test Export CSV" primary={true} onClick={this.testExportCSV} />
                      <RaisedButton label="Get Selected Shapes" primary={true} onClick={this.testGetAllSelectedShape} />
                      <RaisedButton label="Get Drawable Multipolygon wkt" primary={true} onClick={this.testGetMultiPolygon} />
                      <RaisedButton label="Select shape by id" primary={true} onClick={this.testSelectShapeById} />
                      <RaisedButton label="Zoom to extend" primary={true} onClick={this.testZoomToExtend} />
                      <RaisedButton label="Export image" primary={true} onClick={this.testExportImage} />
                      <RaisedButton label="Export KML" primary={true} onClick={this.exportKmlCMD} />
                      <RaisedButton label="Add shape" primary={true} onClick={this.addShape} />
                      <input type="file" id="fileInput" onChange={this.testImportKmlFormatByStringCMD} accept={ImportFileFormats} /> */}

          {/* <input type="button" value="" onClick={() => {}} /> */}
        </div>
        <div class="gisWrapper">
          <gis-viewer gisViewerProps={this.gisViewerState} />
        </div>
      </div>
    </div>;
  }
  componentDidLoad() {
    this.gisViewerEl = document.querySelector(GIS_VIEWER_TAG);
    // this.gisViewerEl.addEventListener('moveEnd', (ev: any) => {
    //     console.log(ev.detail);
    // });
    // this.gisViewerEl.addEventListener('mapReady', (ev) => {
    //     console.log(ev, this);
    //     // ev.detail contains the data passed out from the component
    //     // Handle event here...
    // });
  }

  // @Event
  testZoomToExtend(e: UIEvent) {
    console.log("Testing zoomToExtent command", e.type);
    this.gisViewerEl.zoomToExtent();
  }
  testChangeDistanceUnits(e: UIEvent) {
    console.log("Testing ChangeDistanceUnits command", e.type);    
    this.gisViewerEl.changeDistanceUnits();
  }
  testChangeCoordinateSystem(e: UIEvent) {
    console.log("Testing changeCoordinateSystem command", e.type);
    this.gisViewerEl.changeCoordinateSystem();
  }

  createDevState(): GisViewerProps {
    const protocol: string = "http:";

    const mapConfig: MapConfig = {
      isZoomToExtentOnNewData: true,
      isWheelZoomOnlyAfterClick: true,
      isZoomControl: true,
      isFlyToBounds: true,
      isExport: true,
      clusterOptions: {
        // disableClusteringAtZoom: 13,
        // chunkedLoading: true,
        // chunkProgress: true,
        // singleMarkerMode: false
      },
      mode: "cluster",
      distanceUnitType: 'km',
      coordinateSystemType: 'gps',
    };

    const tileLayers: TileLayerDefinition[] = [
      {
        name: "Online Map",
        tilesURI: "http://{s}.tile.osm.org/{z}/{x}/{y}.png", // protocol + '//osm/osm_tiles/{z}/{x}/{y}.png', // 'http://{s}.tile.osm.org/{z}/{x}/{y}.png', // 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', // 'http://10.164.39.38/pandonia/{z}/{x}/{y}.png',
        // zoom: 1,
        // center: {
        // 	lat:0,
        // 	lng: 0
        // },
        minZoom: 1,
        maxZoom: 18,
        attributionControl: false
        // zoomControl: false
      },
      {
        name: "Verint Map",
        tilesURI: protocol + "//osm/osm_tiles/{z}/{x}/{y}.png", // 'http://{s}.tile.osm.org/{z}/{x}/{y}.png', // 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', // 'http://10.164.39.38/pandonia/{z}/{x}/{y}.png',
        // zoom: 1,
        // center: {
        // 	lat: 32.076304,
        // 	lng: 35.013960
        // },
        minZoom: 1,
        maxZoom: 20,
        attributionControl: false
        // zoomControl: false
      }
    ];

    const shapeLayers: ShapeLayerDefinition[] = [
      {
        layerName: "Test data 1",
        // isDisplay: false,
        shapes: [
          {
            shapeWkt:
              "POLYGON((-14.765625 17.052584352706003,-12.83203125 15.703433338617463,-15.99609375 15.534142999890243,-14.765625 17.052584352706003))",
            data: {
              name: "232 (known as polygon1)",
              id: "polygon1"
            }
          },
          {
            shapeWkt: "POLYGON((0 0 0,0 5 0,5 5 0,5 0 0,0 0 0))",
            data: {
              name: "232 (known as polygon1)",
              id: "polygon1"
            }
          },
          {
            shapeWkt: "LINESTRING(1 1 1,5 5 5,7 7 5)",
            data: {
              name: "232 (known as polygon1)",
              id: "polygon1"
            }
          }
        ]
      }
    ];

    const layerManagerConfig: LayerManagerConfig = {
      enable: true,
      isImport:true
    };

    const scaleControlConfig: ScaleConfig = {
      enable: true,
      scaleOptions: {
        position: "bottomright"
      }
    };

    const searchBoxConfig: SearchConfig = {
      enable: true,
      searchOptions: {
        searchOnLayer: true,
        queryServerUrl: protocol + "//osm/nominatim?format=json&limit=3&type=administrative&q={s}" // 'http://10.164.39.38/nominatim/search.php?format=json&q={s}' // 'http://nominatim.openstreetmap.org/search?format=json&q={s}' // 'http://nominatim.openstreetmap.org/search?format=json&q={s}'
      }
    };

    const miniMapConfig: MiniMapConfig = {
      enable: true,
      miniMapOptions: {
        toggleDisplay: true
      }
    };

    const zoomControlConfig: ZoomConfig = {
      enable: true
    };

    const drawBarConfig: DrawBarConfig = {
      enable: true,
      drawBarOptions: {
        draw: {
          polyline: true,
          polygon: true, // Turns off this drawing tool
          circle: true, // Turns off this drawing tool
          rectangle: true, // Turns off this drawing tool
          marker: true, // Turns off this drawing tool
          // circlemarker: false,
          // textualMarker: false // Turns off this drawing tool
        },
        edit: {
          remove: true // Turns on remove button
        }
      }
    };

    const mouseCoordinateConfig: MouseCoordinateConfig = {
      enable: true,
    };

    const measureConfig: MeasureConfig = {
      enable: true,
      measureOptions: {
        // showMeasurementsClearControl: true,
        // clearMeasurementsOnStop: false
      }
    };

    const zoomToExtentConfig: ZoomToExtentConfig = {
      enable: true,
      zoomToExtentOptions: {
        position: "topright"
      }
    };

    const unitsChangerConfig: UnitsChangerConfig = {
      enable: true
    };
    const fullScreenConfig: FullScreenConfig = {
      enable: true
    }
    



    const toolbarConfig: ToolbarConfig = { 
      isImportExport: true,
      isToolbarSettings: true,
      toolbarPluginsConfig: {
        layerManagerConfig, fullScreenConfig, measureConfig,
        unitsChangerConfig, zoomControlConfig, zoomToExtentConfig,
        drawBarConfig, searchBoxConfig
      }

    }
    const mapPluginsConfig: MapPluginsConfig = {
      miniMapConfig, scaleControlConfig, mouseCoordinateConfig
    }
    
    return {
      tileLayers,
      mapConfig,
      shapeLayers,

      toolbarConfig,
      mapPluginsConfig,

      //   onMapReady: this.onMapReadyCB.bind(this),
      //   onDrawEdited: this.drawEditedCB.bind(this),
      //   onDrawCreated: this.drawCreatedCB.bind(this),
      //   onSaveKmlBlob: this.onSaveKmlFormatCB.bind(this),
      //   onSaveCsvBlob: this.onSaveCsvFormatCB.bind(this),
      //   onDrawDeleted: this.drawDeletedCB.bind(this),
      //   onSaveShpBlob: this.onSaveShpFormatCB.bind(this),
      //   onSelectionDone: this.onSelectionDoneCB.bind(this),
      //   onBoundsChanged: this.onBoundsChangedCB.bind(this),
      //   onEndImportDraw: this.endImportDrawCB.bind(this),
      //   onChangeMapMode: this.changeMapModeCD.bind(this),
      //   onFetchDataByShapeId: this.fetchDataByShapeIdCB.bind(this)
    };
  }
}
