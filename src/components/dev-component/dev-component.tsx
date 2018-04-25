import { Component, State } from '@stencil/core';
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
} from '../../models';
import { GIS_VIEWER_TAG } from '../../utils/statics';

@Component({
  tag: 'dev-component',
  styleUrl: 'dev-component.scss'
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
    return <div class='dev-components'>
      <div class='header'>
        <header title='This is a GIS Viewer component Application' />
      </div>
      <div class='body'>
        <div class='sideMenu'>
          <input type='button' value='Zoom To Extend' onClick={e => this.testZoomToExtend(e)} />
          <input type='button' value='Change Units distance' onClick={e => this.testChangeDistanceUnits(e)} />
          <input type='button' value='Change Coordinate System' onClick={e => this.testChangeCoordinateSystem(e)} />
          <input type='button' value='Add shape in props' onClick={e => this.testAddShapeInProps(e)} />
          <input type='button' value='Export image' onClick={ _ => this.testExportImage()} />
          <input type='button' value='Get bounds' onClick={ _ => this.testExportBounds()} />
          <input type='button' value='Remove Highlight' onClick={ _ => this.testRemoveHighlightPOIs()} />
          <input type='button' value='Get All Selected Shapes' onClick={ _ => this.testGetAllSelectedShape()} />
          <input type='button' value='Toggle Shape Selection' onClick={ _ => this.testToggleShapeSelectionById()} />
          <input type='button' value='Highlight Group' onClick={ _ => this.testHighlightPOIsByGroupId()} />
          {/* <input type='button' value='' onClick={() => {}} /> */}

          {/* <RaisedButton label='Export draw' primary={true} onClick={this.testExportDraw} />
                      <RaisedButton label='Import user draw' primary={true} onClick={this.testImportUserDraw} />
                      <RaisedButton label='Clear draws' primary={true} onClick={this.testClearDraws} />
                      <RaisedButton label='Export bounds' primary={true} onClick={this.testExportBounds} />
                      <RaisedButton label='test Export CSV' primary={true} onClick={this.testExportCSV} />
                      <RaisedButton label='Get Selected Shapes' primary={true} onClick={this.testGetAllSelectedShape} />
                      <RaisedButton label='Get Drawable Multipolygon wkt' primary={true} onClick={this.testGetMultiPolygon} />
                      <RaisedButton label='Select shape by id' primary={true} onClick={this.testSelectShapeById} />
                      <RaisedButton label='Zoom to extend' primary={true} onClick={this.testZoomToExtend} />
                      <RaisedButton label='Export image' primary={true} onClick={this.testExportImage} />
                      <RaisedButton label='Export KML' primary={true} onClick={this.exportKmlCMD} />
                      <RaisedButton label='Add shape' primary={true} onClick={this.addShape} />
                      <input type='file' id='fileInput' onChange={this.testImportKmlFormatByStringCMD} accept={ImportFileFormats} /> */}

          {/* <input type='button' value='' onClick={() => {}} /> */}
        </div>
        <div class='gisWrapper'>
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

  testHighlightPOIsByGroupId(): void {
    this.gisViewerEl.highlightPOIsByGroupId('cell1');
  }

  testToggleShapeSelectionById(): void {
    this.gisViewerEl.toggleShapeSelectionById([{id: 'cell1coverage', isSelected: true}, {groupId: 'group0', isSelected: false}]);
  }

  testGetAllSelectedShape(): void {
		console.log('Selected Shapes: ', this.gisViewerEl.getSelectedShapes());
  }

  testRemoveHighlightPOIs() {
		this.gisViewerEl.removeHighlightPOIs();
	}

  testExportBounds(): void {
		console.log(this.gisViewerEl.getBounds());
  }

  testZoomToExtend(e: UIEvent) {
    console.log('Testing zoomToExtent command', e.type);
    this.gisViewerEl.zoomToExtent();
  }
  testChangeDistanceUnits(e: UIEvent) {
    console.log('Testing ChangeDistanceUnits command', e.type);
    this.gisViewerEl.changeDistanceUnits();
  }

	testExportImage(): void {
		this.gisViewerEl.exportMapImage().then((canvasObj: any) => {
			const img = document.createElement('img');
			img.src = canvasObj.toDataURL('image/png');
			document.body.appendChild(img);
		}).catch((ex: any) => {
			console.error("Error retrieving image data url", ex);
		});
	}

  testChangeCoordinateSystem(e: UIEvent) {
    console.log('Testing changeCoordinateSystem command', e.type);
    this.gisViewerEl.changeCoordinateSystem();
  }
  testAddShapeInProps(e: UIEvent) {
    console.log('Testing testChangeCoordinateSystemInProps command', e.type);
    this.gisViewerState.shapeLayers[0].shapes.push({
      shapeWkt: 'POLYGON((-14.765625 17.052584352706003,-12.83203125 15.703433338617463,-15.99609375 15.534142999890243,-14.765625 17.052584352706003))',
      data: {
        name: '232 (known as polygon1)',
        id: 'polygon999999'
      }
    })
    this.gisViewerState = { ...this.gisViewerState };
  }




  createDevState(): GisViewerProps {

    const mapConfig: MapConfig = {
      isZoomToExtentOnNewData: true,
      isWheelZoomOnlyAfterClick: true,
      isZoomControl: true,
      isFlyToBounds: true,
      isSelectionDisable: false,
      // isExport: true,
      clusterOptions: {
        // disableClusteringAtZoom: 13,
        // chunkedLoading: true,
        // chunkProgress: true,
        // singleMarkerMode: false
      },
      mode: 'cluster',
      distanceUnitType: 'km',
      coordinateSystemType: 'gps',
    };

    const protocol = 'http:';
    const tileLayers: TileLayerDefinition[] = [
      {
        name: 'Verint Map',
        tilesURI: protocol + '//osm/osm_tiles/{z}/{x}/{y}.png', // 'http://{s}.tile.osm.org/{z}/{x}/{y}.png', // 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', // 'http://10.164.39.38/pandonia/{z}/{x}/{y}.png',
        minZoom: 1,
        maxZoom: 20,
        attributionControl: false
      },
      {
        name: 'Rail Ways',
        tilesURI: 'http://www.openptmap.org/tiles/{z}/{x}/{y}.png',
        minZoom: 1,
        maxZoom: 20,
        attributionControl: false
      }
    ];

    const shapeLayers: ShapeLayerDefinition[] = [
      {
        layerName: 'Test data 1',
        isDisplay: true,
        shapes: [
          // Uniqe group id (group0)
          {
            shapeWkt: 'POINT(35 32)',
            data: {
              name: '232 in gorup0',
              groupId: 'group0',
              // id: 'specialId1',
              type: 'intercept',
              // isSelected: true
            }
          },
          {
            shapeWkt: 'POINT(35 33)',
            data: {
              name: '233 in gorup0',
              groupId: 'group0',
              id: 'specialId2',
              type: 'intercept',
              isSelected: true
            }
          },
          {
            shapeWkt: 'POINT(30 30)',
            data: {
              name: '234 in gorup0',
              groupId: 'group0',
              id: 'specialId3',
              type: 'intercept',
            }
          },

          // Uniqe group id (samepoint1)
          {
            shapeWkt: 'POINT(42 42)',
            data: {
              name: 'a in samepoint1',
              groupId: 'samepoint1',
              id: 'samepoint1a',
              type: 'intercept',
              // isSelected: true
            }
          },
          {
            shapeWkt: 'POINT(42 42)',
            data: {
              name: 'b in samepoint1',
              groupId: 'samepoint1',
              id: 'samepoint1b',
              type: 'intercept',
              // isSelected: true
            }
          },

          {
            shapeWkt: 'POINT(43 43)',
            data: {
              name: 'c in samepoint1',
              groupId: 'samepoint1',
              id: 'samepoint1c',
              type: 'intercept',
              // isSelected: true
            }
          },
          {
            shapeWkt: 'POINT(43 43)',
            data: {
              name: 'd in samepoint1',
              groupId: 'samepoint1',
              id: 'samepoint1d',
              type: 'intercept',
              // isSelected: true
            }
          },

          // Uniqe group id (cell1)
          {
            shapeWkt: 'POLYGON((0 0 0,0 5 0,5 5 0,5 0 0,0 0 0))',
            data: {
              name: 'cell coverage in cell1',
              groupId: 'cell1',
              id: 'cell1coverage',
              count: 10
            }
          },
          {
            shapeWkt: 'POINT(1.40 6.285)',
            data: {
              name: 'cell point in cell1',
              groupId: 'cell1',
              id: 'cell1point',
              type: 'intercept',
            }
          },

          // Default group
          {
            shapeWkt: 'POINT(37 38)',
            data: {
              name: 'd1 in default group',
              id: 'd1'
            }
          },
          {
            shapeWkt: 'POINT(38 38)',
            data: {
              name: 'd2 in default group',
              id: 'd2',
              isSelected: true
            }
          },
          {
            shapeWkt: 'POINT(39 38)',
            data: {
              name: 'd3 in default group',
              id: 'd3',
            }
          },




          // {
          //   shapeWkt: 'POLYGON((0 0 0,0 5 0,5 5 0,5 0 0,0 0 0))',
          //   data: {
          //     name: 'cell 2',
          //     groupId: 'cell2',
          //     id: 'cell2area',
          //     count: 10
          //   }
          // },
          // {
          //   shapeWkt: 'POINT(1.40 3.285)',
          //   data: {
          //     name: 'cell 2',
          //     groupId: 'cell2',
          //     id: 'cell2center',
          //     type: 'intercept',
          //   }
          // },
        ]
      },
      // {
      //   layerName: 'Test data 2',
      //   isDisplay: false,
      //   shapes: [
      //     {
      //       shapeWkt: 'POINT(32 35)',
      //       data: {
      //         name: '232 (known as point0)',
      //         groupId: 'group00'
      //       }
      //     },
      //     {
      //       shapeWkt: 'POLYGON((0 0 0,0 5 0,5 5 0,5 0 0,0 0 0))',
      //       data: {
      //         name: '232 (known as polygon1)',
      //         groupId: 'group11',
      //         count: 20
      //       }
      //     },
      //     {
      //       shapeWkt: 'LINESTRING(1 1 1,5 5 5,7 7 5)',
      //       data: {
      //         name: '232 (known as polygon1)',
      //         groupId: 'group22'
      //       }
      //     }
      //   ]
      // }
    ];

    const layerManagerConfig: LayerManagerConfig = {
      enable: true,
      isImport: true
    };

    const scaleConfig: ScaleConfig = {
      enable: true,
      scaleOptions: {
        position: 'bottomright'
      }
    };

    const searchConfig: SearchConfig = {
      enable: true,
      searchOptions: {
        // searchOnLayer: true,
        queryServerUrl: 'http://nominatim.openstreetmap.org/search?format=json&q={s}' // protocol + '//osm/nominatim?format=json&limit=3&type=administrative&q={s}' // 'http://10.164.39.38/nominatim/search.php?format=json&q={s}' // 'http://nominatim.openstreetmap.org/search?format=json&q={s}' // 'http://nominatim.openstreetmap.org/search?format=json&q={s}'
      }
    };

    const miniMapConfig: MiniMapConfig = {
      enable: true,
      miniMapOptions: {
        toggleDisplay: true
      }
    };

    // const zoomControlConfig: ZoomConfig = {
    //   enable: true
    // };

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
        position: 'topright'
      }
    };

    const unitsChangerConfig: UnitsChangerConfig = {
      enable: true
    };
    const fullScreenConfig: FullScreenConfig = {
      enable: true
    };




    const toolbarConfig: ToolbarConfig = {
      isExport: true,
      isSettings: true,
      toolbarPluginsConfig: {
        layerManagerConfig, fullScreenConfig, measureConfig,
        unitsChangerConfig, zoomToExtentConfig,
        drawBarConfig, searchConfig
      }

    };
    const mapPluginsConfig: MapPluginsConfig = {
      miniMapConfig, scaleConfig, mouseCoordinateConfig
    };

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
